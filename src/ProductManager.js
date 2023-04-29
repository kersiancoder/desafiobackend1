const fs = require("fs");

class ProductManager {
    constructor(path) {
        this.path = path;
        this.products = [];
        this.currentId = 0;
    }

    async loadData() {
        try {
            const data = await fs.promises.readFile(this.path, "utf-8");
            const parsedData = JSON.parse(data);
            this.products = parsedData;
        } catch (error) {
            console.log("Error loading data!");
        }
    }
    
    async saveData() {
        try {
            await fs.promises.writeFile(this.path, JSON.stringify(this.products, null, 2),"utf-8");
        } catch (error) {
            console.log("Error saving data!");
        }
    }
    
    async addProduct(product) {
        if (this.products.some((item) => item.code === product.code)) {
            return "Product already exists";
    }
        if (
        !product.title ||
        !product.description ||
        !product.price ||
        !product.thumbnail ||
        !product.code ||
        !product.stock
        ) {
        return "Product is missing required properties";
        }
        product = { id: ++this.currentId, ...product };
        this.products.push(product);
        await this.saveData();
        return "Product added successfully";
    }

    async updateProduct(id, product) {
        await this.loadData();
        const productIndex = this.products.findIndex((product) => product.id === id);
        if (productIndex === -1) {
            return "Product not found";
        }
        this.products[productIndex] = { ...this.products[productIndex], ...product, id: this.products[productIndex].id };
        await this.saveData();
        return "Product updated successfully";
    }

    async deleteProduct(id) {
        await this.loadData();
        const productIndex = this.products.findIndex((product) => product.id === id);
        if (productIndex === -1) {
            return "Product not found";
        }
        this.products.splice(productIndex, 1);
        await this.saveData();
        return "Product deleted successfully";
    }
    

    async getProducts() {
        await this.loadData();
        return this.products.length > 0 ? this.products : "No products";
    }

    async getProductById(id) {
        await this.loadData();
        return this.products.find((product) => product.id === id) ?? "Not Found";
    }

}

tests();

async function tests() {

    const myProductManager = new ProductManager("products.json");

    const product1 = {
        title: "Producto 1",
        description: "Este es un producto prueba 1",
        price: 1000,
        thumbnail: "https://google.com",
        code: "111222",
        stock: 10,
    };

    console.log(await myProductManager.addProduct(product1));
    console.log(await myProductManager.getProducts());
    // console.log(await myProductManager.getProductById(1));

    const productOneUpdates = {
        title: "Producto 1 actualizado",
        description: "Descripción actualizada",
    };

    console.log(await myProductManager.updateProduct(1, productOneUpdates));
    console.log(await myProductManager.getProducts());


    const product2 = {
        title: "Producto 2",
        description: "Este es un producto prueba 2",
        price: 1500,
        thumbnail: "https://yahoo.com",
        code: "222333",
        stock: 20,
    };
    
    console.log(await myProductManager.addProduct(product2));
    console.log(await myProductManager.getProducts());

    console.log(await myProductManager.deleteProduct(2));
    console.log(await myProductManager.getProducts());
    
}
