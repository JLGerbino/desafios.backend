import { Router } from 'express';
import userModel from '../dao/models/user.model.js';

const router = Router();

router.post('/register', async (req, res) =>{

    const {first_name, last_name, email, age, password} = req.body;

    const exist = await userModel.findOne({email});
    if(exist){
        return res.status(400).send({status:"error", error:"El usuario ya existe!"});
    }
    const user = {
        first_name, last_name, email, age, password
    };

    const result = await userModel.create(user);
    res.send({status:"succes", message:"Usuario registrado"});

})



router.post('/', async (req, res) => {
    const { email, password } = req.body;  
    if (email === "adminCoder@coder.com" && password === "adminCod3r123") {
      req.session.user = {
        //name: "Admin",
        email: email,
        role: "admin"
      };  
      return res.send({ status: "success", payload: req.res.user, message: "Primer logueo!!" });
    }  
    const user = await userModel.findOne({ email, password });  
    if (!user) {
      return res.status(400).send({ status: "error", error: "Datos incorrectos" });
    }  
    req.session.user = {
      name: `${user.first_name} ${user.last_name}`,
      email: user.email,
      age: user.age,
      //role: "usuario"
    };  
    res.send({ status: "success", payload: req.res.user, message: "Primer logueo!!" });
  });
  
router.get('/logout', (req,res)=>{
    req.session.destroy(err =>{
        if(err) return res.status(500).send({status:"error", error:"No pudo cerrar sesion"})
        res.redirect('/');
    })
})

export default router;