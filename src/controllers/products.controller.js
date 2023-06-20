import ProductManagerDB from "../dao/managersDB/productManagerDB.js";
//import { uploader } from "../utils.js";

const productManagerDB = new ProductManagerDB();

export default class ProductController {
  async getProducts(req, res){
    const productos = await productManagerDB.getProducts(); //productoModel.find();
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
    const producto = await productManagerDB.getProductsById(id) // productoModel.find({_id:id});
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
    const msg = await productManagerDB.addProduct(producto)  // productoModel.create(producto);
    res.send(msg);
    }

  async deleteProduct(req, res){
    const id = req.params.pid;
    const msg = await productManagerDB.deleteProduct(id) //productoModel.deleteOne({_id:id});
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
const msg = await productManagerDB.updateProduct(producto) //productoModel.updateOne({_id:id_producto},{$set:producto});
res.send(msg);
  } 
}

