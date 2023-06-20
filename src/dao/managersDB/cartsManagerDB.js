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
    //let id_carrito = cart._id;
    // if (carts.length === 0) {
    //   cart.id = 1;
    // } else {
    //   cart.id = carts[carts.length - 1].id + 1;
    // }
    // console.log(id_carrito)
    carts.push(cart);
    const nuevoCarrito = await carritoModel.create(cart)
    const id_carrito = nuevoCarrito._id;
    return {
      id: id_carrito,
      product: cart.product
    };    
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
      const cart = await carritoModel.findOne({_id: id_carrito}).populate('productos.product').lean();
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

  deleteProdInCart = async (id_carrito) => {
    try {
      const cart = await carritoModel.findOne({_id:id_carrito});
      const carts = await this.getCarts();
      const indexCarrito = carts.findIndex((cart) => cart.id == id_carrito);
      console.log(id_carrito);
      if (indexCarrito !== -1) {
        await carritoModel.updateOne({_id:id_carrito},{$unset: {productos: ""}});
      } else {
        return "No existe el carrito";
      }
    } catch (error) {
      console.log(error);
    }
  };

  deleteProdInCartById = async (id_carrito, id_producto) => {
    try {
      const cart = await carritoModel.findOne({_id:id_carrito})
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
            return "El producto no esta en el carrito"            
          } else {             
            cart.productos.splice(prodInCart ,1)//[0]
            await carritoModel.updateOne({_id:id_carrito},{$set:cart})                        
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
        (producto) => producto.product == id_producto);  
      if (indexProducto === -1) {
        return "El producto no está en el carrito";
      }  
      products[indexProducto].quantity = parseInt(cantidad);  
      await carritoModel.updateOne({_id:id_carrito},{$set:cart}); 
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
}
  