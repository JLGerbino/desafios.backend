import  userModel from "../dao/models/user.model.js";

export default class UserController {
async roleChange(req, res) {
    try {
        const userId = req.params.uid;        
        const user = await userModel.findById(userId);
        const userRole = user.role;
        if(userRole === "User"){
            user.role = "premium"
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
}
