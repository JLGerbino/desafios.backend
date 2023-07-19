import passport from "passport";
import local from "passport-local";
import userModel from "../dao/models/user.model.js";
import GitHubStrategy from "passport-github2";
import { createHash, validatePassword } from "../utils.js";
import CartManagerDB from "../dao/managersDB/cartsManagerDB.js"; //
import { config } from "./config.js";
import { transporter } from "./gmail.js";
import { EError } from "../enums/EErrors.js";
import { CustomError } from "../repository/customError.repository.js";
import { generateUserErrorParam } from "../repository/userErrorParam.js";
import { generateUserErrorInfo } from "../repository/userErrorInfo.js";
import { envLogger }  from "../middlewares/logger.js";


const LocalStrategy = local.Strategy;
const managerDB = new CartManagerDB(); //
const logger = envLogger()

const initializePassport = () => {
  passport.use(
    "register",
    new LocalStrategy(
      { passReqToCallback: true, usernameField: "email" },
      async (req, username, password, done) => {
        const { first_name, last_name, email, age } = req.body;
        try {
          const userError = { first_name, last_name, email, age, password };
          if (!first_name || !last_name || !email || !age || !password) {
            CustomError.createError({
              name: "Erase Product in cart",
              cause: generateUserErrorInfo(userError),
              message: "error de logueo",
              errorCode: EError.INVALID_PARAM,              
            });            
          }
          const user = await userModel.findOne({ email: username });
          if (user) {
            console.log("El usuario existe");
            return done(null, false);
          }
          const msg = await managerDB.createCart();
          const cartId = msg.id;
          const newUser = {
            first_name,
            last_name,
            email,
            age,
            password: createHash(password),
            cartId: cartId,
            role: "User",
          };          
          const result = await userModel.create(newUser);
          const contenido = await transporter.sendMail({
            from: "Ecommerce Backend",
            to: email,
            subject: "Registro exitoso",
          });
          console.log("contenido", contenido);
          res.json({ status: "sucess", message: "Registo y envio de correo." });

          return done(null, result);
        } catch (error) {
          return done("Error al registrar el usuario: " + error);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    const user = await userModel.findById(id);
    done(null, user);
  });

  passport.use(
    "login",
    new LocalStrategy(
      { usernameField: "email" },
      async (username, password, done) => {
        try {
          const user = await userModel.findOne({ email: username });
          console.log("login", user);
          if (!user) { 
            logger.error("No existe el usuario logger");            
            return done(null, false);
          }
          if (!validatePassword(password, user)) return done(null, false);
          return done(null, user);
        } catch (error) {
          return done("Error al intentar ingresar: " + error);
        }
      }
    )
  );

  //passport GitHub
  passport.use(
    "github",
    new GitHubStrategy(
      {
        clientID: config.gitHub.clientID,
        clientSecret: config.gitHub.clientSecret,
        callbackURL: config.gitHub.callbackURL, //"http://localhost:8080/api/sessions/githubcallback"
      },
      async (accesToken, refreshToken, profile, done) => {
        try {
          console.log(profile);
          let user = await userModel.findOne({ email: profile._json.email });
          if (!user) {
            const msg = await managerDB.createCart(); //
            const cartId = msg.id; //
            const email =
              profile._json.email == null ? profile._json.username : null;
            const newUser = {
              first_name: profile._json.login,
              last_name: "",
              email: email,
              age: 18,
              password: "",
              cartId: cartId, //
            };
            const result = await userModel.create(newUser);
            done(null, result);
          } else {
            done(null, user);
          }
        } catch (error) {
          return done(null, error);
        }
      }
    )
  );
};

export default initializePassport;
