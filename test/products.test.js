import chai from "chai";
import supertest from "supertest";
import productoModel from "../src/dao/models/producto.model.js";
import {app} from "../src/app.js";
import userModel from "../src/dao/models/user.model.js";

const expect = chai.expect;
const requester = supertest(app);


describe("Testing de ecommerce", ()=>{    
    describe("Test del modulo products", ()=>{
        let productId;        
        it("Traer todos los productos existentes", async () =>{
            const result = await requester.get("/api/products")
            expect(result.statusCode).to.be.equal(200)
            expect(Array.isArray(result.body.productos)).to.deep.equal(true);            
        });
         it("Traer un producto por ID", async () => {
      
      const product = await productoModel.create({
        title: "Producto de prueba",
        description: "Descripción de prueba",
        code: "12345",
        price: 100,
        status: "true",
        stock: 10,
        category: "Categoría de prueba",
        owner: "premium",
        thumbnail: "imagen.jpg",
      });
      
      productId = product._id;
      const getProductResponse = await requester.get(`/api/products/${productId}`);      
      expect(getProductResponse.statusCode).to.be.equal(200);      
      expect(getProductResponse.body._id).to.be.equal(productId.toString());     
    }); 
    afterEach(async () => {        
        if (productId) {
          await productoModel.findByIdAndDelete(productId);
        }
      });
    });
});




