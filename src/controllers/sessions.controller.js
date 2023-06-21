//import passport from 'passport';
import { createHash, validatePassword } from '../utils.js';
import { config } from '../config/config.js';


export default class sessionsController{
    async register(req, res){
        res.send({status:"succes", message:"Usuario registrado"})
    }

    async failregister(req, res){
        console.log("Fallo en el registro");
        res.send({error: "Error en el registro"}) 
    }

    async login(req, res){
        const { email, password } = req.body;      
        if (email === config.auth.account && password === config.auth.pass) {
        req.session.user = {
            //name: "Admin",
            email: email,
            role: "admin"
        };  
        return res.send({ status: "success", payload: req.res.user, message: "Primer logueo!!" });
        } 
        if(!req.user) return res.status(400).send({status:"error", error: 'Invalid credentials'});    
        req.session.user = {
        firts_name: req.user.first_name,
        email: req.user.email,
        age: req.user.age,
        cartId: req.user.cartId//
        }        
        res.send({status:"success", payload:req.user, message:"Primer logueo!!"});
        }

    async faillogin(req, res){
        console.log("Fallo en el ingreso");
        res.send({error: "Error en el ingreso"})
        }

    async logout(req, res){
        req.session.destroy(err =>{
            if(err) return res.status(500).send({status:"error", error:"No pudo cerrar sesion"})
            res.redirect('/');
        })
    }
    
    async resetPassword(req, res){
        const {email, password } = req.body;  
        if(!email || !password ) return res.status(400).send({status:"error", error:"Datos incorrectos"})
        const user = await userModel.findOne({email});
        if(!user) return res.status(400).send({status:"error", error:"Datos incorrectos"})  
        const newHashedPassword = createHash(password);
        await userModel.updateOne({_id:user._id},{$set:{password:newHashedPassword}});
        res.send({status:"success", message:"Contraseña actualizada"}) 
    }

    async github(req, res){        
    }

    async githubcallback(req, res){
        req.session.user = req.user;
        res.redirect('/products') 
    }
}