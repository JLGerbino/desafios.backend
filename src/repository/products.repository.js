import { CreateProductDto, GetProductDto } from "../dao/dto/products.dto.js";

export class ProductRepository{
    constructor(dao){
        this.dao = dao;
    }
    async getProductsRep(){
        const products = await this.dao.getProducts()
        return products;
    }
    async addProductRep(product){//agregue user
        const productDto = new CreateProductDto(product);
        const user = req.session.user._id//agregue
        //const productWithOwner = { ...productDto, owner: user };//77agregue esto
        const productCreated = await this.dao.addProduct(productDto, user);//agregue iduser
        return productCreated;
    }

    async getProductsByIdRep(id_producto){
        const product = await this.dao.getProductsById(id_producto);
        return product;
    }

    async deleteProductRep(id_producto){
            //esto agregue
        const user = req.session.user.role
        console.log("rol del ususario en product.controller", user);//hasta aca  
        const product = await this.dao.deleteProduct(id_producto);
        return product;
    }

    async updateProductRep(product){
        const productDto = new CreateProductDto(product);
        const productUpdate = await this.dao.updateProduct(productDto);
        return productUpdate;
    }    
}