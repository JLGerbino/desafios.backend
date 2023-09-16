import { productsDao } from "../dao/factory.js";
import { productService } from "../repository/index.js";
import { generateProduct } from "../utils.js";
import { CustomError } from "../repository/customError.repository.js";
import { EError } from "../enums/EErrors.js";
import { generateProductErrorInfo } from "../repository/productErrorInfo.js";
import productoModel from "../dao/models/producto.model.js";
import { envLogger } from "../middlewares/logger.js";

const logger = envLogger();

export default class ProductController {
  async getProducts(req, res) {
    const productos = await productService.getProductsRep();
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
    const producto = await productService.getProductsByIdRep(id);
    res.send(producto);
  }

  async addProduct(req, res) {
    try {
      const products = await productoModel.find();
      const { title, description, code, price, stock, category, owner } =
        req.body;
      const files = req.files;
      const user = req.session.user._id;
      console.log("products.controller", user);
      const thumbnails = files.map((file) => `/images/${file.originalname}`);
      const filenames = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const filename = file.filename;
        filenames.push(filename);
      }
      const producto = {
        title,
        description,
        code,
        price,
        status: "true",
        stock,
        category,
        owner,
        thumbnail: thumbnails,
      };
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
        res.status(400).json({ error: "Todos los campos son obligatorios" });
      }
      let codigo = products.find((ele) => ele.code == producto.code);
      if (codigo) {
        logger.error("El 'code' del producto ya existe, intente cambiarlo.");
        res
          .status(400)
          .json({
            error: "El 'code' del producto ya existe, intente cambiarlo",
          });
      } else {
        await productoModel.create(producto);
        res.send("El producto se ha agregado correctamente.");
      }
    } catch (error) {
      console.error("Error al cargar el producto:", error);
      res.status(500).send("Error al cargar el producto.");
    }
  }

  async deleteProduct(req, res) {
    const id = req.params.pid;    
    const user = req.session.user.role;
    console.log("rol del ususario en product.controller", user); 
    const msg = await productService.deleteProductRep(id); 
    res.send(msg);
  }

  async updateProduct(req, res) {
    const id_producto = req.params.pid;
    const { title, description, code, price, status, stock, category, owner } =
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
      owner,
      thumbnail: [],
    };
    // filenames.forEach((filename) => {
    //   producto.thumbnail.push(`http://localhost:8080/images/${filename}`);
    // });
    console.log(producto);
    const msg = await productService.updateProductRep(producto); 
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
