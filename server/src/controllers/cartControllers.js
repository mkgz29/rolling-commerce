// MÓDULO: Cart
// Controllers disponibles y sus rutas:
// getCart    → GET    /api/cart                      (usuario logueado)
// addItem    → POST   /api/cart/add                  (usuario logueado)
// updateItem → PUT    /api/cart/item/:productId       (usuario logueado)
// clearCart  → DELETE /api/cart/clear                (usuario logueado)
// removeItem → DELETE /api/cart/item/:productId      (usuario logueado)
//
// El carrito siempre se busca por req.user._id — un usuario no puede tocar el carrito de otro.
// Para conectar con Orders: getCart devuelve items y total listos para generar una orden.
import mongoose from "mongoose";
import Cart from "../models/cart.js";
import Product from "../models/products.js";
// Devuelve el carrito del usuario logueado.
// Si no tiene carrito creado, devuelve un objeto vacío con items: [] y total: 0.
export const getCart = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    let cart = await Cart.findOne({ userId: req.user._id });

    if (!cart) {
      return res.status(200).json({
        userId: req.user._id,
        items: [],
        total: 0,
      });
    }

    const total = cart.items.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );

    res.status(200).json({
      _id: cart._id,
      userId: cart.userId,
      items: cart.items,
      total: parseFloat(total.toFixed(2)),
      updatedAt: cart.updatedAt,
    });

  } catch (error) {
    console.error("[getCart]", error);
    res.status(500).json({ message: "Error getting cart" });
  }
};
// Agrega un producto al carrito.
// Si el producto ya existe en el carrito, suma la quantity en lugar de duplicar el item.
// Si el usuario no tiene carrito, lo crea automáticamente.
// Body requerido: { productId, name, price, quantity (opcional, default 1) }
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

    const itemQuantity = quantity && quantity > 0 ? quantity : 1;

    if (!Number.isInteger(itemQuantity) || itemQuantity <= 0) {
      return res.status(400).json({ message: "Quantity must be a positive integer" });
    }

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

    const total = cart.items.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );

    res.status(200).json({
      _id: cart._id,
      userId: cart.userId,
      items: cart.items,
      total: parseFloat(total.toFixed(2)),
      updatedAt: cart.updatedAt,
    });

  } catch (error) {
    console.error("[addItem]", error);
    res.status(500).json({ message: "Error adding item to cart" });
  }
};
// Actualiza la cantidad de un producto en el carrito.
// Si quantity llega a 0, el item se elimina automáticamente.
// Params: productId. Body requerido: { quantity }
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

    if (quantity === undefined || quantity < 0 || !Number.isInteger(quantity)) {
      return res.status(400).json({ message: "Valid quantity (non-negative integer) is required" });
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

    if (quantity === 0) {
      cart.items.splice(itemIndex, 1);
    } else {
      cart.items[itemIndex].quantity = quantity;
    }

    await cart.save();

    const total = cart.items.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );

    res.status(200).json({
      _id: cart._id,
      userId: cart.userId,
      items: cart.items,
      total: parseFloat(total.toFixed(2)),
      updatedAt: cart.updatedAt,
    });

  } catch (error) {
    console.error("[updateItem]", error);
    res.status(500).json({ message: "Error updating item" });
  }
};
// Elimina un producto específico del carrito.
// Params: productId.
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

    const total = cart.items.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );

    res.status(200).json({
      _id: cart._id,
      userId: cart.userId,
      items: cart.items,
      total: parseFloat(total.toFixed(2)),
      updatedAt: cart.updatedAt,
    });

  } catch (error) {
    console.error("[removeItem]", error);
    res.status(500).json({ message: "Error removing item from cart" });
  }
};
// Vacía el carrito completo — deja items: [] pero mantiene el documento en la DB.
// El documento se mantiene para no perder la referencia del usuario.
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
      _id: cart._id,
      userId: cart.userId,
      items: [],
      total: 0,
    });

  } catch (error) {
    console.error("[clearCart]", error);
    res.status(500).json({ message: "Error clearing cart" });
  }
};