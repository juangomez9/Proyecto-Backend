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
    res.status(404).send({ error: `No se encontró ningún producto con el ID ${req.params.pid}` });
  }
});

const port = 8080
app.listen(port, () => {
  console.log(`Escuchando el puerto ${port}`);
});
