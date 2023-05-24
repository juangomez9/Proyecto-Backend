import express from "express";
import ProductManager from "../ProductManager.js";

const productManager = new ProductManager("./data/products.json");
const viewsRouter = express.Router();

viewsRouter.get("/", async (req, res) => {
  try {
    const prod = await productManager.getProducts();
    res.render("index", { prod });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

viewsRouter.get("/realTimeProducts", async (req, res) => {
  try {
    const prod = await productManager.getProducts();
    res.render("realTimeProducts", { prod });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

export { viewsRouter };
