import fs from "fs";

export default class ProductManager {
  constructor(){
    this.path = "./src/files/products.json";    
  }  
 
  getProducts = async () => {
    try{
      if (fs.existsSync(this.path)) {
        const data = await fs.promises.readFile(this.path, "utf8");
        const products = JSON.parse(data);      
        return products      
      } else {
        return [];
      }
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
        products.push(producto);
        await fs.promises.writeFile(this.path, JSON.stringify(products, null, "\t"));
        console.log(producto);
        //return producto;
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
        return "not found";
      }
    } catch(error){
      console.log(error)
    }
  };

  deleteProduct = async (id_producto) => {
    try{    
      const products = await this.getProducts();    
      const indexProducto = products.findIndex(producto => producto.id == id_producto);
      if (indexProducto !== -1) {            
        products.splice(indexProducto,1)[0];      
        await fs.promises.writeFile(this.path,JSON.stringify(products, null, "\t")
        );
        console.log("El producto fue eliminado");
        return "Producto eliminado"
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
        const deleteP = products.splice(indexProducto,1)[0];
        await fs.promises.writeFile(this.path, JSON.stringify(products, null, "\t"));      
        deleteP;
        products.push(producto);
        await fs.promises.writeFile(this.path, JSON.stringify(products, null, "\t"));
        console.log("El producto se modificó con exito")     
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
