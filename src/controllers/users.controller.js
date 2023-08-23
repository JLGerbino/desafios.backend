import  userModel from "../dao/models/user.model.js";
import { envLogger } from "../middlewares/logger.js";

const logger = envLogger();

export default class UserController {
    async roleChange(req, res){
        try {
            const userId = req.params.uid;        
            const user = await userModel.findById(userId);
            const userRole = user.role;
            const userStatus = user.status
            if(userRole === "User"){
                if(userStatus === "completo"){
                user.role = "premium"} else{
                    return res.json({status:"error", message:"Al usuario le falta completar datos de su perfil para poder hacer el cambio de role"});
                }
            } else if(userRole === "premium"){
                user.role = "User"
            } else {
                return res.json({status:"error", message:"no es posible cambiar el role del usuario"});
            }
            await userModel.updateOne({_id:user._id},user);
            res.send({status:"success", message:"rol modificado"});
        } catch (error) {
            console.log(error.message);
            res.json({status:"error", message:"hubo un error al cambiar el rol del usuario"})
        }    
      }

async updateUserDocument(req, res){
    try {
        const userId = req.params.uid
        const user = await userModel.findById(userId);
        const identificacion = req.files["identificacion"]?.[0] || null;
        const domicilio = req.files["domicilio"]?.[0] || null;
        const estadoDeCuenta = req.files["estadoDeCuenta"]?.[0] || null;
        const docs = [];
        if (identificacion) {
            docs.push({name: "identificacion", reference:identificacion.filename})            
        }
        if (domicilio) {
            docs.push({name: "domicilio", reference:domicilio.filename})            
        }
        if (estadoDeCuenta) {
            docs.push({name: "estadoDeCuenta", reference:estadoDeCuenta.filename})            
        }
        if (docs.length === 3){
            user.status = "completo"
        }else{
            user.status = "incompleto"
        }
        user.documents = docs
        const userUpdate = await userModel.findByIdAndUpdate(user._id, user)
        res.json({status:"success", message: "Documentos actualizados"})
    } catch (error) {
        logger.error(error.message);
        res.json({status: "error", message: "Hubo un error en la carga de los archivos"})
        
    }

}
}
