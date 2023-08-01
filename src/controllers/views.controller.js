import productoModel from "../dao/models/producto.model.js";
import ProductManagerDB from "../dao/managersDB/productManagerDB.js";
import carritoModel from "../dao/models/carrito.model.js";
import { GetUserDto } from "../dao/dto/user.dto.js";
import { productsDao } from "../dao/factory.js";
import { cartDao } from "../dao/factory.js";
import TicketManagerDB from "../dao/managersDB/ticketManagerDb.js";

const managerDB = new ProductManagerDB
const ticketManager = new TicketManagerDB

export default class viewController {
  async getHome(req, res){
    const { limit = 5 } = req.query;
    const { page = 1 } = req.query;
    const sort = req.query.sort;
    const query = req.query.query;
    const {
      status,
      docs,
      totalPages,
      prevPage,
      nextPage,
      hasPrevPage,
      hasNextPage,
    } = await productoModel.paginate({}, { limit, page, lean: true });
    const products = docs;
    const filter = await productoModel.find({ category: query });
    const prodsFilt = filter.map((item) => item.toObject());
    const orden = await productoModel.find().sort({ price: sort });
    const prodsOrd = orden.map((item) => item.toObject());
    console.log(orden);
    //productos
    if (query) {
      res.render("home",{
        products: prodsFilt,
        hasPrevPage,
        hasNextPage,
        prevPage,
        nextPage,
        totalPages,
        page,
        sort,
        limit,
      });
    } else {
      if (sort) {
        res.render("home", {
          products: prodsOrd,
          hasPrevPage,
          hasNextPage,
          prevPage,
          nextPage,
          totalPages,
          page,
          sort,
          limit,
        });
      } else {
        res.render("home", {
          products,
          hasPrevPage,
          hasNextPage,
          prevPage,
          nextPage,
          totalPages,
          page,
          sort,
          limit,
        });
      }
    }
  };

  async getProducts(req, res){
    const {limit = 5} =req.query;
    const {page = 1} = req.query
    const sort = req.query.sort
    const query = req.query.query
    const user = req.session.user
    const userDto = new GetUserDto(user)
    const {status, docs, totalPages, prevPage, nextPage, hasPrevPage, hasNextPage} = await productoModel.paginate({},{limit, page, lean:true})
    const products = docs   
    const filter = await productoModel.find({category: query})
    const prodsFilt = filter.map(item=>item.toObject())
    const orden = await productoModel.find().sort({price: sort})
    const prodsOrd = orden.map(item=>item.toObject())
    console.log(orden);

    if(query){
        res.render("products", {
        user: userDto,//req.session.user,
        products: prodsFilt,
        hasPrevPage,
        hasNextPage, 
        prevPage,
        nextPage,
        totalPages,
        page,
        sort,
        limit
    })
}else{
    if(sort){
    res.render("products", {
        user: userDto,//req.session.user,    
        products: prodsOrd,
        hasPrevPage,
        hasNextPage, 
        prevPage,
        nextPage,
        totalPages,
        page,
        sort,
        limit
    })
} else{
    res.render("products",{
        user: userDto,//req.session.user,     
        products,
        hasPrevPage,
        hasNextPage, 
        prevPage,
        nextPage,
        totalPages,
        page,
        sort,
        limit
        })
       } 
    }
  };

  async realTimeProducts(req, res){
    const productos = await managerDB.getProducts(); //manager.getProducts();
    const prods = productos.map(item=>item.toObject())    
    prods[0].owner = req.session.user.email//_id
    prods[1].role = req.session.user.role
    console.log("realtime",productos)
    res.render("realTimeProducts", {products: prods, user: req.session.user.email, role: req.session.user.role})//aca en vez de email iba _id
  };
  
  async cartById(req, res) {
    const id_carrito = req.params.cid;
    const ticketId = req.params.ticketId;    
    const productosCart = await carritoModel.findById(id_carrito).populate("productos.product").lean();
    const productos = productosCart.productos.map((item) => ({
      name: item.product.title,
      price: item.product.price,
      quantity: item.quantity,
      idProducto: item.product._id
    }));
    console.log("productosCart", productosCart);
    res.render("carts", {
      productos: productos,
      id: id_carrito,
      ticketId: ticketId,      
    }); 
  }  

  async chat(req, res){
    res.render("chat", {})
  };

  async register(req, res){
    res.render("register")
  };

  async login(req, res){
    res.render("login")
  };

  async profile(req, res){    
    const user = req.session.user
    const userDto = new GetUserDto(user)
    res.render("profile",{
    user: userDto
    })
    console.log(userDto);
  };

  async forgotPassword(req, res){
    res.render("forgotPassword");
  }

  async resetPassword(req, res){
    const token = req.query.token;
    res.render("resetPassword",{token})    
  };  
}  



  


