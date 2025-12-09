const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/productController");

router.post("/", ctrl.createProduct); // POST /products
router.post("/:id/increase", ctrl.increaseStock); // POST /products/:id/increase
router.post("/:id/decrease", ctrl.decreaseStock); // POST /products/:id/decrease
router.get("/:id", ctrl.getProductSummary); // GET /products/:id
router.get("/:id/transactions", ctrl.getTransactions); // GET /products/:id/transactions

module.exports = router;
