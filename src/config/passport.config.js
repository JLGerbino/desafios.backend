import passport from "passport";
import local from "passport-local";
import userModel from "../dao/models/user.model.js";
import GitHubStrategy from "passport-github2";
import  { createHash, validatePassword } from "../utils.js"

const LocalStrategy = local.Strategy;

const initializePassport = () => {

    passport.use('register', new LocalStrategy(
        {passReqToCallback:true, usernameField:'email'}, 
        async (req,username, password,done) =>{
            const { first_name, last_name, email,age } = req.body;
            try {
                const user = await userModel.findOne({email:username}); 
                if(user){
                    console.log('El usuario existe');
                    return done(null,false);
                }
                const newUser = {
                    first_name, 
                    last_name, 
                    email, 
                    age, 
                    password: createHash(password)
                }
                const result = await userModel.create(newUser);
                return done(null, result);
            } catch (error) {
                return done("Error al registrar el usuario: " + error);
            }
        }
    ));
    passport.serializeUser((user,done)=>{
        done(null, user._id)
    });
    passport.deserializeUser( async (id, done)=>{
        const user = await userModel.findById(id);
        done(null, user)
    });

    //este anda
    passport.use('login', new LocalStrategy({usernameField:'email'}, async (username, password, done)=>{
        try {           
           const user = await userModel.findOne({email:username})
           //console.log(user);
            if(!user){
                console.log('No existe el usuario');
                return done(null, false);
            }
            if(!validatePassword(password,user)) return done (null, false);
            return done(null,user);
        } catch (error) {            
            return done("Error al intentar ingresar: " + error);            
        }
    }))

//passport GitHub
    passport.use('github', new GitHubStrategy({
        clientID:'Iv1.f45c52d4cfd2a161',
        clientSecret:'48eb448e7dae5acbc85589cc16aabe3b5fb98fae',
        callbackURL: 'http://localhost:8080/api/sessions/githubcallback'

    }, async (accesToken, refreshToken,profile,done)=>{
        try {            
            console.log(profile); //vemos toda la info que viene del profile
            let user = await userModel.findOne({email: profile._json.email})
            if(!user){
                const email = profile._json.email == null ?  profile._json.username : null;
                const newUser = {
                        first_name: profile._json.name,
                        last_name:'',
                        email: email,
                        age: 18,
                        password: '',
                }
                const result = await userModel.create(newUser);
                done(null,result)
            }else{
                //ya existe
                done(null, user)
            }
        } catch (error) {
            return done(null,error)
        }
    }))


//hasta que agregue esto andaba
// passport.use("admin", new LocalStrategy(async (username, password, done) => {
//     try {
//       if (username === "adminCoder@coder.com" && password === "adminCod3r123") {
//         const adminUser = {
//           email: username,
//           role: "admin"
//         };
//         return done(null, adminUser);
//       }
//       return done(null, false);
//     } catch (error) {
//       return done(error);
//     }
//   }));
    // passport.use('admin', new LocalStrategy(async (req, done) => {
    //     const { email, password } = req.body;      
    //     if (email === 'adminCoder@coder.com' && password === 'adminCod3r123') {
    //       const adminUser = {
    //         email,
    //         role: 'admin'
    //       };
    //       return done(null, adminUser);
    //     }      
    //     return done(null, false);
    //   }));
}

export default initializePassport;
