import { Router } from 'express';
import passport from 'passport';
import userModel from '../dao/models/user.model.js';
import { createHash, validatePassword } from '../utils.js';

const router = Router();

//nueva ruta con passport
router.post("/register", passport.authenticate("register", {failureRedirect:"/failregister"}), async (req, res) =>{   
    res.send({status:"succes", message:"Usuario registrado"});
})
//ruta de redireccion para falla de registro
router.get("/failregister", async (req, res) =>{
  console.log("Fallo en el registro");
  res.send({error: "Error en el registro"})
})

//nueva ruta con passport 
  router.post("/", passport.authenticate("login" ,{failureRedirect:"/faillogin"}), async (req, res) => {
    const { email, password } = req.body;  
    if (email === "adminCoder@coder.com" && password === "adminCod3r123") {
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
      }        
    res.send({status:"success", payload:req.user, message:"Primer logueo!!"});
  });

//ruta de redireccion para falla en el login
  router.get("/faillogin", async (req, res) =>{
    console.log("Fallo en el ingreso");
    res.send({error: "Error en el ingreso"})
  })

router.get('/logout', (req,res)=>{
    req.session.destroy(err =>{
        if(err) return res.status(500).send({status:"error", error:"No pudo cerrar sesion"})
        res.redirect('/');
    })
})

//restaurar contraseña
router.post('/restartPassword', async (req, res)=>{
  const {email, password } = req.body;  
  if(!email || !password ) return res.status(400).send({status:"error", error:"Datos incorrectos"})
  const user = await userModel.findOne({email});
  if(!user) return res.status(400).send({status:"error", error:"Datos incorrectos"})  
  const newHashedPassword = createHash(password);
  await userModel.updateOne({_id:user._id},{$set:{password:newHashedPassword}});
  res.send({status:"success", message:"Contraseña actualizada"})
})

router.get('/github', passport.authenticate('github', {scope:['user:email']}), async (req,res)=>{})

router.get('/githubcallback', passport.authenticate('github',{failureRedirect:'/'}), async (req,res)=>{

    req.session.user = req.user;
    res.redirect('/products')

})

export default router;