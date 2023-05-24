import { Router } from "express";
import ProductManagerFS from "../dao/managersFS/productManager.js";
import ProductManagerDB from "../dao/managersDB/productManagerDB.js";
import CartManagerDB from "../dao/managersDB/cartsManagerDB.js";
import productoModel from "../dao/models/producto.model.js";
import carritoModel from "../dao/models/carrito.model.js";
//import userModel from "../dao/models/user.model.js";

const router = Router();

const manager = new ProductManagerFS
const managerDB = new ProductManagerDB
const managerCartDB = new CartManagerDB 

router.get("/home", async (req, res)=>{
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

//productos  
    if(query){
        res.render("home", {
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
    res.render("home", {
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
    res.render("home", {
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

})

router.get("/products", async (req, res)=>{
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
})


router.get("/realTimeProducts", async (req, res)=>{
    const productos = await managerDB.getProducts(); //manager.getProducts();
    const prods = productos.map(item=>item.toObject())
    console.log(productos)
    res.render("realTimeProducts", {products: prods})
})


//cart
router.get("/carts/:cid", async (req, res)=>{
    const id_carrito = req.params.cid
    const productosCart = await carritoModel.findById(id_carrito).populate("productos.product").lean();    
    console.log("productosCart" + productosCart)    
    res.render("carts", {
        productos: productosCart.productos,
        id: id_carrito                
    })
})


//chat
router.get("/chat", (req,res)=>{
    res.render("chat", {})
})


//user
const publicAcces = (req,res,next) =>{
    if(req.session.user) return res.redirect('/profile');
    next();
}

const privateAcces = (req,res,next)=>{
    if(!req.session.user) return res.redirect('/');
    next();
}

router.get('/register', publicAcces, (req,res)=>{
    res.render('register')
})

router.get('/', publicAcces, (req,res)=>{
    res.render('login')
})

router.get('/profile', privateAcces, (req,res)=>{
    res.render('profile',{
        user: req.session.user
    })
})

export default router;
