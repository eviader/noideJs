const express = require('express');
const { promises : fs } = require('fs');

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}));

class Carrito{

    constructor(ruta){
        this.ruta = ruta;
    }

    async addProductCart(id, newObj){
        let arrayCart;
        let newId;
        let cart;
        
        try{
            const obj = await this.getById(id)
            arrayCart = obj[0].cart
            cart = await this.getAll()
        }catch(error){
            throw new(`Imposible encontrar ${obj}`)
        }

        if(arrayCart.length == 0){
            newId = 1;
        }else{
            const ultimoId = parseInt(arrayCart[arrayCart.length - 1].id);
            console.log(ultimoId);
            newId = ultimoId + 1;
        }

        try{

        arrayCart.push({idInCart: newId, ...newObj});

        const index = cart.findIndex(elemento => {
            return elemento.id = id;
        })
        cart.splice(index, 1 ,{id: Number(id), cart: arrayCart});

        await fs.writeFile(this.ruta, JSON.stringify(cart, null, 2))
        }catch(error){
            throw new(`Imposible guardar`)
        }
    }

    async saveCart(nuevoObj){
        let objs;
        let newId;
        const now = new Date().toString();
        
        try{
             objs = await this.getAll();
        }catch(error){
            throw new(`Imposible leer ${objs}`)
        }

        if(objs.length == 0){
            newId = 1;
        }else{
            const ultimoId = parseInt(objs[objs.length - 1].id);
            console.log(ultimoId);
            newId = ultimoId + 1;
        }

        objs.push({id: newId, timestamp: now, ...nuevoObj});
        
        try{
            await fs.writeFile(this.ruta, JSON.stringify(objs, null, 2));
            return newId;
        }catch(error){
            throw new(`error al guardar: ${error}`);
        }
    }

    async getById(id){
        const objs = await this.getAll();
        const objSelect = objs.filter(elemento => elemento.id == id);

        return objSelect;
    }

    async getAll(){
        try{
            const objetos= await fs.readFile(this.ruta, 'utf-8');
            return JSON.parse(objetos);

        }catch(error){
            return [];
        }
    }

    async deleteById(id){
        const byId = Number(id)
        
        const objs = await this.getAll();
        const objSelect = objs.filter((elemento) => elemento.id !== byId);

        try {
            await fs.writeFile(this.ruta, JSON.stringify(objSelect, null, 2))
        }catch(error){
            throw new Error(`Error al borrar id ${id}`);
        }
    }

    async deleteByIdProdcuts(cartId, prodId){
        const idCart = Number(cartId)
        const idProd = Number(prodId)

        try{
            const carts = await this.getAll();
            const objs = await this.getById(idCart);
            const objSelect = objs[0].cart.filter((elemento) => elemento.idInCart !== idProd);
            
            objs.splice(0, 1 ,{id: Number(idCart), cart: objSelect})
            const cartById = carts.findIndex(elemento =>{
                return elemento.id === idCart;
            })

            carts.splice(cartById, 1, objs[0])
            await fs.writeFile(this.ruta, JSON.stringify(carts, null, 2))

        }catch(error){
            throw new Error(`Error al borrar id ${id}`);
        }

    }
   
}
 
module.exports.method = new Carrito('./cart/carrito.txt')