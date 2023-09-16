import productoModel from "../models/producto.model.js";
import { CustomError } from "../../repository/customError.repository.js";
import { EError } from "../../enums/EErrors.js";
import { generateProductErrorInfo } from "../../repository/productErrorInfo.js";
import { generateProductErrorParam } from "../../repository/productErrorParam.js";
import { envLogger } from "../../middlewares/logger.js";

const logger = envLogger();

export default class ProductManagerDB {
  constructor() {
    //this.path = "./src/files/products.json";
  }

  getProducts = async () => {
    try {
      const products = await productoModel.find();
      return products;
    } catch (error) {
      console.log(error);
    }
  };

  addProduct = async (producto, user) => {
    try {
      const products = await this.getProducts();
      let id_producto = producto.id;
      if (products.length === 0) {
        producto.id = 1;
      } else {
        producto.id = products[products.length - 1].id + 1;
      }
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
        return "Todos los campos son obligatorios";
      }
      let codigo = products.find((ele) => ele.code == producto.code);
      if (codigo) {
        logger.error("El 'code' del producto ya existe, intente cambiarlo.");
        return "El 'code' del producto ya existe, intente cambiarlo.";
      } else {
        console.log("adproduct ", producto.owner);
        await productoModel.create(producto);
        return producto;
      }
    } catch (error) {
      console.log(error);
    }
  };

  getProductsById = async (id_producto) => {
    try {
      const products = await this.getProducts();
      const producto = products.find((producto) => producto.id == id_producto);
      if (producto) {
        return producto;
      } else {
        return "No existe el producto";
      }
    } catch (error) {
      console.log(error);
    }
  };

  deleteProduct = async (id_producto) => {
    try {
      if (!id_producto) {
        CustomError.createError({
          name: "Erase Product in data base",
          cause: generateProductErrorParam(id_producto),
          message: "error borrando el producto",
          errorCode: EError.INVALID_PARAM,
        });
      }
      const products = await this.getProducts();
      const producto = products.find((producto) => producto.id == id_producto);
      if (producto) {
        await productoModel.deleteOne({ _id: id_producto });
        console.log("El producto fue eliminado");
        return "Producto eliminado";
      } else {
        return "El producto que quiere eliminar no existe";
      }
    } catch (error) {
      console.log(error);
    }
  };

  updateProduct = async (producto) => {
    try {
      const products = await this.getProducts();
      let id_producto = producto.id;
      console.log("console" + producto.id);
      const indexProducto = products.findIndex(
        (producto) => producto.id === id_producto
      );
      if (indexProducto !== -1) {
        if (
          Object.values(producto).includes(" ") ||
          Object.values(producto).includes("")
        ) {
          return console.log("Todos los campos son obligatorios");
        } else {
          const update = await productoModel.updateOne(
            { _id: id_producto },
            { $set: producto }
          );
          console.log("El producto se modificó con exito");
          console.log(update);
          return producto;
        }
      } else {
        return "El producto que quiere modificar no existe";
      }
    } catch (error) {
      console.log(error);
    }
  };
}
