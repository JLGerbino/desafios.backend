import chai from "chai";
import supertest from "supertest";
import {app} from "../src/app.js";
import carritoModel from "../src/dao/models/carrito.model.js";

const expect = chai.expect;
const requester = supertest(app);

describe("Testing de ecommerce", () => {
    describe("Test del modulo carritos", () => {
      let carritoId; 

      beforeEach(async function () {
        const result = await requester.post("/api/carts");
        carritoId = result.body.id;
      });
  
      afterEach(async function () {        
        if (carritoId) {
          await carritoModel.findByIdAndDelete(carritoId);
        }
      });
  
      it("Trae un carrito por id", async function () {
        const getCart = await requester.get(`/api/carts/${carritoId}`);
        expect(getCart.statusCode).to.be.equal(200);        
      });

      it("Agrega un producto a un carrito por id", async () => {
        const mockProduct = {
            product: "12sjdgydsffdfdfee",
            quantity: 1,
        };
        const addProduct = await requester.post(`/api/carts/${carritoId}/products/12sjdgydsffdfdfee`).send(mockProduct);
        expect(addProduct.statusCode).to.be.equal(200);        
    });   
    });
  });

