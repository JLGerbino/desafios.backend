import { Router } from "express";
import ProductManagerFS from "../dao/managersFS/productManager.js";
import ProductManagerDB from "../dao/managersDB/productManagerDB.js";
import CartManagerDB from "../dao/managersDB/cartsManagerDB.js";
import productoModel from "../dao/models/producto.model.js";
import carritoModel from "../dao/models/carrito.model.js";

const router = Router();

const manager = new ProductManagerFS
const managerDB = new ProductManagerDB
const managerCartDB = new CartManagerDB 

router.get("/", async (req, res)=>{
    const {limit = 5} =req.query;
    const {page = 1} = req.query
    const sort = req.query.sort
    const query = req.query.query
    const {status, docs, totalPages, prevPage, nextPage, hasPrevPage, hasNextPage} = await productoModel.paginate({},{limit, page, lean:true})
    const products = docs   
   //
   const filter = await productoModel.find({category: query})
   const prodsFilt = filter.map(item=>item.toObject())
   const orden = await productoModel.find().sort({price: sort})
   const prodsOrd = orden.map(item=>item.toObject())
  console.log(orden);

    if(query){
        res.render("home", {
            products: prodsFilt,//products,
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
   //
   const filter = await productoModel.find({category: query})
   const prodsFilt = filter.map(item=>item.toObject())
   const orden = await productoModel.find().sort({price: sort})
   const prodsOrd = orden.map(item=>item.toObject())
  console.log(orden);

    if(query){
        res.render("products", {
            products: prodsFilt,//products,
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
    res.render("products", {
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

// router.get("/carts/:cid", async (req, res)=>{
//     const id_carrito = req.params.cid;
//     const productos = await managerCartDB.getCartsId(id_carrito);
//     const prods = productos.productos.map(item => item.product.toObject());
//     console.log("los prosd" + prods);
//     res.render("carts", { products: prods });
// });

// router.get("/carts/:cid", async (req, res)=>{
//     const id_carrito = req.params.cid
//     const productosCart = await carritoModel.findById(id_carrito).populate("productos.product").lean();//manager.getProducts();
    
//     //const prods = productos.product.map(item=>item.toObject())    
//     console.log("productosCart" + productosCart)
//     //console.log("estos"+ prods)
//     //console.log(id_carrito)
//     res.render("carts", {
//         products: productosCart,
//         idProducto: productosCart._id,
//         id: id_carrito
//     })
// })

router.get("/carts/:cid", async (req, res)=>{
    const id_carrito = req.params.cid
    const productosCart = await carritoModel.findById(id_carrito).populate("productos.product").lean();    
    console.log("productosCart" + productosCart)    
    res.render("carts", {
        productos: productosCart.productos,
        id: id_carrito                
    })
})

router.get("/chat", (req,res)=>{
    res.render("chat", {})
})

export default router;
