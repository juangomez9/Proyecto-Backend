import { Router } from "express";
import CartManager from "../CartManager.js";

const cartManager = new CartManager("./data/cart.json");
const cartRouter = Router();

cartRouter.post("/", async (req, res) => {
  try {
    const cart = await cartManager.createCart();
    res.status(201).json(cart);
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

cartRouter.get("/:cid", async (req, res) => {
  const cartId = parseInt(req.params.cid);
  try {
    const carts = await cartManager.getCart(cartId);
    if (carts) {
      res.json(carts);
    } else {
      res.status(404).json({ error: "Cart not found" });
    }
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

cartRouter.post("/:cid/product/:pid", async (req, res) => {
  const cartId = parseInt(req.params.cid);
  const prodId = parseInt(req.params.pid);
  try {
    const quantity = 1;
    const added = await cartManager.addProductToCart(cartId, prodId, quantity);
    if (added) {
      res.sendStatus(200);
    } else {
      res.status(404).json({ error: "Cart not found" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export { cartRouter };
