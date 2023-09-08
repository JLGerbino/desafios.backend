import { fileURLToPath } from "url";
import { dirname } from "path";
import path from "path";
import multer from "multer";
import bcrypt from "bcrypt";
import {Faker, en, es } from "@faker-js/faker";
import jwt from "jsonwebtoken";
import { config } from "./config/config.js";


const PRIVATE_KEY = config.keys.jwtSecret//"CoderKEY";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        //cb(null, __dirname + "/images") 
        cb(null, path.join(__dirname, "/public/images"));//agregue       
    },
    filename: function(req, file, cb){        
        cb(null, `${Date.now()}-${file.originalname}`)
        //cb(null, `${file.originalname}`)
    }
})

export const createHash = (password) => bcrypt.hashSync(password, bcrypt.genSaltSync(10));

export const validatePassword = (password, user) => bcrypt.compareSync(password, user.password);

export const generateEmailToken = (email, expireTime)=>{
    const token = jwt.sign({email},PRIVATE_KEY, {expiresIn:expireTime})
    return token
}

export const verifyEmailToken = (token) =>{
    try {
        const info = jwt.verify(token,PRIVATE_KEY);
        return info.email;
    } catch (error) {
        console.log(error.message)
        return null
    }
}

//configuracion para guardar imagenes de usuarios
const validFields = (body) => {
    const {email, password} = body;
    if(!email || !password){
        return false;
    }else{
        return true;
    }
};

//filtro para validar los campos de cargar la imagen
const multerFilterProfile = (req,file,cb)=>{
    const isValid = validFields(req.body);
    if(isValid){
        cb(null,true)
    }else{
        cb(null,false)
    }
}

const profileStorage = multer.diskStorage({
    //donde guardo los archivos
    destination: function(req,file,cb) {
      cb(null,path.join(__dirname,"/multer/users/profiles"))  
    },
    //el nombre del archivo que estamos guardando
    filename: function (req,file,cb) {
        cb(null,`${req.body.email}-perfil-${file.originalname}`)        
    }
});

//crear el uploader de multer
//export const uploaderProfile = multer({storage:profileStorage,fileFilter:multerFilterProfile})
export const uploaderProfile = multer({storage:profileStorage})

//Configuracion para guardar documentos de los usuarios
const documentStorage = multer.diskStorage({
    destination: function(req,file,cb) {
        cb(null,path.join(__dirname,"/multer/users/documents"));
    },
    filename: function(req,file,cb) {
        const userId = req.params.uid;//esto agregue
        cb(null,`${userId}-document-${file.originalname}`);//esta linea es nueva
        // cb(null,`${req.user.email}-document-${file.originalname}`);
    }
})
//creamos el uploader
export const uploaderDocument = multer({storage:documentStorage});

//configuracion para guardar imagenes de productos
const productStorage= multer.diskStorage({
    destination: function(req,file,cb) {
        cb(null,path.join(__dirname,"/multer/products/images"));
    },
    filename: function(req,file,cb) {
        cb(null,`${req.body.code}-image-${file.originalname}`);
    }
})

export const uploaderProduct = multer({storage:productStorage})


//nuevo faker
export const customFaker = new Faker({
    //configura el idioma
    locale: [en],
})
const { commerce, image, database, string } = customFaker;

export const generateProduct = () => {
    return {
        _id: database.mongodbObjectId(),
        title:commerce.productName(),
        description:commerce.productDescription(),
        code:string.alphanumeric(10),
        price: parseFloat(commerce.price()),
        status: true,
        stock: parseInt(string.numeric(2)),        
        category:commerce.productAdjective(),        
        thumbnail: image.url()       
    }
}

export const uploader = multer({storage});

export default __dirname;
