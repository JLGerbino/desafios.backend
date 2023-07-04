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
      product: cart.product,
      //id_user: id_user
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

  Purchase = async(id_carrito) => {
    try {
    //const id_carrito = req.params.cid;    
    // const cart = await this.getCartsId(id_carrito);    

    // const productsToPurchase = [];
    // const productsNotRemove = [];

    // for (const product of cart.productos) {      
    // const productId = product.product._id.toString();
    // const quantity = product.quantity;      
    //  console.log("producto id", productId)
    //   // Obtener el producto desde el administrador de productos (puedes usar el ProductManagerDB)
    //   const productInfo = await pManagerDB.getProductsById(productId) //pManagerDB.getProductById(productId);
    //   console.log("productInfo" + productInfo.stock)
    //   // if (!productInfo) {
    //   //   productsToRemove.push(productId);
    //   //   continue;
    //   // }

    //   if (productInfo.stock >= quantity) {
    //     // Restar la cantidad del producto del stock
    //     productInfo.stock -= quantity;
    //     productsToPurchase.push(productInfo);
    //   } else {
    //     productsNotRemove.push(productInfo);
    //   }
    // }
    // console.log("purchase" + productsToPurchase)
    // console.log("remove" + productsNotRemove)

    // // borra el carrito
    // await this.deleteProdInCart(id_carrito);

    // // Actualizar el carrito con los productos que se van a comprar   
    // await this.UpdateCartWithProds(id_carrito, productsNotRemove.product);

    //res.send("Proceso de compra finalizado");
      // const id_carrito = req.params.cid;    
      // const cart = await carritoModel.findOne({_id: id_carrito})//cartDao.getCartsId(id_carrito);
      // const indexCarrito = cart.findIndex((cart) => cart.id == id_carrito)
      // console.log("indexCarrito" + indexCarrito)
      // const productsToPurchase = [];
      // const productsToRemove = [];
      // if (indexCarrito !== -1) {
      //   for (const product of cart.productos) {      
      //   const { product: productId, quantity } = product;
            
      // }} else { return "No existe el carrito";
      }
           catch (error) {
      console.log(error);      
    }
  
  }}
