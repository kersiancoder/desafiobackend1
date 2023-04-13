class ProductManager {
    constructor() {
        this.products = [];
    }
    static productId = 0;

    addProduct(title, description, price, thumbnail, code, stock, productId = ProductManager.productId + 1) {
        let product = {
            title: title,
            description: description,
            price: price,
            thumbnail: thumbnail,
            code: code,
            stock: stock,
            productId: productId++
        }
        let verifyCode = this.products.find(p => p.code == code);
        if(verifyCode === undefined) {
            console.log(`${product.title} was added to the list of products.`);
            ProductManager.productId++;
            return this.products.push(product)
        } else {
            console.log(`${product.title} code ${product.code} is already registered.`)
        }
    }

    getProducts() {
        console.log(this.products)
        return this.products
    }

    getProductById(productId) {
        let findProduct = this.products.find(p => p.productId === productId)
        if (findProduct !== undefined) {
            return console.log(findProduct)
        } else {
            console.log("Not found.")
        }
    }

}

const products = new ProductManager()

products.getProducts();
products.addProduct("Producto 1", "Este es un producto de prueba 1", 200, "http://google.com", "aaa123", 10);
products.getProducts();
products.addProduct("Producto 2", "Este es un producto de prueba 2", 200, "http://google.com", "aaa123", 20);
products.getProducts();
products.addProduct("Producto 3", "Este es un producto de prueba 2", 200, "http://google.com", "bbb123", 30);
products.getProducts();
products.getProductById(1);



