import { Router } from 'express';
import passport from 'passport';
import userModel from '../dao/models/user.model.js';
import { createHash, validatePassword } from '../utils.js';

const router = Router();
//antigua ruta registro antes de passport. Hay que eliminar
// router.post('/register', async (req, res) =>{
//     const {first_name, last_name, email, age, password} = req.body;
//     const exist = await userModel.findOne({email});
//     if(exist){
//         return res.status(400).send({status:"error", error:"El usuario ya existe!"});
//     }
//     const user = {
//         first_name, last_name, email, age, password: createHash(password)
//     };
//     const result = await userModel.create(user);
//     res.send({status:"succes", message:"Usuario registrado"});
// })

//nueva ruta con passport
router.post("/register", passport.authenticate("register", {failureRedirect:"/failregister"}), async (req, res) =>{   
    res.send({status:"succes", message:"Usuario registrado"});
})
//ruta de redireccion para falla de registro
router.get("/failregister", async (req, res) =>{
  console.log("Fallo en el registro");
  res.send({error: "Error en el registro"})
})

//antigua ruta / antes de passport borrar
// router.post("/", async (req, res) => {
//     const { email, password } = req.body;  
//     if (email === "adminCoder@coder.com" && password === "adminCod3r123") {
//       req.session.user = {
//         //name: "Admin",
//         email: email,
//         role: "admin"
//       };  
//       return res.send({ status: "success", payload: req.res.user, message: "Primer logueo!!" });
//     }  
//     const user = await userModel.findOne({email});  
//     if (!user) {
//       return res.status(400).send({ status: "error", error: "Datos incorrectos" });
//     }  
//     const isValidPassword = validatePassword(password, user);
//     if(!isValidPassword) return res.status(400).send({status:"error", error:"Datos incorrectos"})
//     req.session.user = {
//       name: `${user.first_name} ${user.last_name}`,
//       email: user.email,
//       age: user.age,
//       //role: "usuario"
//     };  
//     res.send({ status: "success", payload: req.res.user, message: "Primer logueo!!" });
//   });

//esta funciona 
  router.post("/", passport.authenticate("login" ,{failureRedirect:"/faillogin"}), async (req, res) => {
    // if (req.user.role === 'admin') {
    //   req.session.user = {
    //     email: req.user.email,
    //     role: 'admin'
    //   };
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
      //role: "usuario"
        // first_name : req.user.first_name,
        // last_name: req.user.last_name,
        // age: req.user.age,
        // email: req.user.email
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