import fs from "fs";

export default class CartManager {
  constructor(path) {
    this.path = path;
    if (!fs.existsSync(path)) {
      fs.promises.writeFile(path, JSON.stringify([]));
    }
  }

  async getCarts() {
    try {
      const data = await fs.promises.readFile(this.path, "utf-8");
      return JSON.parse(data);
    } catch (err) {
      throw new Error("Error al obtener los carritos", err);
    }
  }

  async getCart(cartId) {
    const carts = await this.getCarts();
    const cart = carts.find((c) => c.id === cartId);
    if (cart) {
      return cart;
    } else {
      throw new Error("Cart not found");
    }
  }

  async createCart() {
    try {
      const carts = await this.getCarts();
      const cartId = carts.length > 0 ? carts[carts.length - 1].id + 1 : 0;
      const newCart = { id: cartId, products: [] };
      carts.push(newCart);
      await fs.promises.writeFile(this.path, JSON.stringify(carts));
      return newCart;
    } catch (err) {
      throw new Error("Error al crear el carrito", err);
    }
  }

  async addProductToCart(cartId, productId, quantity) {
    try {
      const carts = await this.getCarts();
      const cartIndex = carts.findIndex((c) => c.id === cartId);
      if (cartIndex === -1) {
        return false;
      }
      const cart = carts[cartIndex];
      const productIndex = cart.products.findIndex((p) => p.id === productId);
      if (productIndex === -1) {
        cart.products.push({ id: productId, quantity });
      } else {
        cart.products[productIndex].quantity += quantity;
      }
      await fs.promises.writeFile(this.path, JSON.stringify(carts));
      return true;
    } catch (err) {
      throw new Error("No se pudo agregar el producto al carrito", err);
    }
  }
}
