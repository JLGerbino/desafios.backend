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

//codigo traido de after ver los returs y status
//   async updateCart(cid, pid){
 
//     const cart = await cartModel.findOne({_id:cid})

//     const prodIndex = cart.products.findIndex(u=>u._id === pid);

    
//    // console.log(prodIndex);
//     if (prodIndex === -1){
//         const product = {
//             _id: pid,
//             quantity: 1
//         }
//         cart.products.push(product);
//     } 
//     else {
//         let total = cart.products[prodIndex].quantity;
//         cart.products[prodIndex].quantity = total + 1;
//     }

//     const result = await cartModel.updateOne({_id:cid},{$set:cart})
    
//     return {
//         code: 202,
//         status: 'Success',
//         message: cart.products
//     };

// };

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
          let prodInCart = carts[indexCarrito].productos.find(
            (ele) => ele.product == id_producto
          );          
          console.log(prodInCart);
          if (!prodInCart) {
            return "El producto no esta en el carrito"            
          } else {             
            cart.productos.splice(indexProducto,1)//[0]
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
      products[indexProducto].quantity += parseInt(cantidad);  
      await carritoModel.updateOne({_id:id_carrito},{$set:cart}); //cart.save();  
      return "Se actualizó la cantidad";
    } catch (error) {
      console.log(error);
    }
  };

  // UpdateQuantityProd = async (id_carrito, id_producto, cantidad) => {
  //   try {
  //     const cart = await carritoModel.findOne({_id:id_carrito})
  //    // const carts = await this.getCarts();
  //     const products = cart.productos//await pManagerDB.getProducts();
  //     console.log("productos" + id_producto);
  //    // const indexCarrito = carts.findIndex((cart) => cart.id == id_carrito);
  //     //console.log(id_carrito);
  //     // if (indexCarrito !== -1) {
  //        const indexProducto = products.findIndex(
  //          (producto) => producto.product == id_producto
  //        );
  //      // console.log(indexProducto);
  //       //  if (indexProducto !== -1) {
  //       //    let prodInCart = carts[indexCarrito].productos.find(
  //       //      (ele) => ele.product == id_producto
  //       //    );          
  //         //console.log(prodInCart);
  //         if (indexProducto !== -1) {
  //           return "El producto no esta en el carrito"            
  //         } else {
  //           console.log("console" + products[indexProducto]);
  //           products[indexProducto].quantity = parseInt(cantidad)+products[indexProducto].quantity                         
  //           //cart.productos.splice(indexProducto,1)//[0]            
  //           await carritoModel.updateOne({_id:id_carrito},{$set:cart});
  //           //await carritoModel.findByIdAndUpdate(id_carrito, {$set: {productos: cart.productos}});
  //           //console.log("nueva " + prodInCart);

  //           return "Se actualizo la cantidad"                        
  //         }                  
  //     //   } else {
  //     //     return "No existe el producto";
  //     //   }
  //     // } else {
  //     //   return "No existe el carrito";
  //     // }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }; 
 
  UpdateCartWithProds = async (id_carrito) => {
    try {
      const cart = await carritoModel.findOne({_id:id_carrito})
      const carts = await this.getCarts();
      const products = await pManagerDB.getProducts();
      const indexCarrito = carts.findIndex((cart) => cart.id == id_carrito);
      console.log(id_carrito);
      if (indexCarrito !== -1) {                                     
        products.forEach(producto => cart.productos.push(producto));
        await carritoModel.updateOne({_id:id_carrito},{$set:cart});
        return "Se cargaron los productos"                        
      } else {
        return "No existe el carrito";
      }
    } catch (error) {
      console.log(error);
    }
  };
   

  // UpdateCartWithProds = async (id_carrito) => {
  //   try {
  //     const cart = await carritoModel.findOne({_id: id_carrito})
  //     const carts = await this.getCarts()
  //     const products = await pManagerDB.getProducts()
  //     const indexCarrito = carts.findIndex((cart) => cart.id == id_carrito)
  //     console.log(id_carrito)
  //     if (indexCarrito !== -1) {
  //       cart.productos = cart.productos.concat(products)
  //       await carritoModel.updateOne({_id: id_carrito}, {productos: cart.productos})
  //       return "Se cargaron los productos"
  //     } else {
  //       return "No existe el carrito"
  //     }
  //   } catch (error) {
  //     console.log(error)
  //   } 
  //   }

}