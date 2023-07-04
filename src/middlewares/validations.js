export const userAccess = (req,res,next)=>{
    if(req.session.user && req.session.user.role === "User"){
       next();
    } else {
        res.status(400).json({status:"error", message:"solo los Users pueden visitar esta ruta"});
    }
}

export const adminAccess = (req,res,next)=>{
    if(req.session.user && req.session.user.role === "admin"){
       next();
    } else {
        res.status(400).json({status:"error", message:"solo los Admin pueden visitar esta ruta"});
    }
}