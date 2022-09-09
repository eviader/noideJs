const express = require('express');
const { promises : fs } = require('fs');

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}));

class Contenedor{

    constructor(ruta){
        this.ruta = ruta;
    }

    async saveProduct(nuevoObj){
        let objs;
        let newId;
        
        try{
             objs = await this.getAll();
        }catch(error){
            throw new(`Imposible leer ${objs}`)
        }

        if(objs.length == 0){
            newId = 1;
        }else{
            const ultimoId = parseInt(objs[objs.length - 1].id);
            newId = ultimoId + 1;
        }

        objs.push({id: newId, ...{nuevoObj}});
        
        try{
            await fs.writeFile(this.ruta, JSON.stringify(objs, null, 2));
            return newId;
        }catch(error){
            throw new(`error al guardar: ${error}`);
        }
    }

    async editProduct(id, obj){
        
         const idNum = Number(id)
        try{
            const allProd = await this.getAll();
            const index = allProd.findIndex(elemento => {
                return elemento.id === idNum;
            });

            console.log(index)

            allProd.splice(index, 1,{id: Number(id), nuevoObj: obj })
            await fs.writeFile(this.ruta, JSON.stringify(allProd, null, 2));

        }catch(error){
            throw new Error(`No exixte el id ${id}`);
        }

    }

    async getById(id){
        const objs = await this.getAll();
        const objSelect = objs.filter(elemento => elemento.id == id);

        return objSelect;
    }

    async getAll(){
        try{
            const objetos = await fs.readFile(this.ruta, 'utf-8');
            return JSON.parse(objetos);

        }catch(error){
            return [];
        }

    }

    async deleteById(id){
        const objs = await this.getAll();
        const objSelect = objs.filter((elemento) => elemento.id !== id);

        if(objSelect.length === objs.length){
            throw new Error(`Erroe al borrar: no exixte el id ${id}`);
        }

        try {
            await fs.writeFile(this.ruta, JSON.stringify(objSelect, null, 2))
        }catch(error){
            throw new Error(`Error al borrar id ${id}`);
        }
    }
    

    async deleteAll(){
        try {
            await fs.writeFile(this.ruta, JSON.stringify([], null, 2))
        }catch(error){
            throw new Error(`Error al borrar`);
        }

    }
}

module.exports.method= new Contenedor("./products/productos.txt");