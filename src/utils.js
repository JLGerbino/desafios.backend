import { fileURLToPath } from "url";
import { dirname, format } from "path";
import multer from "multer";
import bcrypt from "bcrypt";
import {Faker, en, es } from "@faker-js/faker";
import jwt from "jsonwebtoken";
import { config } from "./config/config.js";

const PRIVATE_KEY = "CoderKEY";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, __dirname + "./public/images")        
    },
    filename: function(req, file, cb){        
        //cb(null, `${Date.now()}-${file.originalname}`)
        cb(null, `${file.originalname}`)
    }

})

export const createHash = (password) => bcrypt.hashSync(password, bcrypt.genSaltSync(10));

export const validatePassword = (password, user) => bcrypt.compareSync(password, user.password);

// //agregue jwt
export const generateEmailToken = (email, expireTime)=>{
    const token = jwt.sign({email},PRIVATE_KEY, {expiresIn:expireTime})
    return token
}//
//agregue para session
// export const generateEmailToken = () => {
//     const token = Math.random().toString(36).substr(2, 10); // Generar un código aleatorio único
//     return token;
//   };//

//agregue
export const verifyEmailToken = (token) =>{
    try {
        const info = jwt.verify(token,PRIVATE_KEY);
        return info.email;
    } catch (error) {
        console.log(error.message)
        return null
    }
}//

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
