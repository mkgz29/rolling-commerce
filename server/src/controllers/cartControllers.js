import mongoose from "mongoose";
import Cart from "../models/cart.js";
import Product from "../models/products.js";
import { parseQuantity } from "../utils/validators.js";

const buildCartResponse = (cart) => {
  const items = cart.items.map((item) => {
    const populatedProduct = item.productId && item.productId.name ? item.productId : null;

    return {
      productId: populatedProduct?._id ?? item.productId,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      product: populatedProduct
        ? {
            _id: populatedProduct._id,
            name: populatedProduct.name,
            description: populatedProduct.description,
            image: populatedProduct.image,
            images: populatedProduct.images,
            category: populatedProduct.category,
            stock: populatedProduct.stock,
          }
        : null,
    };
  });

  const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return {
    _id: cart._id,
    userId: cart.userId,
    items,
    total: parseFloat(total.toFixed(2)),
    updatedAt: cart.updatedAt,
  };
};
export const getCart = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    let cart = await Cart.findOne({ userId: req.user._id }).populate("items.productId");

    if (!cart) {
      return res.status(200).json({
        userId: req.user._id,
        items: [],
        total: 0,
      });
    }

    res.status(200).json(buildCartResponse(cart));
  } catch (error) {
    console.error("[getCart]", error);
    res.status(500).json({ message: "Error getting cart" });
  }
};

export const addItem = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { productId, quantity } = req.body;

    if (!productId) {
      return res.status(400).json({ message: "productId is required" });
    }

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: "Invalid product ID format" });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const itemQuantity = quantity === undefined ? 1 : parseQuantity(quantity);

    if (itemQuantity > product.stock) {
      return res.status(400).json({ message: `Requested quantity exceeds stock. Available: ${product.stock}` });
    }

    let cart = await Cart.findOne({ userId: req.user._id });

    if (!cart) {
      cart = new Cart({
        userId: req.user._id,
        items: [],
      });
    }

    const existingItem = cart.items.find(
      (item) => item.productId.toString() === productId
    );

    if (existingItem) {
      const newQuantity = existingItem.quantity + itemQuantity;
      if (newQuantity > product.stock) {
        return res.status(400).json({ message: `Requested quantity exceeds stock. Available: ${product.stock}` });
      }
      existingItem.quantity = newQuantity;
    } else {
      cart.items.push({
        productId,
        name: product.name,
        price: product.price,
        quantity: itemQuantity,
      });
    }

    await cart.save();
    await cart.populate("items.productId");

    res.status(200).json(buildCartResponse(cart));
  } catch (error) {
    console.error("[addItem]", error);
    res.status(error.statusCode || 500).json({ message: error.statusCode ? error.message : "Error adding item to cart" });
  }
};

export const updateItem = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { productId } = req.params;
    const { quantity } = req.body;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: "Invalid product ID format" });
    }

    const itemQuantity = parseQuantity(quantity, { allowZero: true });

    const cart = await Cart.findOne({ userId: req.user._id });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (itemIndex === -1) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    if (itemQuantity === 0) {
      cart.items.splice(itemIndex, 1);
    } else {
      cart.items[itemIndex].quantity = itemQuantity;
    }

    await cart.save();
    await cart.populate("items.productId");

    res.status(200).json(buildCartResponse(cart));
  } catch (error) {
    console.error("[updateItem]", error);
    res.status(error.statusCode || 500).json({ message: error.statusCode ? error.message : "Error updating item" });
  }
};
export const removeItem = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { productId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: "Invalid product ID format" });
    }

    const cart = await Cart.findOne({ userId: req.user._id });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (itemIndex === -1) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    cart.items.splice(itemIndex, 1);

    await cart.save();
    await cart.populate("items.productId");

    res.status(200).json(buildCartResponse(cart));
  } catch (error) {
    console.error("[removeItem]", error);
    res.status(500).json({ message: "Error removing item from cart" });
  }
};
export const clearCart = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const cart = await Cart.findOne({ userId: req.user._id });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    cart.items = [];
    await cart.save();

    res.status(200).json({
      message: "Cart cleared successfully",
      ...buildCartResponse(cart),
    });
  } catch (error) {
    console.error("[clearCart]", error);
    res.status(500).json({ message: "Error clearing cart" });
  }
};
