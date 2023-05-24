import fs from "fs";

export default class ProductManager {
  constructor(path) {
    this.path = path;
    if (!fs.existsSync(path)) {
      fs.promises.writeFile(path, JSON.stringify([]));
    }
  }

  async addProduct(product) {
    try {
      const products = await this.getProducts();
      const id = await this.getId(products);
      product.id = id;
      products.push(product);
      await fs.promises.writeFile(this.path, JSON.stringify(products));
    } catch (err) {
      throw new Error("Error al agregar el producto");
    }
  }

  async getProducts(limit) {
    try {
      const products = await fs.promises.readFile(this.path, "utf-8");
      if (limit > 0) {
        return JSON.parse(products).slice(0, limit);
      } else {
        return JSON.parse(products);
      }
    } catch (err) {
      throw new Error("No puedo mostrar los productos");
    }
  }

  async getProductById(id) {
    try {
      const products = await this.getProducts();
      let product = products.find((prod) => prod.id === id);
      return product || null;
    } catch (err) {
      throw new Error("Error al buscar el producto por ID");
    }
  }

  async getId(products) {
    return products.length > 0 ? products[products.length - 1].id + 1 : 0;
  }

  async updateProduct(id, patchProduct) {
    try {
      const products = await this.getProducts();
      const productIndex = products.findIndex((prod) => prod.id === id);
      if (productIndex === -1) {
        throw new Error("No se encontró el producto");
      }
      const updatedProduct = { ...products[productIndex], ...patchProduct };
      products[productIndex] = updatedProduct;
      await fs.promises.writeFile(this.path, JSON.stringify(products));
      return updatedProduct;
    } catch (err) {
      throw new Error("Error al actualizar el producto");
    }
  }

  async deleteProduct(id) {
    try {
      const products = await this.getProducts();
      const productIndex = products.findIndex(
        (prod) => prod.id === parseInt(id)
      );
      if (productIndex === -1) {
        throw new Error("No se encontró el producto");
      }
      const deletedProduct = products.splice(productIndex, 1)[0];
      await fs.promises.writeFile(this.path, JSON.stringify(products));
      return deletedProduct;
    } catch (err) {
      throw new Error("Error al eliminar el producto");
    }
  }
}