import CartManagerDB from "../dao/managersDB/cartsManagerDB.js";

const cartManagerDB = new CartManagerDB();

export default class CartController {
    
  async createCart (req, res){
    const msg = await cartManagerDB.createCart();
    res.send(msg);        
  };

  async addCart (req, res){
    const id_carrito = req.params.cid;
    const id_producto = req.params.pid;    
    const msg = await cartManagerDB.addCart(id_carrito, id_producto)  //manager.addCart(id_carrito, id_producto);
    res.send(msg);
  }

  async getCartsId (req, res){
    const id = req.params.cid;
    const producto = await cartManagerDB.getCartsId(id) //carritoModel.find({_id:id});
    res.send(producto);
  }

  async deleteProdInCartById (req, res){
    const id_carrito = req.params.cid;
    const id_producto = req.params.pid;    
    const msg = await cartManagerDB.deleteProdInCartById(id_carrito, id_producto)
    res.send(msg);
  }

  async deleteProdInCart (req, res){
    const id_carrito = req.params.cid;        
    const msg = await cartManagerDB.deleteProdInCart(id_carrito)
    res.send(msg);
  }

  async UpdateQuantityProd (req, res){
    const id_carrito = req.params.cid;
    const id_producto = req.params.pid;  
    const quantity = req.body.quantity 
    const cantidad = parseInt(quantity)
    console.log(cantidad)
    const msg = await cartManagerDB.UpdateQuantityProd(id_carrito, id_producto, cantidad)
    res.send(msg);
  }

  async UpdateCartWithProds (req, res){
    const id_carrito = req.params.cid; 
    const products = req.body.products;     
    const msg = await cartManagerDB.UpdateCartWithProds(id_carrito, products);
    res.send(msg);
  }


}
