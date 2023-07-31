import { createHash, validatePassword, generateEmailToken, verifyEmailToken } from '../utils.js';
import { config } from '../config/config.js';
import { CreateUserDto, GetUserDto } from "../dao/dto/user.dto.js";
import { envLogger } from '../middlewares/logger.js';
import { sendRecoveryPass } from '../config/gmail.js';
import  userModel from "../dao/models/user.model.js";

const logger = envLogger();

export default class sessionsController{
    async register(req, res){
        res.send({status:"succes", message:"Usuario registrado"})
    }

    async failregister(req, res){
        console.log("Fallo en el registro");
        res.send({error: "Error en el registro"}) 
    }

    async login(req, res){    

        //const { email, password, role } = req.body;
        
        // if (email === config.auth.account && password === config.auth.pass) {
        // req.session.user = {
        //     //name: "Admin",
        //     email: email,
        //     role: role
        //     //role: "admin"
        // };  
        // return res.send({ status: "success", payload: req.res.user, message: "Primer logueo!!" });
        // } 
        if(!req.user) return res.status(400).send({status:"error", error: 'Invalid credentials'});    
        req.session.user = {        
        first_name: req.user.first_name,
        last_name: req.user.last_name,        
        email: req.user.email,
        age: req.user.age,
        role: req.user.role,
        cartId: req.user.cartId//
        }        
        const user = req.session.user
        const userDto = new GetUserDto(user)
        console.log("sessions.controller", userDto)        
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
    //esta es la que tenia de antes
    // async resetPassword(req, res){
    //     const {email, password } = req.body;  
    //     if(!email || !password ) return res.status(400).send({status:"error", error:"Datos incorrectos"})
    //     const user = await userModel.findOne({email});
    //     if(!user) return res.status(400).send({status:"error", error:"Datos incorrectos"})  
    //     const newHashedPassword = createHash(password);
    //     await userModel.updateOne({_id:user._id},{$set:{password:newHashedPassword}});
    //     res.send({status:"success", message:"Contraseña actualizada"}) 
    // }      

    async forgotPassword(req,res){
        try {
            const { email } = req.body;            
            const user = await userModel.findOne({email:email})
            if(!user){
                return res.send(`<div>Error, <a href="/forgot-password">Intente de nuevo</a></div>`)
            }
            const token = generateEmailToken(email,3*60);
            await sendRecoveryPass(email,token);
            res.send("Se envio un correo a su cuenta para restablecer la contraseña, volver <a href='/'>al login</a>")
        } catch (error) {
            return res.send(`<div>Error, <a href="/forgot-password">Intente de nuevo</a></div>`)    
        }
    };

    async resetPassword(req,res){
        try {
               const token = req.query.token;
               const {email,newPassword}=req.body;
               const validEmail = verifyEmailToken(token) 
               if(!validEmail){
                return res.send(`El enlace ya no es valido, genere uno nuevo: <a href="/forgot-password">Nuevo enlace</a>.`)
               }
               const user = await userModel.findOne({email:email});
               if(!user){
                return res.send("El usuario no esta registrado.")
               }
               if(validatePassword(newPassword,user)){
                return res.send("No puedes usar la misma contraseña.")
               }
               const userData = {
                ...user._doc,
                password:createHash(newPassword)
               };
               const userUpdate = await userModel.findOneAndUpdate({email:email},userData);
               res.render("login",{message:"contraseña actualizada"})    
        } catch (error) {
            res.send(error.message)
        }
    };    

    async github(req, res){        
    }

    async githubcallback(req, res){
        req.session.user = req.user;
        res.redirect('/products') 
    }
}