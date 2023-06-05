import express from 'express';
import ProductService from '../services/products.service.js';


const viewsRouter = express.Router();
const productService = new ProductService;

viewsRouter.get('/', async (req, res)=> {
    try{
        const prods = await productService.getAllProducts();
        res.render('index', {prods});
    } catch(error) {
        console.log(error)
    }
});

viewsRouter.get('/realtimeproducts', async (req, res)=> {
    try{
        const prods = await productService.getAllProducts();
        res.render('realTimeProducts', {prods});
    } catch(error){
        console.log(error)
    }
});

export default viewsRouter;