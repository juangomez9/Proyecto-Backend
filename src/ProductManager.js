import fs from "fs";

export default class ProductManager {
  constructor(path) {
    this.path = path;
    if (!fs.existsSync(path)) {
      fs.promises.writeFile(path, JSON.stringify([]));
    }
  }

  async addProduct(product) {
    if (
      (!product.title ||
        !product.description ||
        !product.price ||
        !product.thumbnail ||
        "",
      !product.code || !product.stock)
    ) {
      console.log("Faltan campos obligatorios");
      return;
    }
    try {
      const products = await this.getProducts();
      const id = await this.getId(products);
      product.id = id;
      products.push(product);
      await fs.promises.writeFile(this.path, JSON.stringify(products));
    } catch (err) {
      console.log("No se pudo agregar el producto.");
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
      console.log("No puedo mostrar los productos");
    }
  }

  async getProductById(id) {
    try {
      const products = await this.getProducts();
      return products.find((prod) => prod.id == id);
    } catch (err) {
      console.log("No se pudo encontrar el producto");
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
        return false;
      }
      const updatedProduct = { ...products[productIndex], ...patchProduct };
      products.splice(productIndex, 1, updatedProduct);
      await fs.promises.writeFile(this.path, JSON.stringify(products));
      return true;
    } catch (err) {
      console.log("No se pudo actualizar el producto");
      return false;
    }
  }

  async deleteProduct(id) {
    try {
      const products = await this.getProducts();
      const productIndex = products.findIndex((prod) => prod.id === id);
      if (productIndex === -1) {
        return false;
      }
      products.splice(productIndex, 1);
      await fs.promises.writeFile(this.path, JSON.stringify(products));
      return true;
    } catch (err) {
      console.log("No se pudo eliminar el producto");
      return false;
    }
  }
}

if (!fs.existsSync("./data/products.json")) {
  const products = new ProductManager("./data/products.json");
  const test = async () => {
    try {
      await products.addProduct({
        title: "Coca Cola",
        description: "Gaseosa de 2 litros",
        price: 600,
        thumbnail: "",
        code: 22,
        stock: 50,
      });
      await products.addProduct({
        title: "Spite",
        description: "Gaseosa de 3 litros",
        price: 800,
        thumbnail: "",
        code: 21,
        stock: 50,
      });
      await products.addProduct({
        title: "Pritty",
        description: "Gaseosa de 3 litros",
        price: 800,
        thumbnail: "",
        code: 21,
        stock: 50,
      });
      await products.addProduct({
        title: "Fernet",
        description: "Gaseosa de 3 litros",
        price: 800,
        thumbnail: "",
        code: 21,
        stock: 50,
      });
      const allProducts = await products.getProducts();
      console.log(allProducts);
    } catch (err) {
      console.log("Algo salio mal");
    }
  };

  test();
}
