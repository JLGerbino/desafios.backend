import chai from "chai";
import supertest from "supertest";
import productoModel from "../src/dao/models/producto.model.js";
import {app} from "../src/app.js";
import userModel from "../src/dao/models/user.model.js";

const expect = chai.expect;
const requester = supertest(app);

describe("Testing de ecommerce", ()=>{    
    describe("Test del modulo sessions", ()=>{
        let premiumUser
        let loginResponse        

        before(async () =>{
            premiumUser = await userModel.create({
                first_name: "Jose Luis",
                last_name: "Gerbino",
                email: "totegerbino@email.com",
                age: "47",
                password: "1234",
                cartId: "isaherre21312",
                role: "premium",                
            });                      
        })
        after(async ()=>{
            await userModel.findByIdAndDelete(premiumUser._id)
        })        
        it("Loguea correctamente a un usuario", async () =>{            
            const login = await requester
            .post("/api/sessions")
            .send({email: premiumUser.email, password: premiumUser.password})
            const {statusCode, _body, ok} = login;
            expect(login.statusCode).to.be.equal(302)            
            console.log(ok);
            console.log(_body);
            console.log(statusCode);            
        })
        
    })

})
