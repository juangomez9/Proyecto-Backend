import express from "express";
import ProductManager from "./ProductManager.js";

const app = express();
const productManager = new ProductManager("./data/products.json");

app.use(express.urlencoded({ extended: true }));

app.get("/products", async (req, res) => {
  let limit = req.query.limit || 0;
  try {
    let allProducts = await productManager.getProducts(limit);
    res.send(allProducts);
  } catch (err) {
    res.send(err);
  }
});

app.get("/products/:pid", async (req, res) => {
  try {
    let id = req.params.pid;
    let product = await productManager.getProductById(id);
    res.send(product);
  } catch (err) {
    res.send(err);
  }
});

app.listen("8080", () => {
  console.log("Escuchando el puerto 8080");
});
