import { Router } from "express";
import ProductManagerFS from "../dao/managersFS/productManager.js";
import ProductManagerDB from "../dao/managersDB/productManagerDB.js";
import { uploader } from "../utils.js";
//import estudianteModel from "../dao/models/producto.model.js";
import productoModel from "../dao/models/producto.model.js";

const router = Router();
const manager = new ProductManagerFS
const managerDB = new ProductManagerDB

const productos = []

//ruta db 
router.get('/', async(req,res)=>{
  const productos = await managerDB.getProducts() //productoModel.find();
  const limite = req.query.limit;
  if(!limite ){
     return res.send({
          productos
       })
  }
  let limiteProductos = productos.slice(0,limite);
  return res.send({
     limiteProductos
  })
})

//ruta fs
// router.get('/', async(req,res)=>{
//     const productos = await manager.getProducts();
//     const limite = req.query.limit;
//     if(!limite ){
//        return res.send({
//             productos
//          })
//     }
//     let limiteProductos = productos.slice(0,limite);
//     return res.send({
//        limiteProductos
//     })
// })

//ruta db 
router.get("/:pid", async(req, res)=>{
  const id = req.params.pid;
  const producto = await managerDB.getProductsById(id) // productoModel.find({_id:id});
  res.send(producto);
})

//ruta fs
// router.get("/:pid", async(req, res)=>{
//     const id = req.params.pid;
//     const producto = await manager.getProductsById(id);
//     res.send(producto);
// })
       
//ruta db
router.post('/', uploader.array('thumbnail'), async (req, res) => {
  const { title, description, code, price, stock, category } = req.body;
  const files = req.files;
  const filenames = []; 
  // for (let i = 0; i < files.length; i++) {
  //   const file = files[i];        
  //   const filename = `${file.originalname}`;
  //   filenames.push(filename);
  // }  
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
  // filenames.forEach((filename) => {
  //   producto.thumbnail.push(`http://localhost:8080/images/${filename}`);
  // }); 
  //hasta aca 
  console.log(producto);
  const msg = await managerDB.addProduct(producto)  // productoModel.create(producto);
  res.send(msg);
});

//ruta fs
// router.post('/', uploader.array('thumbnail'), async (req, res) => {
//   const { title, description, code, price, stock, category } = req.body;
//   const files = req.files;
//   const filenames = []; 
//   for (let i = 0; i < files.length; i++) {
//     const file = files[i];        
//     const filename = `${file.originalname}`;
//     filenames.push(filename);
//   }  
//   const producto = {
//     title,
//     description,
//     code,
//     price,
//     status: "true",
//     stock,
//     category,
//     thumbnail: []
//   };  
//   //comentado de aca
//   filenames.forEach((filename) => {
//     producto.thumbnail.push(`http://localhost:8080/images/${filename}`);
//   }); 
//   //hasta aca 
//   console.log(producto);
//   const msg = await manager.addProduct(producto);
//   res.send(msg);
// });

//ruta db
router.delete("/:pid", async(req, res)=>{
  const id = req.params.pid;
  const msg = await managerDB.deleteProduct(id) //productoModel.deleteOne({_id:id});
  res.send(msg);
})

//ruta fs
// router.delete("/:pid", async(req, res)=>{
//     const id = req.params.pid;
//     const msg = await manager.deleteProduct(id);
//     res.send(msg);
// })

//ruta db
router.put('/:pid', uploader.array('thumbnail'), async (req,res)=>{
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
const msg = await managerDB.updateProduct(producto) //productoModel.updateOne({_id:id_producto},{$set:producto});
res.send(msg);
});

//ruta fs
// router.put('/:pid', uploader.array('thumbnail'), async (req,res)=>{
//     const id_producto = req.params.pid
//     const {title, description, code, price, status, stock, category} = req.body;
//     const files = req.files;
//   const filenames = [];
  
//   for (let i = 0; i < files.length; i++) {
//     const file = files[i];
//     const filename = `${file.originalname}`;
//     filenames.push(filename);
//   }  
//   const producto = {
//     id: parseInt(id_producto),
//     title,
//     description,
//     code,
//     price,
//     status,
//     stock,
//     category,
//     thumbnail: []
//   };  
//   filenames.forEach((filename) => {
//     producto.thumbnail.push(`http://localhost:8080/images/${filename}`);
//   });  
//   console.log(producto);
//   const msg = await manager.updateProduct(producto);
//   res.send(msg);
// });


export default router;