//import CartManagerDB from "../dao/managersDB/cartsManagerDB.js";
import { v4 as uuidv4 } from "uuid";
import { cartDao } from "../dao/factory.js";
import { productService } from "../repository/index.js";
import userModel from "../dao/models/user.model.js";
import TicketManagerDB from "../dao/managersDB/ticketManagerDb.js"; //const cartManagerDB = new CartManagerDB();
import { GetUserDto } from "../dao/dto/user.dto.js"

export default class CartController {
  async createCart(req, res) {
    //const emailUser = req.session.user//agregue
    const msg = await cartDao.createCart(); //cartManagerDB.createCart();
    res.send(msg);
  }

  async addCart(req, res) {
    const id_carrito = req.params.cid;
    const id_producto = req.params.pid;
    const msg = await cartDao.addCart(id_carrito, id_producto); //cartManagerDB.addCart(id_carrito, id_producto)  //manager.addCart(id_carrito, id_producto);
    res.send(msg);
  }

  async getCartsId(req, res) {
    const id = req.params.cid;
    const producto = await cartDao.getCartsId(id); //cartManagerDB.getCartsId(id) //carritoModel.find({_id:id});
    res.send(producto);
  }

  async deleteProdInCartById(req, res) {
    const id_carrito = req.params.cid;
    const id_producto = req.params.pid;
    const msg = await cartDao.deleteProdInCartById(id_carrito, id_producto); //cartManagerDB.deleteProdInCartById(id_carrito, id_producto)
    res.send(msg);
  }

  async deleteProdInCart(req, res) {
    const id_carrito = req.params.cid;
    const msg = await cartDao.deleteProdInCart(id_carrito); //cartManagerDB.deleteProdInCart(id_carrito)
    res.send(msg);
  }

  async UpdateQuantityProd(req, res) {
    const id_carrito = req.params.cid;
    const id_producto = req.params.pid;
    const quantity = req.body.quantity;
    const cantidad = parseInt(quantity);
    console.log(cantidad);
    const msg = await cartDao.UpdateQuantityProd(
      id_carrito,
      id_producto,
      cantidad
    ); //cartManagerDB.UpdateQuantityProd(id_carrito, id_producto, cantidad)
    res.send(msg);
  }

  async UpdateCartWithProds(req, res) {
    const id_carrito = req.params.cid;
    const products = req.body.products;
    const msg = await cartDao.UpdateCartWithProds(id_carrito, products); //cartManagerDB.UpdateCartWithProds(id_carrito, products);
    res.send(msg);
  }
  

  async purchase(req, res) {
    if (!req.session.user) {
      console.log("La sesión del usuario no está presente")};
    const id_carrito = req.params.cid;
    const cart = await cartDao.getCartsId(id_carrito);
    const user = req.session.user

    console.log("user", user)
    const userDto = new GetUserDto(user)    
    console.log("userdto",userDto);
    
    console.log("reqsessionuser",req.session.user)

    console.log("usuario id", user.email);
    const productsToPurchase = [];
    const productsNotRemove = [];

    for (const product of cart.productos) {
      const productId = product.product._id.toString();
      const quantity = product.quantity;
      console.log("producto id", productId);
      const productInfo = await productService.getProductsByIdRep(productId);
      console.log("productInfo" + productInfo.stock);
      if (productInfo.stock >= quantity) {
        productsToPurchase.push(product);
        productInfo.stock -= quantity;
        await productInfo.save();
        await cartDao.deleteProdInCartById(id_carrito, productId);
      } else {
        productsNotRemove.push(productInfo);
      }
    }
    let montoTotal = 0;
    for (const product of productsToPurchase) {
      //const { quantity, price } = product;
      const { quantity } = product;
      const price = product.product.price;
      const productTotal = quantity * price;
      montoTotal += productTotal;
      console.log("precio", price);
    }
    console.log("purchase", productsToPurchase);
    console.log("remove", productsNotRemove);
    console.log("total compra", montoTotal);
    const id = uuidv4();
    const ticketData = {
      code: id,
      purchase_datetime: new Date(),
      amount: montoTotal,
      purchaser: "tote", //user.email//req.user//
    };
    const ticketManager = new TicketManagerDB();
    try {
      const createdTicket = await ticketManager.createTicket(ticketData);
      console.log("Ticket creado:", createdTicket);
      res.send("Proceso de compra finalizado");
    } catch (error) {
      console.log("Error al crear el ticket:", error);
      res.status(500).send("Error al finalizar la compra");
    }
  }
}
