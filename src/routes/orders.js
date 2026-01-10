const express = require("express");
const { body, param } = require("express-validator");
const {
  getOrders,
  createOrder,
  updateOrderStatus,
  processPayment,
} = require("../controllers/orderController");
const auth = require("../middleware/auth");

const router = express.Router();

/* =====================================================
   CREATE ORDER (STAFF)
===================================================== */
router.post(
  "/add/staff",
  auth(["RESTAURANT_ADMIN", "MANAGER", "CHEF", "WAITER", "CASHIER"]),
  [
    body("items")
      .isArray({ min: 1 })
      .withMessage("Items are required"),

    body("items.*.menuId")
      .notEmpty()
      .withMessage("Menu ID is required"),

    body("items.*.quantity")
      .isInt({ min: 1 })
      .withMessage("Quantity must be at least 1"),

    body("customerName")
      .trim()
      .notEmpty()
      .withMessage("Customer name is required"),

    body("customerPhone")
      .optional()
      .isMobilePhone()
      .withMessage("Invalid phone number"),
  ],
  createOrder
);

/* =====================================================
   AUTH FOR ALL BELOW ROUTES
===================================================== */
router.use(
  auth(["RESTAURANT_ADMIN", "MANAGER", "CHEF", "WAITER", "CASHIER"])
);

/* =====================================================
   GET ALL ORDERS
===================================================== */
router.get("/all/orders", getOrders);

/* =====================================================
   UPDATE ORDER STATUS
===================================================== */
router.patch(
  "/update/status/:id",
  [
    param("id")
      .isMongoId()
      .withMessage("Invalid order ID"),

    body("status")
      .isIn([
        "PENDING",
        "ORDER_ACCEPTED",
        "PREPARING",
        "READY",
        "SERVED",
        "COMPLETE",
        "CANCELLED",
      ])
      .withMessage("Invalid order status"),
  ],
  updateOrderStatus
);

/* =====================================================
   PROCESS PAYMENT
===================================================== */
router.patch(
  "/payment/:id",
  [
    param("id")
      .isMongoId()
      .withMessage("Invalid order ID"),

    body("method")
      .isIn(["CASH", "CARD", "UPI", "ONLINE"])
      .withMessage("Invalid payment method"),

    body("amount")
      .isFloat({ min: 0 })
      .withMessage("Invalid payment amount"),

    body("transactionId")
      .optional()
      .isString(),
  ],
  processPayment
);

module.exports = router;
