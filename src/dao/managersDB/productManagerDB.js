import productoModel from "../models/producto.model.js";

export default class ProductManagerDB {
  constructor(){
    this.path = "./src/files/products.json";    
  }  
 
  
  getProducts = async () => {
    try{
      const products = await productoModel.find()
      return products      
    } catch(error){
      console.log(error)
    }
  }
   
  addProduct = async (producto) => {
    try{  
      const products = await this.getProducts();      
      let id_producto = producto.id;
      if (products.length === 0) {
        producto.id = 1;
      } else {
        producto.id = products[products.length - 1].id + 1;
      }
      //comentado de aca
      if (
        Object.values(producto).includes(" ") ||
        Object.values(producto).includes("")
      ) {        
        return "Todos los campos son obligatorios";
      }
      //hsta aca
      let codigo = products.find((ele) => ele.code == producto.code);
      if (codigo) {
        return "El 'code' del producto ya existe, intente cambiarlo.";
      } else {
        //products.push(producto);
        await productoModel.create(producto)
        console.log(producto);
        return producto;
      }
    } catch(error){
      console.log(error)
    }
  }

  getProductsById = async (id_producto) => {
    try{
      const products = await this.getProducts();
      const producto = products.find((producto) => producto.id == id_producto);      
      if (producto) {        
        return producto;
      } else {
        return "No existe el producto";
      }
    } catch(error){
      console.log(error)
    }
  };

  deleteProduct = async (id_producto) => {
    try{    
      const products = await this.getProducts();
      const producto = products.find((producto) => producto.id == id_producto);     
      if (producto) {  
        await productoModel.deleteOne({_id:id_producto})            
        console.log("El producto fue eliminado");
        return "Producto eliminado";
      } else {
        return "El producto que quiere eliminar no existe";
      }
    } catch(error){
      console.log(error)
    }
  };
  
  updateProduct = async (producto) =>{    
    try{       
      const products = await this.getProducts();         
      let id_producto = producto.id;      
      const indexProducto = products.findIndex(producto => producto.id === id_producto);    
      if (indexProducto !== -1) {
        if (Object.values(producto).includes(" ") ||
        Object.values(producto).includes("")){
          return console.log("Todos los campos son obligatorios");
        }else{
        const update = await productoModel.updateOne({_id:id_producto},{$set:producto});        
        console.log("El producto se modificó con exito")
        console.log(update)     
        return producto;
      }        
      } else {
          return "El producto que quiere modificar no existe"
      }    
    } catch(error){
    console.log(error)
    }
  }
}