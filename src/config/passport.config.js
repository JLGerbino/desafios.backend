import passport from "passport";
import local from "passport-local";
import userModel from "../dao/models/user.model.js";
import GitHubStrategy from "passport-github2";
import { createHash, validatePassword } from "../utils.js";
import CartManagerDB from "../dao/managersDB/cartsManagerDB.js"//
import { config } from "./config.js";

const LocalStrategy = local.Strategy;
const managerDB = new CartManagerDB//

const initializePassport = () => {
    passport.use("register", new LocalStrategy(
        {passReqToCallback:true, usernameField:"email"}, 
        async (req,username, password,done) =>{
            const { first_name, last_name, email,age } = req.body;
            try {
                const user = await userModel.findOne({email:username}); 
                if(user){
                    console.log("El usuario existe");
                    return done(null,false);
                }
                const msg = await managerDB.createCart();//
                const cartId= msg.id//
                const newUser = {
                    first_name, 
                    last_name, 
                    email, 
                    age, 
                    password: createHash(password),
                    cartId: cartId,//
                    role:"User"//
                }
                const result = await userModel.create(newUser);
                return done(null, result);
            } catch (error) {
                return done("Error al registrar el usuario: " + error);
            }
        }
    ));

    passport.serializeUser((user,done)=>{
        done(null, user._id)
    });

    passport.deserializeUser( async (id, done)=>{
        const user = await userModel.findById(id);
        done(null, user)
    });
    
    passport.use("login", new LocalStrategy({usernameField:"email"}, async (username, password, done)=>{
        try {           
           const user = await userModel.findOne({email:username})
           //console.log(user);
            if(!user){
                console.log("No existe el usuario");
                return done(null, false);
            }
            if(!validatePassword(password,user)) return done (null, false);
            return done(null,user);
        } catch (error) {            
            return done("Error al intentar ingresar: " + error);            
        }
    }))

//passport GitHub
    passport.use("github", new GitHubStrategy({
        clientID: config.gitHub.clientID,
        clientSecret: config.gitHub.clientSecret,
        callbackURL: config.gitHub.callbackURL //"http://localhost:8080/api/sessions/githubcallback"
    }, async (accesToken, refreshToken,profile,done)=>{
        try {            
            console.log(profile);
            let user = await userModel.findOne({email: profile._json.email})
            if(!user){
                const msg = await managerDB.createCart();//
                const cartId= msg.id//
                const email = profile._json.email == null ?  profile._json.username : null;
                const newUser = {
                        first_name: profile._json.login,
                        last_name:"",
                        email: email,
                        age: 18,
                        password:"",
                        cartId: cartId,//                        
                }
                const result = await userModel.create(newUser);
                done(null,result)
            }else{                
                done(null, user)
            }
        } catch (error) {
            return done(null,error)
        }
    }))
}

export default initializePassport;
