import { fileURLToPath } from "url";
import { dirname, format } from "path";
import multer from "multer";
import bcrypt from "bcrypt";
import {Faker, en, es } from "@faker-js/faker";

export const createHash = (password) => bcrypt.hashSync(password, bcrypt.genSaltSync(10));
export const validatePassword = (password, user) => bcrypt.compareSync(password, user.password);

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

//nuevo faker
export const customFaker = new Faker({
    //Por Ej. el idioma
    locale: [en],
})
const { commerce, image, database, string, internet, person, phone, datatype, lorem } = customFaker;

export const generateProduct = () => {
    return {
        _id: database.mongodbObjectId(),
        title: commerce.productName(),
        description:commerce.productDescription(),
        code: string.alphanumeric(10),
        price: parseFloat(commerce.price()),
        status: " ",
        stock: parseInt(string.numeric(2)),        
        category:commerce.productAdjective(),        
        thumbnail: image.url()       
    }
}

export const uploader = multer({storage});

export default __dirname;
