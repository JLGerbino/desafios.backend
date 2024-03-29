import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT
const MONGO_URL = process.env.MONGO_URL
const CORREO_ADMIN = process.env.CORREO_ADMIN
const PASSWORD_ADMIN = process.env.PASSWORD_ADMIN
const COOKIE_SECRET = process.env.COOKIE_SECRET
const ID_GITHUB = process.env.ID_GITHUB
const SECRET_GITHUB = process.env.SECRET_GITHUB
const CALLBACKURL_GITHUB = process.env.CALLBACKURL_GITHUB
const PERSISTENCE = process.env.PERSISTENCE
const ADMIN_EMAIL = process.env.ADMIN_EMAIL
const ADMIN_PASS = process.env.ADMIN_PASS
const NOD_ENV = process.env.NOD_ENV
const PRIVATE_KEY = process.env.PRIVATE_KEY

export const config = {
    server: {
        port: PORT,
        persistence: PERSISTENCE    
    },
    mongo: {
        url: MONGO_URL
    },
    auth: {
        account: CORREO_ADMIN,
        pass: PASSWORD_ADMIN
    },
    keys:{
        cookieSecret: COOKIE_SECRET,
        jwtSecret: PRIVATE_KEY
    },
    gitHub:{
        clientID: ID_GITHUB,
        clientSecret: SECRET_GITHUB,
        callbackURL: CALLBACKURL_GITHUB        
    },
    gmail:{
        adminAccount: ADMIN_EMAIL,
        adminPass: ADMIN_PASS
    },
    entorno:{
        environment: NOD_ENV
    }
} 