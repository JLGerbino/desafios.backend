import { CreateProductDto, GetProductDto } from "../dao/dto/products.dto.js";

export class ProductRepository{
    constructor(dao){
        this.dao = dao;
    }
    async getProductsRep(){
        const products = await this.dao.getProducts()
        return products;
    }
    async addProductRep(product){
        const productDto = new CreateProductDto(product);
        const productCreated = await this.dao.addProduct(productDto);
        return productCreated;
    }

    async getProductsByIdRep(id_producto){
        const product = await this.dao.getProductsById(id_producto);
        return product;
    }

    async deleteProductRep(id_producto){
        const product = await this.dao.deleteProduct(id_producto);
        return product;
    }

    async updateProductRep(product){
        const productDto = new CreateProductDto(product);
        const productUpdate = await this.dao.updateProduct(productDto);
        return productUpdate;
    }    
}