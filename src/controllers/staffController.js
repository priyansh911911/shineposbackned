const bcrypt = require('bcryptjs');
const TenantModelFactory = require('../models/TenantModelFactory');

const createStaff = async (req, res) => {
  try {
    const { email, password, name, role, permissions, phone, salaryType, salaryAmount, hourlyRate, dayRate, overtimeRate, shiftSchedule } = req.body;
    const restaurantSlug = req.user.restaurantSlug;
    
    
    
    
    
    if (!restaurantSlug) {
      return res.status(400).json({ error: 'Restaurant slug is required' });
    }
    
    const StaffModel = TenantModelFactory.getStaffModel(restaurantSlug);
    
    // Check if staff with email already exists
    const existingStaff = await StaffModel.findOne({ email });
    if (existingStaff) {
      return res.status(400).json({ error: 'Staff member with this email already exists' });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const staffData = {
      email,
      password: hashedPassword,
      name,
      role,
      permissions: permissions || [],
      phone,
      salaryType: salaryType || 'fixed',
      salaryAmount: salaryAmount || 0,
      hourlyRate: hourlyRate || 0,
      dayRate: dayRate || 0,
      overtimeRate: overtimeRate || 0,
      shiftSchedule: shiftSchedule || {
        shiftType: 'fixed',
        fixedShift: {
          startTime: '09:00',
          endTime: '17:00',
          workingDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday']
        }
      }
    };
    
    const staff = new StaffModel(staffData);
    await staff.save();
    
    // Force save shiftSchedule using MongoDB collection directly
    if (staffData.shiftSchedule) {
      await StaffModel.collection.updateOne(
        { _id: staff._id },
        { $set: { shiftSchedule: staffData.shiftSchedule } }
      );
    }
    
    const finalStaff = await StaffModel.findById(staff._id);
    
    const { password: _, ...responseData } = staff.toObject();
    res.status(201).json({ message: 'Staff member created successfully', staff: responseData });
  } catch (error) {
    console.error('Create staff error:', error);
    console.error('Error stack:', error.stack);
    console.error('Error message:', error.message);
    res.status(500).json({ error: 'Failed to create staff member', details: error.message });
  }
};

const getStaff = async (req, res) => {
  try {
    const restaurantSlug = req.user.restaurantSlug;
    const StaffModel = TenantModelFactory.getStaffModel(restaurantSlug);
    
    const staff = await StaffModel.find({ isActive: true }).select('-password').sort({ createdAt: -1 });
    
    res.json({ staff });
  } catch (error) {
    console.error('Get staff error:', error);
    res.status(500).json({ error: 'Failed to fetch staff' });
  }
};

const updateStaff = async (req, res) => {
  try {
    const { id } = req.params;
    const restaurantSlug = req.user.restaurantSlug;
    const StaffModel = TenantModelFactory.getStaffModel(restaurantSlug);
    
    
    
    
    
    const staff = await StaffModel.findById(id);
    if (!staff) {
      return res.status(404).json({ error: 'Staff member not found' });
    }
    
    const updateData = { ...req.body };
    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }
    
    
    
    
    Object.assign(staff, updateData);
    await staff.save();
    
    // Force save shiftSchedule using MongoDB collection directly
    if (updateData.shiftSchedule) {
      await StaffModel.collection.updateOne(
        { _id: staff._id },
        { $set: { shiftSchedule: updateData.shiftSchedule } }
      );
    }
    
    const finalStaff = await StaffModel.findById(staff._id);
    
    const { password: _, ...staffData } = finalStaff.toObject();
    res.json({ message: 'Staff member updated successfully', staff: staffData });
  } catch (error) {
    console.error('Update staff error:', error);
    res.status(500).json({ error: 'Failed to update staff member' });
  }
};

const scheduleShift = async (req, res) => {
  try {
    const { id } = req.params;
    const { date, startTime, endTime } = req.body;
    const restaurantSlug = req.user.restaurantSlug;
    const StaffModel = TenantModelFactory.getStaffModel(restaurantSlug);
    
    const staff = await StaffModel.findById(id);
    if (!staff) {
      return res.status(404).json({ error: 'Staff member not found' });
    }

    staff.shifts.push({ date, startTime, endTime });
    await staff.save();

    res.json({ message: 'Shift scheduled successfully', staff });
  } catch (error) {
    console.error('Schedule shift error:', error);
    res.status(500).json({ error: 'Failed to schedule shift' });
  }
};

const assignOvertime = async (req, res) => {
  try {
    const { id } = req.params;
    const { date, hours, reason } = req.body;
    const restaurantSlug = req.user.restaurantSlug;
    const currentUserId = req.user.userId || req.user.id;
    const StaffModel = TenantModelFactory.getStaffModel(restaurantSlug);
    
    const staff = await StaffModel.findById(id);
    if (!staff) {
      return res.status(404).json({ error: 'Staff member not found' });
    }

    staff.overtimeRequests.push({
      date,
      hours,
      reason,
      status: 'pending',
      assignedBy: currentUserId
    });
    await staff.save();

    res.json({ message: 'Overtime assigned successfully', overtimeRequest: staff.overtimeRequests[staff.overtimeRequests.length - 1] });
  } catch (error) {
    console.error('Assign overtime error:', error);
    res.status(500).json({ error: 'Failed to assign overtime' });
  }
};

const respondToOvertime = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { status } = req.body;
    const restaurantSlug = req.user.restaurantSlug;
    const currentUserId = req.user.userId || req.user.id;
    const StaffModel = TenantModelFactory.getStaffModel(restaurantSlug);
    
    if (!['accepted', 'declined'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }
    
    const staff = await StaffModel.findOne({ 'overtimeRequests._id': requestId });
    if (!staff) {
      return res.status(404).json({ error: 'Overtime request not found' });
    }
    
    if (staff._id.toString() !== currentUserId) {
      return res.status(403).json({ error: 'Can only respond to your own overtime requests' });
    }
    
    const overtimeRequest = staff.overtimeRequests.id(requestId);
    if (overtimeRequest.status !== 'pending') {
      return res.status(400).json({ error: 'Overtime request already responded' });
    }
    
    overtimeRequest.status = status;
    overtimeRequest.respondedAt = new Date();
    await staff.save();

    res.json({ message: `Overtime ${status} successfully`, overtimeRequest });
  } catch (error) {
    console.error('Respond to overtime error:', error);
    res.status(500).json({ error: 'Failed to respond to overtime' });
  }
};

const getMyOvertimeRequests = async (req, res) => {
  try {
    const restaurantSlug = req.user.restaurantSlug;
    const currentUserId = req.user.userId || req.user.id;
    const StaffModel = TenantModelFactory.getStaffModel(restaurantSlug);
    
    const staff = await StaffModel.findById(currentUserId);
    if (!staff) {
      return res.status(404).json({ error: 'Staff member not found' });
    }

    res.json({ overtimeRequests: staff.overtimeRequests || [] });
  } catch (error) {
    console.error('Get overtime requests error:', error);
    res.status(500).json({ error: 'Failed to fetch overtime requests' });
  }
};

const updatePerformance = async (req, res) => {
  try {
    const { id } = req.params;
    const { ordersProcessed, averageOrderTime, customerRating } = req.body;
    const restaurantSlug = req.user.restaurantSlug;
    const StaffModel = TenantModelFactory.getStaffModel(restaurantSlug);
    
    const staff = await StaffModel.findById(id);
    if (!staff) {
      return res.status(404).json({ error: 'Staff member not found' });
    }
    
    staff.performance = {
      ordersProcessed,
      averageOrderTime,
      customerRating
    };
    await staff.save();
    
    const { password: _, ...staffData } = staff.toObject();
    res.json({ message: 'Performance updated successfully', staff: staffData });
  } catch (error) {
    console.error('Update performance error:', error);
    res.status(500).json({ error: 'Failed to update performance' });
  }
};

module.exports = {
  createStaff,
  getStaff,
  updateStaff,
  scheduleShift,
  updatePerformance,
  assignOvertime,
  respondToOvertime,
  getMyOvertimeRequests
};
