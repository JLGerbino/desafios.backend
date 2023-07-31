import nodemailer from "nodemailer";
import { config } from "./config.js";


const adminEmail = config.gmail.adminAccount;
const adminPass = config.gmail.adminPass;


const transporter = nodemailer.createTransport({
    host:"smtp.gmail.com",
    port:587,
    auth:{
        user: adminEmail,
        pass: adminPass
    },
    secure: false,
    tls:{
        rejectUnauthorized: false
    }
})


//agregue session
// export const sendRecoveryPass = async (userEmail, token) => {
// //export const sendRecoveryPass = async () => {
//     const link = `http://localhost:8080/resetPassword?code=${token}`; //"2322" Incluir el código aleatorio en el enlace
//     await transporter.sendMail({
//       from: "ecomerce",
//       to: userEmail,//"joselgerbino@gmail.com",
//       subject: "Restablecer contraseña",
//       html: `
//       <div>
//         <h2>Has solicitado un cambio de contraseña.</h2>
//         <p>Da clic en el siguiente enlace para restablecer la contraseña</p>
//         <a href="${link}">
//           <button> Restablecer contraseña </button>
//         </a>        
//       </div>
//       `
//     });
//   };//

  // //Funcion para el envio de correo electronico para recuperar la contraseña jwt
export const sendRecoveryPass = async(userEmail,token)=>{
    const link = `http://localhost:8080/reset-password?token=${token}`;
    await transporter.sendMail({
        from:"ecomerce",//options.gmail.emailAdmin,
        to:userEmail,
        subject:"Restablecer contraseña",
        html: `
        <div>
        <h2>Has solicitado un cambio de contraseña.</h2>
        <p>Da clic en el siguiente enlace para restableces la contraseña</p>
        <a href="${link}">
        <button> Restablecer contraseña </button>
        </a>        
        </div>
        `
    })
};//

export { transporter }



