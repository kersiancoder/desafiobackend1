import express from 'express';
import { productsRouter } from './routes/products.router.js';
import { cartsRouter } from './routes/carts.router.js';
import viewsRouter from './routes/views.router.js';
import { __dirname, __filename, connectMongo } from './utils.js';
import handlebars from 'express-handlebars';
import http from 'http';
import { Server as SocketServer } from 'socket.io';
import ProductService from './services/products.service.js';

await connectMongo();

const productService = new ProductService;
const port = 8080;
const app = express();
const httpServer = http.createServer(app);
const io = new SocketServer(httpServer);

const serverConnected = httpServer.listen(port, ()=> console.log(`Server listening on port: ${port}`));
serverConnected.on('error', error => console.log(`Server error: ${error}`))


io.on('connection', (socket)=> {
    console.log(`New Client Connection with ID: ${socket.id}`);
    //BACK RECIBE
    socket.on('msg_from_client_to_server', async (newProduct)=>{
        try{
            await productService.createProduct(newProduct);
            const productList = await productService.getAllProducts();
            //BACK EMITE
            io.emit("updatedProducts", {productList})
        }
        catch (error) {
            console.log(error);
        }
    })
    socket.on('deleteProduct', async (id) => {
        try {
            await productService.deleteProduct(id);
            socket.emit('productDeleted', { message: 'Producto eliminado exitosamente' });
            const productList = await productService.getAllProducts();
            io.emit('updatedProducts', { productList });
        } catch (error) {
            console.error('Error al eliminar el producto:', error);
            socket.emit('productDeleteError', { error: 'Ocurrió un error al eliminar el producto' });
        }
    });
});

//Handlebars
app.engine('handlebars', handlebars.engine());
app.set('views', __dirname+'/views');
app.set('view engine', 'handlebars');

//middlewares
app.use(express.static(__dirname+'/public'));
app.use(express.static('./public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//routes
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/', viewsRouter); 
app.use('/realTimeProducts', viewsRouter); 
app.get('*',(req, res)=>{
    return res.status(404).json({
        status: 'error',
        msg: 'Route not found'
    });
});
