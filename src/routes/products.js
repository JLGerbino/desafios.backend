import { Router } from "express";
import ProductManager from "../managers/productManager.js";
import { uploader } from "../utils.js";

const router = Router();
const manager = new ProductManager

router.get('/', async(req,res)=>{
    const productos = await manager.getProducts();
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

router.get("/:pid", async(req, res)=>{
    const id = req.params.pid;
    const producto = await manager.getProductsById(id);
    res.send(producto);
})
             
router.post('/', uploader.array('thumbnail'), async (req, res) => {
  const { title, description, code, price, stock, category } = req.body;
  const files = req.files;
  const filenames = []; 
  //estaba comentado de aca 
  for (let i = 0; i < files.length; i++) {
    const file = files[i];        
    const filename = `${file.originalname}`;
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
  const msg = await manager.addProduct(producto);
  res.send(msg);
});

router.delete("/:pid", async(req, res)=>{
    const id = req.params.pid;
    const msg = await manager.deleteProduct(id);
    res.send(msg);
})

router.put('/:pid', uploader.array('thumbnail'), async (req,res)=>{
    const id_producto = req.params.pid
    const {title, description, code, price, status, stock, category} = req.body;
    const files = req.files;
  const filenames = [];
  
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const filename = `${file.originalname}`;
    filenames.push(filename);
  }  
  const producto = {
    id: parseInt(id_producto),
    title,
    description,
    code,
    price,
    status,
    stock,
    category,
    thumbnail: []
  };  
  filenames.forEach((filename) => {
    producto.thumbnail.push(`http://localhost:8080/images/${filename}`);
  });  
  console.log(producto);
  const msg = await manager.updateProduct(producto);
  res.send(msg);
});


export default router;