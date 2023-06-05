import fs from 'fs';
import ProductManager from './productManager.js';
const productManager = new ProductManager("./src/data/products.json");

class CartManager {
    constructor(path) {
        this.path = path;
    };

    async createCart() {
        try {
            let carts = []
            if (fs.existsSync(this.path)){
                const cartStr = await fs.promises.readFile(this.path, 'utf-8');
                carts = JSON.parse(cartStr);
            }
            const id = carts.length>0 ? carts[carts.length-1].id + 1 : 1;
            const newCart = {id, products:[]}
            carts.push(newCart);
            await fs.promises.writeFile(this.path, JSON.stringify(carts, null, 2));
            return newCart;
        } catch (err) {
            throw new Error(err+' Error getting carts');
        }
    };

    async getCartById(id) {
      try {
        if (fs.existsSync(this.path)){
            const cartStr = await fs.promises.readFile(this.path, 'utf-8');
            let carts = JSON.parse(cartStr);
            let cartFound = carts.find((c)=>c.id === id);
            return !cartFound ? `Cart with id ${id} not found`: cartFound.products;
        } else {
            return 'Cart does not exist';
        }
      } catch (err) {
        throw new Error(err);
      }
    };

    async addProductToCart(cartId, prodId, qty){
      try{
        let quantity= qty||1;
        const cartStr = await fs.promises.readFile(this.path, 'utf-8');
        let carts = JSON.parse(cartStr);
        const cartIndex = carts.findIndex((elem)=> elem.id = cartId)
        if (cartIndex === -1) {
          return `Cart with id ${cartId} not found`;
        }
        let prodInCart = carts[cartIndex].products.findIndex((elem)=>elem.id === prodId)
        if(prodInCart===-1){
          const prod = await productManager.getProductById(prodId)
          if (!prod) {
            return `Product with id ${prodId} not found`;
          }     
          const newProd = { id: prodId, quantity };
          carts[cartIndex].products.push(newProd);
        } else {
          carts[cartIndex].products[prodInCart].quantity += quantity;
        }

        await fs.promises.writeFile(this.path, JSON.stringify(carts, null, 2));
        return carts[cartIndex].products.length>0 ? carts[cartIndex].products[prodInCart] : 'The cart is empty';
      } catch (err) {
        throw new Error(err);
      }
    };
};

export default CartManager;