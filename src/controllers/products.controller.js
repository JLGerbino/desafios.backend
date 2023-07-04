//import ProductManagerDB from "../dao/managersDB/productManagerDB.js";
//esto voy agregando
import { productsDao } from "../dao/factory.js";
import { productService } from "../repository/index.js";
//import ProductManagerFS from "../dao/managersFS/productManager.js";
//

//import { uploader } from "../utils.js";
//esto voy agregando
//const productsService = new ProductManagerDB();
//

//const productManagerDB = new ProductManagerDB();

export default class ProductController {
  async getProducts(req, res){
    const productos = await productService.getProductsRep(); //productsDao.getProducts() //productsService.getProducts(); //productManagerDB.getProducts(); //productoModel.find();
    const limite = req.query.limit;
    if (!limite) {
      return res.send({
        productos,
      });
    }
    let limiteProductos = productos.slice(0, limite);
    return res.send({
      limiteProductos,
    });
  }

  async getProductsById(req, res){
    const id = req.params.pid;
    const producto = await productService.getProductsByIdRep(id);//productsDao.getProductsById(id) //productManagerDB.getProductsById(id) // productoModel.find({_id:id});
    res.send(producto);
  }

  async addProduct(req, res){
    const { title, description, code, price, stock, category } = req.body;
    const files = req.files;
    const thumbnails = files.map(file => `/images/${file.filename}`);
    const filenames = []; 
    // comentado de aca
    for (let i = 0; i < files.length; i++) {
    const file = files[i];        
    const filename = file.filename;//`${file.originalname}`;
    filenames.push(filename);
    }  
    //hasta aca
    const producto = {
    title,
    description,
    code,
    price,
    status: "true",
    stock,
    category,
    thumbnail: []   
    };  
    //comentado de aca
    filenames.forEach((filename) => {
    producto.thumbnail.push(`http://localhost:8080/images/${filename}`);
    }); 
    //hasta aca 
    console.log(producto);
    const msg = await productService.addProductRep(producto); //productsDao.addProduct(producto); //productManagerDB.addProduct(producto)  // productoModel.create(producto);
    res.send(msg);
    }

  async deleteProduct(req, res){
    const id = req.params.pid;
    const msg = await productService.deleteProductRep(id); //productsDao.deleteProduct(id); //productManagerDB.deleteProduct(id) //productoModel.deleteOne({_id:id});
    res.send(msg);
    }
  
  async updateProduct(req, res){
  const id_producto = req.params.pid
  const {title, description, code, price, status, stock, category} = req.body;
  const files = req.files;
const filenames = [];
// for (let i = 0; i < files.length; i++) {
//   const file = files[i];
//   const filename = `${file.originalname}`;
//   filenames.push(filename);
// }  
const producto = {
  id: id_producto,
  title,
  description,
  code,
  price,
  status,
  stock,
  category,
  thumbnail: []
};  
// filenames.forEach((filename) => {
//   producto.thumbnail.push(`http://localhost:8080/images/${filename}`);
// });  
console.log(producto);
const msg = await productService.updateProductRep(producto)//productService.updateProductRep({_id:id_producto},{$set:producto}); //productsDao.updateProduct(producto) //productManagerDB.updateProduct(producto) //productoModel.updateOne({_id:id_producto},{$set:producto});
res.send(msg);
  } 
}

