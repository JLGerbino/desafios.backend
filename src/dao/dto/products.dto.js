export class CreateProductDto {
    constructor(product){
        this.title = product.nombre;
        this.description = product.descripcion;
        this.code = product.codigo;
        this.price = product.precio;
        this.status = product.status;
        this.stock = product.stock;
        this.category = product.categoria;
        this.thumbnail = product.imagen
    }  
}
export class GetProductDto{
    constructor(productDB){
        this.nombreProducto = productDB.title + ' ' + productDB.desciption;
        this.precio = productDB.price;
        this.status = productDB.status;
    }
}