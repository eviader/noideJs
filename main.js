const express = require('express');
const classP = require('./products/products')
const classC = require('./cart/cart')
const { Router } = express;

const app = express();
const productos = Router()
const carrito = Router()

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static("public"))

//Router de productos

//Lista todos los productos
productos.get('/', async (req, res, next) =>{
    try{
        const objs = await classP.method.getAll();
        res.send(objs);
    }catch(error){
        throw new Error(`Error al leer articulos`);
    }
});

//lista los productos por id
productos.get('/:id', async (req, res, next) =>{

    if(req.params.id != 0){
        try{
            let productoId = req.params.id;
            const objs = await classP.method.getById(productoId);
            res.send(objs);
        }catch(error){
            throw new Error(`Error al leer articulos`);
        }
    }else{
        try{
            const objs = await classP.method.getAll();
            res.send(objs);
        }catch(error){
            throw new Error(`Error al leer articulos`);
        }
    }   
});

//Incorpora nuevos productos
productos.post('/', async (req, res) => {
    try{
        const { nombre, descripcion, codigo, precio, img, stock } = req.body;
        const now = new Date().toString()

        const newPost = await classP.method.saveProduct({timestamp: now,
                                                        nombre: nombre,
                                                        descripcion: descripcion,
                                                        codigo:codigo,
                                                        precio: precio,
                                                        img: img,
                                                        stock:stock});
        console.log(`Productos guardada con exito. El id del producto es: ${newPost}`);
    }catch(error){
        throw new Error(`Error al cargar producto`);
    }
});

//modifica los productos por id
productos.put('/:id', async (req, res) => {

    const id = req.params.id
    const { nombre, descripcion, codigo, precio, img, stock } = req.body;

    const now = new Date().toString()
    const put = {timestamp: now,
                nombre: nombre,
                descripcion: descripcion,
                codigo:codigo,
                precio: precio,
                img: img,
                stock:stock};
    try{
        await classP.method.editProduct(id, put)
    }catch(error){
        throw new Error(`Error al modificar el producto`);
    }
    
});

//elimina los productos por id
productos.delete('/:id', async (req, res) => {
    try{
        const productoId = req.params.id;
        await classP.method.deleteById(parseInt(productoId))
        res.send(`Se elimino correctamente el producto con el id: ${productoId}`)

    }catch(error){
        throw new Error("Error al aliminar producto");
    }
});


//Router CARRITO

//lista todos los productos del carrito
carrito.get('/:id/productos', async (req, res) =>{

    const id = req.params.id;

    try{
        const obj = await classC.method.getById(id);
        res.send(obj[0].cart);
    }catch(error){
        throw new Error(`Error al leer articulos`);
    }
});

//Crea carritos
carrito.post('/', async (req, res) => {
    try{
        const newPost = await classC.method.saveCart({cart:[]});
        res.send(`Productos guardada con exito. El id del producto es: ${newPost}`);
    }catch(error){
        throw new Error(`Error al cargar producto`);
    }
});

//incorpora productos al carrito por id
carrito.post('/:id/productos', async (req, res) => {
    const { id } = req.body;

    try{
        const objsProducts = await classP.method.getById(id);
        let carritoId = req.params.id;
        const newObj = objsProducts[0]
        await classC.method.addProductCart(carritoId, newObj)

    }catch(error){
        throw new Error(`Error al leer articulos productos`);
    }
    
});

//elimina el carrito por id
carrito.delete('/:id', async (req, res) =>{

    const id = req.params.id;

    try{
        await classC.method.deleteById(id);
        console.log(`Se elimino el carrito con el id: ${id}`)
    }catch(error){
        throw new Error(`Error al eliminar carrito`);
    }
});

//elimina productos por id del carrito indicado por id 
carrito.delete('/:id/productos/:id_prod', async (req, res) =>{

    const id = req.params.id;
    const id_prod = req.params.id_prod;

    try{
        await classC.method.deleteByIdProdcuts(id, id_prod);
        console.log(`Se elimino el producto id: ${id_prod} del carrito id: ${id}`)
    }catch(error){
        throw new Error(`Error al eliminar productos`);
    }
});

app.use('/productos', productos);
app.use('/carrito', carrito);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server on PORT:${PORT}`) 
});

