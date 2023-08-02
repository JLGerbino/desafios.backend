//import CartManagerDB from "../dao/managersDB/cartsManagerDB.js";
//import { v4 as uuidv4 } from "uuid";
import { cartDao } from "../dao/factory.js";
import { productService } from "../repository/index.js";
import userModel from "../dao/models/user.model.js";
import TicketManagerDB from "../dao/managersDB/ticketManagerDb.js"; //const cartManagerDB = new CartManagerDB();
import { GetUserDto } from "../dao/dto/user.dto.js"
import { generateProductErrorParam } from "../repository/productErrorParam.js";
import { generateProductErrorInfo } from "../repository/productErrorInfo.js";
import { generateCartErrorParam } from "../repository/cartErrorParam.js";

const ticketManager = new TicketManagerDB();

export default class CartController {
  async createCart(req, res) {
    //const emailUser = req.session.user//agregue
    const msg = await cartDao.createCart(); //cartManagerDB.createCart();
    res.send(msg);
  }

  async addCart(req, res) {
    const id_carrito = req.params.cid;
    const id_producto = req.params.pid;
    //const emailUser = req.params.emu;//esto lo agrego para enviar el email del usuario
    const msg = await cartDao.addCart(id_carrito, id_producto);//aca agregue emailUser //cartManagerDB.addCart(id_carrito, id_producto)  //manager.addCart(id_carrito, id_producto);
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
    // if (!id_carrito) {        
    //   CustomError.createError({
    //     name: "Erase all products in cart",
    //     cause: generateCartErrorParam(id_carrito),
    //     message: "error borrando todos los productos del carrito",
    //     errorCode: EError.INVALID_PARAM
    //   })
    // }       
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
    const userEmail = req.session.user.email;          
    const cart = await cartDao.getCartsId(id_carrito);
    const msg = await cartDao.Purchase(id_carrito, userEmail, res);                  
    //res.send(msg)        
  }  

}
