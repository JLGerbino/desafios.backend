import { config } from "../config/config.js";

const persistence = config.server.persistence;

let productsDao 

switch (persistence) {
    case "mongo":
        const {connectDB} = await import("../config/dbConnection.js");
        connectDB();
        const {default: ProductManagerDB} = await import("./managersDB/productManagerDB.js")
        productsDao = new ProductManagerDB();
    break;
    
    case "memory":
        const {default: ProductManager} = await import("./managersFS/productManager.js")
        productsDao = new ProductManager();
    break;      
}

let cartDao 

switch (persistence) {
    case "mongo":
        const {connectDB} = await import("../config/dbConnection.js");
        connectDB();
        const {default: CartManagerDB} = await import("./managersDB/cartsManagerDB.js")
        cartDao = new CartManagerDB();
    break;
    
    case "memory":
        const {default: CartManager} = await import("./managersFS/cartManagers.js")
        cartDao = new CartManager();
    break;      
}


export {productsDao, cartDao}