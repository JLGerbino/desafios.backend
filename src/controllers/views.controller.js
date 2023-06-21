import productoModel from "../dao/models/producto.model.js";
import ProductManagerDB from "../dao/managersDB/productManagerDB.js"
import carritoModel from "../dao/models/carrito.model.js"

const managerDB = new ProductManagerDB

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
      res.render("home", {
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
    
    const {status, docs, totalPages, prevPage, nextPage, hasPrevPage, hasNextPage} = await productoModel.paginate({},{limit, page, lean:true})
    const products = docs   
    const filter = await productoModel.find({category: query})
    const prodsFilt = filter.map(item=>item.toObject())
    const orden = await productoModel.find().sort({price: sort})
    const prodsOrd = orden.map(item=>item.toObject())
  console.log(orden);

    if(query){
        res.render("products", {
        user: req.session.user,
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
        user: req.session.user,    
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
        user: req.session.user,     
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
  }

  async realTimeProducts(req, res){
    const productos = await managerDB.getProducts(); //manager.getProducts();
    const prods = productos.map(item=>item.toObject())
    console.log(productos)
    res.render("realTimeProducts", {products: prods})
  };

  async cartById(req, res){
    const id_carrito = req.params.cid
    const productosCart = await carritoModel.findById(id_carrito).populate("productos.product").lean();    
    console.log("productosCart" + productosCart)    
    res.render("carts", {
        productos: productosCart.productos,
        id: id_carrito                
    })
  };

  async chat(req, res){
    res.render("chat", {})
  };

  async register(req, res){
    res.render("register")
  }

  async login(req, res){
    res.render("login")
  }

  async profile(req, res){
    res.render("profile",{
        user: req.session.user
    })
  }

  async resetPassword(req, res){
    res.render("resetPassword")
  }
}