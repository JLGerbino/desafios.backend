import { productsDao } from "../dao/factory.js";
import { productService } from "../repository/index.js";
import { generateProduct } from "../utils.js";
import { CustomError } from "../repository/customError.repository.js";
import { EError } from "../enums/EErrors.js";
import { generateProductErrorInfo } from "../repository/productErrorInfo.js";
//import ProductManagerFS from "../dao/managersFS/productManager.js";

//import { uploader } from "../utils.js";


export default class ProductController {
  async getProducts(req, res) {
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

  async getProductsById(req, res) {
    const id = req.params.pid;
    const producto = await productService.getProductsByIdRep(id); //productsDao.getProductsById(id) //productManagerDB.getProductsById(id) // productoModel.find({_id:id});
    res.send(producto);
  }

  async addProduct(req, res) {
    const { title, description, code, price, stock, category } = req.body;
    const files = req.files;
    const thumbnails = files.map((file) => `/images/${file.filename}`);
    const filenames = [];
    // comentado de aca
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const filename = file.filename; //`${file.originalname}`;
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
      thumbnail: [],
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

  async deleteProduct(req, res) {
    const id = req.params.pid;
    const msg = await productService.deleteProductRep(id); //productsDao.deleteProduct(id); //productManagerDB.deleteProduct(id) //productoModel.deleteOne({_id:id});
    res.send(msg);
  }

  async updateProduct(req, res) {
    const id_producto = req.params.pid;
    const { title, description, code, price, status, stock, category } =
      req.body;
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
      thumbnail: [],
    };
    // filenames.forEach((filename) => {
    //   producto.thumbnail.push(`http://localhost:8080/images/${filename}`);
    // });
    console.log(producto);
    const msg = await productService.updateProductRep(producto); //productService.updateProductRep({_id:id_producto},{$set:producto}); //productsDao.updateProduct(producto) //productManagerDB.updateProduct(producto) //productoModel.updateOne({_id:id_producto},{$set:producto});
    res.send(msg);
  }

  //nuevo faker
  async mockingProducts(req, res) {
    try {
      const cant = parseInt(req.query.cant) || 100;
      let productMoking = [];
      for (let i = 0; i < cant; i++) {
        const producto = generateProduct();        
        if (
          Object.values(producto).includes(" ") ||
          Object.values(producto).includes("")
        ) {
          CustomError.createError({
            name: "Product create error",
            cause: generateProductErrorInfo(producto),
            message: "error creando el producto",
            errorCode: EError.INVALID_JSON,
          }); 
        }
        productMoking.push(producto);
      }
      res.json({ productMoking });
    } catch {
      console.log("Error en mockingProducts:");
      res.status(500).json({ error: "Error en la generación de productos" });
    }
  }
}
