import express from "express";
import { prodRouter } from "./routers/products.router.js";
import { cartRouter } from "./routers/carts.router.js";
import { viewsRouter } from "./routers/views.router.js";
import handlebars from "express-handlebars";
import { Server } from "socket.io";
import ProductManager from "./ProductManager.js";

const productManager = new ProductManager("./data/products.json")

const app = express();

app.engine("handlebars", handlebars.engine());
app.set("views", "views/");
app.set("view engine", "handlebars");
app.use(express.static("public"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/carts", cartRouter);
app.use("/api/products", prodRouter);
app.use("/", viewsRouter);

const httpServer = app.listen(8080, () => {
  console.log(`Escuchando el puerto 8080`);
});

const socketServer = new Server(httpServer);

socketServer.on("connection", async (socket) => {
  console.log("Cliente conectado");

  socket.on("newProduct", async (newProduct) => {
    await productManager.addProduct(newProduct);
  });

  socket.on("deleteProduct", async (productId) => {
    await productManager.deleteProduct(productId);
  });
});