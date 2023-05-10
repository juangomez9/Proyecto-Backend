import express from "express";
import { prodRouter } from "./routers/products.router.js";
import { cartRouter } from "./routers/carts.router.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/carts", cartRouter)
app.use("/api/products", prodRouter)

const port = 8080;
app.listen(port, () => {
  console.log(`Escuchando el puerto ${port}`);
});
