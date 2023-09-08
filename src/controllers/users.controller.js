import productoModel from "../dao/models/producto.model.js";
import userModel from "../dao/models/user.model.js";
import { envLogger } from "../middlewares/logger.js";
import { GetUserDto } from "../dao/dto/user.dto.js";
import { transporter } from "../config/gmail.js";

const logger = envLogger();

export default class UserController {
  async getUsers(req, res) {   
    try {
      const users = await userModel.find();
      const usersDto = users.map(user => new GetUserDto(user));  
      res.status(200).json(usersDto);
    } catch (error) {
      res.status(500).json({ message: "Error al obtener los usuarios"});
    }     
  } 
  
  async roleChange(req, res) {
    try {
      const userId = req.params.uid;
      const user = await userModel.findById(userId);
      const userRole = user.role;
      const userStatus = user.status;
      if (userRole === "User") {
        if (userStatus === "completo") {
          user.role = "premium";
        } else {
          return res.json({
            status: "error",
            message:
              "Al usuario le falta completar datos de su perfil para poder hacer el cambio de role",
          });
        }
      } else if (userRole === "premium") {
        user.role = "User";
      } else {
        return res.json({
          status: "error",
          message: "no es posible cambiar el role del usuario",
        });
      }
      await userModel.updateOne({ _id: user._id }, user);
      res.send({ status: "success", message: "rol modificado" });
    } catch (error) {
      console.log(error.message);
      res.json({
        status: "error",
        message: "hubo un error al cambiar el rol del usuario",
      });
    }
  }
  
  async updateUserDocument(req, res) {
    try {
      const userId = req.params.uid;
      const user = await userModel.findById(userId);
      const identificacion = req.files["identificacion"]?.[0] || null;
      const domicilio = req.files["domicilio"]?.[0] || null;
      const estadoDeCuenta = req.files["estadoDeCuenta"]?.[0] || null;
      const docs = [];
      if (identificacion) {
        docs.push({
          name: "identificacion",
          reference: identificacion.filename,
        });
      }
      if (domicilio) {        
        docs.push({
          name: "domicilio",
          reference: domicilio.filename });
      }
      if (estadoDeCuenta) {
        docs.push({
          name: "estadoDeCuenta",
          reference: estadoDeCuenta.filename,
        });
      }
      if (docs.length === 3) {
        user.status = "completo";
      } else {
        user.status = "incompleto";
      }
      user.documents = docs;
      const userUpdate = await userModel.findByIdAndUpdate(user._id, user);
      res.json({ status: "success", message: "Documentos actualizados" });
    } catch (error) {
      logger.error(error.message);
      res.json({
        status: "error",
        message: "Hubo un error en la carga de los archivos",
      });
    };
  };
  
  async deleteUserById (req, res) {
    try {
      const userId = req.params.uid;
      const userDelete = await userModel.findByIdAndDelete(userId);
      res.json({ status: "success", message: "Usuario eliminado" });      
    } catch (error) {
      console.error("Error al eliminar el usuario:", error);
      res.status(500).send("Error al eliminar el usuario.");
    }
  }

  async deleteUsers (req, res) {
    try {
      const users = await userModel.find();
      const ahora = Date.now()
      const tiempoLimite = 30*60*1000;//1/2 hora //60*60*1000*48//2 dias
      users.forEach(async (user) => {
        if (user.last_connection){//ver este if
        const last_connection = user.last_connection
        const diferencia = ahora - last_connection
        const email = user.email                
        if (diferencia > tiempoLimite ) {          
          const contenido = await transporter.sendMail({
            from: "Ecommerce Backend",
            to: email,
            subject: "Usuario eliminado por falta de conexion",
          }); 
          await userModel.findByIdAndDelete(user._id);         
        }}
      });
      res.send("Usuarios eliminados por falta de conexion.");
    } catch (error) {
      console.error("Error al eliminar usuarios:", error);
      res.status(500).send("Error al eliminar usuarios.");
    }
  }
}
