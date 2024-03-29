import carritoModel from "../models/carrito.model.js";
import ProductManagerDB from "../managersDB/productManagerDB.js";
import { v4 as uuidv4 } from "uuid";
import TicketManagerDB from "../managersDB/ticketManagerDb.js";
import { transporter } from "../../config/gmail.js";
import { CustomError } from "../../repository/customError.repository.js";
import { EError } from "../../enums/EErrors.js";
import { generateProductErrorParam } from "../../repository/productErrorParam.js";
import { generateCartErrorParam } from "../../repository/cartErrorParam.js";
import { envLogger } from "../../middlewares/logger.js";

const pManagerDB = new ProductManagerDB();
const ticketManager = new TicketManagerDB();
const logger = envLogger();

export default class CartManagerDB {
  getCarts = async () => {
    try {
      const carritos = await carritoModel.find();
      return carritos;
    } catch (error) {
      console.log(error);
    }
  };

  createCart = async () => {
    try {
      const carts = await this.getCarts();
      let cart = {
        product: [],
      };
      carts.push(cart);
      const nuevoCarrito = await carritoModel.create(cart);
      const id_carrito = nuevoCarrito._id;
      return {
        id: id_carrito,
        product: cart.product,
      };
    } catch (error) {
      logger.error(error);
    }
  };

  addCart = async (id_carrito, id_producto) => {
    try {
      const carts = await this.getCarts();
      const products = await pManagerDB.getProducts();
      const indexCarrito = carts.findIndex((cart) => cart.id == id_carrito);
      logger.debug(id_carrito);
      if (indexCarrito !== -1) {
        const indexProducto = products.findIndex(
          (producto) => producto.id == id_producto
        );
        logger.debug(indexProducto);
        if (indexProducto !== -1) {
          let prodInCart = carts[indexCarrito].productos.find(
            (ele) => ele.product == id_producto
          );
          logger.debug(prodInCart);
          if (!prodInCart) {
            carts[indexCarrito].productos.push({
              product: id_producto,
              quantity: 1,
            });
          } else {
            let cantidad = prodInCart.quantity;
            prodInCart.quantity = cantidad + 1;
          }
          carritoModel.create(carts);
        } else {
          return "No existe el producto";
        }
      } else {
        return "No existe el carrito";
      }
    } catch (error) {
      logger.error(error);
    }
  };

  getCartsId = async (id_carrito) => {
    try {
      const carts = await this.getCarts();
      const cart = await carritoModel
        .findOne({ _id: id_carrito })
        .populate("productos.product")
        .lean();
      console.log("cart" + cart);
      console.log(id_carrito);
      if (cart) {
        return cart;
      } else {
        return "No existe el carrito";
      }
    } catch (error) {
      console.log(error);
    }
  };

  deleteProdInCart = async (id_carrito) => {
    try {
      if (!id_carrito) {
        CustomError.createError({
          name: "Erase all products in cart",
          cause: generateCartErrorParam(id_carrito),
          message: "error borrando todos los productos del carrito",
          errorCode: EError.INVALID_PARAM,
        });
      }
      const cart = await carritoModel.findOne({ _id: id_carrito });
      const carts = await this.getCarts();
      const indexCarrito = carts.findIndex((cart) => cart.id == id_carrito);
      console.log(id_carrito);
      if (indexCarrito !== -1) {
        await carritoModel.updateOne(
          { _id: id_carrito },
          { $set: { productos: [] } }
        );
      } else {
        return "No existe el carrito";
      }
    } catch (error) {
      console.log(error);
    }
  };

  deleteProdInCartById = async (id_carrito, id_producto) => {
    try {
      if (!id_producto) {
        CustomError.createError({
          name: "Erase Product in cart",
          cause: generateProductErrorParam(id_producto),
          message: "error borrando el producto",
          errorCode: EError.INVALID_PARAM,
        });
      }
      const cart = await carritoModel.findOne({ _id: id_carrito });
      const carts = await this.getCarts();
      const products = await pManagerDB.getProducts();
      const indexCarrito = carts.findIndex((cart) => cart.id == id_carrito);
      console.log(id_carrito);
      if (indexCarrito !== -1) {
        const indexProducto = products.findIndex(
          (producto) => producto.id == id_producto
        );
        console.log(indexProducto);
        if (indexProducto !== -1) {
          let prodInCart = carts[indexCarrito].productos.findIndex(
            (ele) => ele.product == id_producto
          );
          console.log(prodInCart);
          if (prodInCart === -1) {
            return "El producto no esta en el carrito";
          } else {
            cart.productos.splice(prodInCart, 1);
            await carritoModel.updateOne({ _id: id_carrito }, { $set: cart });
          }
        } else {
          return "No existe el producto";
        }
      } else {
        return "No existe el carrito";
      }
    } catch (error) {
      console.log(error);
    }
  };

  UpdateQuantityProd = async (id_carrito, id_producto, cantidad) => {
    try {
      const cart = await carritoModel.findOne({ _id: id_carrito });
      const products = cart.productos;
      const indexProducto = products.findIndex(
        (producto) => producto.product == id_producto
      );
      if (indexProducto === -1) {
        return "El producto no está en el carrito";
      }
      products[indexProducto].quantity = parseInt(cantidad);
      await carritoModel.updateOne({ _id: id_carrito }, { $set: cart });
      return "Se actualizó la cantidad";
    } catch (error) {
      console.log(error);
    }
  };

  UpdateCartWithProds = async (id_carrito, products) => {
    try {
      const cart = await carritoModel.findOne({ _id: id_carrito });
      if (cart) {
        cart.productos.push(...products);
        await cart.save();
        return "Se cargaron los productos";
      } else {
        return "No existe el carrito";
      }
    } catch (error) {
      console.log(error);
    }
  };

  Purchase = async (id_carrito, userEmail, res) => {
    try {
      const cart = await this.getCartsId(id_carrito);
      const productsToPurchase = [];
      const productsNotRemove = [];
      for (const product of cart.productos) {
        const productId = product.product._id.toString();
        const quantity = product.quantity;
        console.log("producto id", productId);
        const productInfo = await pManagerDB.getProductsById(productId);
        console.log("productInfo" + productInfo.stock);
        if (productInfo.stock >= quantity) {
          productsToPurchase.push(product);
          productInfo.stock -= quantity;
          await productInfo.save();
          await this.deleteProdInCartById(id_carrito, productId);
        } else {
          productsNotRemove.push(productInfo);
        }
      }
      let montoTotal = 0;
      for (const product of productsToPurchase) {
        const { quantity } = product;
        const price = product.product.price;
        const productTotal = quantity * price;
        montoTotal += productTotal;
        console.log("precio", price);
      }
      console.log("purchase", productsToPurchase);
      console.log("remove", productsNotRemove);
      const id = uuidv4();
      const ticketData = {
        code: id,
        purchase_datetime: new Date(),
        amount: montoTotal,
        purchaser: userEmail,
      };
      console.log("total compra", montoTotal);
      const createdTicket = await ticketManager.createTicket(ticketData);
      console.log("Ticket creado:", createdTicket);
      console.log("Ticket creado:", createdTicket);
      console.log("ticketid cartmanager", createdTicket._id);
      const emailTemplate = `<div>
      <h1>Muchas gracias por tu compra!!</h1>
      <h2>Detalles del ticket</h2>
      <p>Código: ${createdTicket.code}</p>
      <p>Fecha de compra: ${createdTicket.purchase_datetime}</p>
      <p>Monto total: $ ${createdTicket.amount}</p>
      <p>Comprador: ${createdTicket.purchaser}</p>
      <a href="https://www.google.com/">Explorar</a>
      </div>`;
      const contenido = await transporter.sendMail({
        from: "Ecommerce Backend",
        to: userEmail,
        subject: "Ticket de compra",
        html: emailTemplate,
      });
      console.log("contenido", contenido);
    } catch (error) {
      console.log("Error al crear el ticket:", error);
    }
  };
}
