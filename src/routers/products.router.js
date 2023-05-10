import { Router } from "express";
import ProductManager from "../ProductManager.js";

const productManager = new ProductManager("./data/products.json");
const prodRouter = Router();

prodRouter.get("/", async (req, res) => {
  let limit = req.query.limit || 0;
  try {
    let allProducts = await productManager.getProducts(limit);
    res.send(allProducts);
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

prodRouter.get("/:pid", async (req, res) => {
  const pid = parseInt(req.params.pid);
  try {
    const product = await productManager.getProductById(pid);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ error: "Product not found" });
    }
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

const validateProductFields = (req, res, next) => {
  const { title, description, code, price, stock, category, thumbnails } = req.body;
  if (!title || !description || !code || !price || !stock || !category || !thumbnails) {
    return res.status(400).json({ error: "Todos los campos son requeridos" });
  }
  next();
}

prodRouter.post("/", validateProductFields, async (req, res) => {
  try {
    const { title, description, code, price, stock, category, thumbnails } =
      req.body;
    const product = {
      title,
      description,
      code,
      price,
      status: true,
      stock,
      category,
      thumbnails: [thumbnails]
    };
    await productManager.addProduct(product);
    res.status(201).json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

prodRouter.put("/:pid", async (req, res) => {
  const pid = parseInt(req.params.pid);
  const product = req.body;
  try {
    const updatedProduct = await productManager.updateProduct(pid, product);
    res.json(updatedProduct);
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

prodRouter.delete("/:pid", async (req, res) => {
  const pid = parseInt(req.params.pid);
  try {
    await productManager.deleteProduct(pid);
    res.sendStatus(204);
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

export { prodRouter };
