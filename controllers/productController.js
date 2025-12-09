const Product = require("../models/Product");
const Transaction = require("../models/Transaction");

exports.createProduct = async (req, res) => {
  try {
    const { name, sku, initialStock } = req.body;
    if (initialStock == null || initialStock < 0)
      return res.status(400).json({ error: "initialStock must be >= 0" });

    const exists = await Product.findOne({ sku });
    if (exists) return res.status(400).json({ error: "SKU already exists" });

    const product = await Product.create({ name, sku, stock: initialStock });

    if (initialStock > 0) {
      await Transaction.create({
        productId: product._id,
        type: "INCREASE",
        quantity: initialStock,
      });
    }

    return res.status(201).json(product);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
};

async function changeStock(req, res, type) {
  try {
    const { id } = req.params;
    const { quantity } = req.body;
    if (!Number.isInteger(quantity) || quantity <= 0)
      return res
        .status(400)
        .json({ error: "quantity must be a positive integer" });

    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ error: "Product not found" });

    if (type === "DECREASE" && product.stock - quantity < 0) {
      return res.status(400).json({ error: "Insufficient stock" });
    }

    product.stock =
      type === "INCREASE" ? product.stock + quantity : product.stock - quantity;
    await product.save();

    const tx = await Transaction.create({
      productId: product._id,
      type,
      quantity,
    });
    return res.json({ product, transaction: tx });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
}

exports.increaseStock = (req, res) => changeStock(req, res, "INCREASE");
exports.decreaseStock = (req, res) => changeStock(req, res, "DECREASE");

exports.getProductSummary = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id).lean();
    if (!product) return res.status(404).json({ error: "Product not found" });

    const totals = await Transaction.aggregate([
      { $match: { productId: product._id } },
      { $group: { _id: "$type", total: { $sum: "$quantity" } } },
    ]);

    const totalIncreased =
      (totals.find((t) => t._id === "INCREASE") || {}).total || 0;
    const totalDecreased =
      (totals.find((t) => t._id === "DECREASE") || {}).total || 0;

    return res.json({
      product,
      currentStock: product.stock,
      totalIncreased,
      totalDecreased,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
};

exports.getTransactions = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ error: "Product not found" });

    const txs = await Transaction.find({ productId: id })
      .sort({ timestamp: -1 })
      .lean();
    return res.json(txs);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
};
