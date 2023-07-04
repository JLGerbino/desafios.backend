import { ProductRepository } from "./products.repository.js" 
import { productsDao } from "../dao/factory.js"

export const productService = new ProductRepository(productsDao)