class ProductManager {
    
    constructor(){
        this.products = []
    }

    getProducts(){
        return this.products
    }  

    addProduct(title, description, price, thumbnail, code, stock){

        let id_producto = (this.getProducts()).length; 
               

        let producto = {
            title: title,
            description: description,
            price: price,
            thumbnail: thumbnail,
            code: code,
            stock: stock,            
            id: ++id_producto
        }
        if (Object.values(producto).includes(" ") || Object.values(producto).includes(""))
        {
            return console.log("Todos los campos son obligatorios")
        }
        let codigo = this.products.find(ele => ele.code == producto.code)
        if (codigo){
              return console.log("El 'code' del producto ya existe, intente cambiarlo.")            
          }else{
            this.products.push(producto);
            return this.products}
        
    }
    
    getProductsById(id_producto){
        let producto = this.products.find(producto => producto.id == id_producto)
        if (producto){
            return producto;
        }else{
            return "not found"            
        }
    }
    
}

const nuevoProducto = new ProductManager();
nuevoProducto.addProduct("Rack tv", "Rack tv 1.30 mts 2 puertas", 29500,"no", 20, 25);
nuevoProducto.addProduct("Mesa tv", "", 38500,"no imagen", 10, 20);
nuevoProducto.addProduct("Silla", "Mesa tv 1.80 mts 4 puertas", 38500,"no imagen", 15, 20);
nuevoProducto.addProduct("Mesa centro", "mesa centro melamina", 38500,"no imagen", 20, 20);
nuevoProducto.addProduct("Cama 140", "Cama 140 mts pino Tablero", 45900,"no imagen", 12, 20);
console.log(nuevoProducto.getProducts())
console.log(nuevoProducto.getProductsById(5))
