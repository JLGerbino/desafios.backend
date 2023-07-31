import  userModel from "../dao/models/user.model.js";

export default class UserController {
async roleChange(req, res) {
    try {
        const userId = req.params.uid;
        //verificar si el usuario existe en la base de datos
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
    // const id = req.params.pid;    
    // const producto = await productService.getProductsByIdRep(id); //productsDao.getProductsById(id) //productManagerDB.getProductsById(id) // productoModel.find({_id:id});
    // res.send(producto);
  }
}
