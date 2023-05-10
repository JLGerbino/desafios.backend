import fs from "fs";
import ProductManager from "./productManager.js";

const manager = new ProductManager();

export default class CartManager {
  constructor() {
    this.path = "./src/files/carrito.json";   
  }

  getCarts = async () => {
    try {
      if (fs.existsSync(this.path)) {
        const data = await fs.promises.readFile(this.path, "utf8");
        const carts = JSON.parse(data);
        return carts;
      } else {
        return [];
      }
    } catch (error) {
      console.log(error);
    }
  };

  createCart = async () => {
    try{
    const carts = await this.getCarts();
    let cart = {
      productos: [],
    };
    let id_carrito = cart.id;
    if (carts.length === 0) {
      cart.id = 1;
    } else {
      cart.id = carts[carts.length - 1].id + 1;
    }
    carts.push(cart);
    await fs.promises.writeFile(this.path, JSON.stringify(carts, null, "\t"));
    return cart;
     }catch(error){
      console.log(error)
    }
  };

  addCart = async (id_carrito, id_producto) => {
    try {
      const carts = await this.getCarts();
      const products = await manager.getProducts();
      const indexCarrito = carts.findIndex((cart) => cart.id == id_carrito);
      console.log(id_carrito);
      if (indexCarrito !== -1) {
        const indexProducto = products.findIndex(
          (producto) => producto.id == id_producto
        );
        console.log(indexProducto);
        if (indexProducto !== -1) {
          let prodInCart = carts[indexCarrito].product.find(
            (ele) => ele.product == id_producto
          );          
          console.log(prodInCart);
          if (!prodInCart) {
            carts[indexCarrito].product.push({
              product: id_producto,
              quantity: 1,
            });
          } else {
            let cantidad = prodInCart.quantity;
            prodInCart.quantity = cantidad + 1            
          }
          console.log("cargar producto");
          console.log(id_producto);
          await fs.promises.writeFile(
            this.path,
            JSON.stringify(carts, null, "\t")
          );
        } else {
          return "No existe producto";
        }
      } else {
        return "no existe carrito";
      }
    } catch (error) {
      console.log(error);
    }
  };

  getCartsId = async (id_carrito) => {
    try {
      const carts = await this.getCarts();
      const cart = carts.find((cart) => cart.id == id_carrito);
      if (cart) {
        return cart;
      } else {
        return "not found";
      }
    } catch (error) {
      console.log(error);
    }
  };
}