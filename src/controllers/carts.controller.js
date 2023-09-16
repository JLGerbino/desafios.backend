import { cartDao } from "../dao/factory.js";
import TicketManagerDB from "../dao/managersDB/ticketManagerDb.js"; 

const ticketManager = new TicketManagerDB();

export default class CartController {
  async createCart(req, res) {
    const msg = await cartDao.createCart();
    res.send(msg);
  }

  async addCart(req, res) {
    const id_carrito = req.params.cid;
    const id_producto = req.params.pid;
    const msg = await cartDao.addCart(id_carrito, id_producto);
    res.send(msg);
  }

  async getCartsId(req, res) {
    const id = req.params.cid;
    const producto = await cartDao.getCartsId(id);
    res.send(producto);
  }

  async deleteProdInCartById(req, res) {
    const id_carrito = req.params.cid;
    const id_producto = req.params.pid;
    const msg = await cartDao.deleteProdInCartById(id_carrito, id_producto);
    res.send(msg);
  }

  async deleteProdInCart(req, res) {
    const id_carrito = req.params.cid;
    const msg = await cartDao.deleteProdInCart(id_carrito);
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
    );
    res.send(msg);
  }

  async UpdateCartWithProds(req, res) {
    const id_carrito = req.params.cid;
    const products = req.body.products;
    const msg = await cartDao.UpdateCartWithProds(id_carrito, products);
    res.send(msg);
  }

  async purchase(req, res) {
    try {
      if (!req.session.user) {
        console.log("La sesión del usuario no está presente");
      }
      const id_carrito = req.params.cid;
      const userEmail = req.session.user.email;
      const cart = await cartDao.getCartsId(id_carrito);
      const compraExitosa = await cartDao.Purchase(id_carrito, userEmail, res);
      if (compraExitosa) {
        return res
          .status(200)
          .json({ message: "La compra se realizó con éxito" });
      } else {
        return res
          .status(400)
          .json({ error: "Hubo un problema al realizar la compra" });
      }
    } catch (error) {
      console.error("Error en la solicitud de compra", error);
      return res
        .status(500)
        .json({ error: "Error en el servidor al procesar la compra" });
    }
  }
}
