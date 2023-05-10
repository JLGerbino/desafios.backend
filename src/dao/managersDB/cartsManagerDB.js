import carritoModel from "../models/carrito.model.js";
import ProductManagerDB from "../managersDB/productManagerDB.js";

const pManagerDB = new ProductManagerDB();

export default class CartManagerDB {

  getCarts = async () => {
    try {
       const carritos = await carritoModel.find()
       return carritos    
    } catch (error) {
      console.log(error);
    }   
  };

  createCart = async () => {
    try{
    const carts = await this.getCarts();    
    let cart = {
      product: [],
      };    
    let id_carrito = cart.id;
    // if (carts.length === 0) {
    //   cart.id = 1;
    // } else {
    //   cart.id = carts[carts.length - 1].id + 1;
    // }
    carts.push(cart);
    await carritoModel.create(cart) 
    return cart;
     }catch(error){
      console.log(error)
    }
  };

  addCart = async (id_carrito, id_producto) => {
    try {
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
          let prodInCart = carts[indexCarrito].productos.find(
            (ele) => ele.product == id_producto
          );          
          console.log(prodInCart);
          if (!prodInCart) {
            carts[indexCarrito].productos.push({
              product: id_producto,
              quantity: 1,
            });
          } else {
            let cantidad = prodInCart.quantity;
            prodInCart.quantity = cantidad + 1            
          }
          carritoModel.create(carts)          
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

  getCartsId = async (id_carrito) => {
    try {
      const carts = await this.getCarts();      
      const cart = carts.find((cart) => cart.id == id_carrito);
      console.log("cart" + cart)
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
}
