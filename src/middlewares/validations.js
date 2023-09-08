export const userAccess = (req,res,next)=>{
    if(req.session.user && req.session.user.role === "User"){
       next();
    } else {
        res.status(400).json({status:"error", message:"solo los Users pueden visitar esta ruta"});
    }
}

export const adminPremiumAccess = (req,res,next)=>{
    if(req.session.user && req.session.user.role === "admin" || req.session.user.role === "premium"){
       next();
    } else {
        res.status(400).json({status:"error", message:"los users no pueden visitar esta ruta"});
    }    
}

export const adminAccess = (req,res,next)=>{
    if(req.session.user && req.session.user.role === "admin"){
       next();
    } else {
        res.status(400).json({status:"error", message:"solo los Admin pueden visitar esta ruta"});
    }    
}

export const premiumAccess = (req,res,next)=>{
    if(req.session.user && req.session.user.role === "premium"){
       next();
    } else {
        res.status(400).json({status:"error", message:"solo los usuarios premium pueden visitar esta ruta"});
    }    
}

export const userPremiumAccess = (req,res,next)=>{
    if(req.session.user && req.session.user.role === "User" || req.session.user.role === "premium"){
       next();
    } else {
        res.status(400).json({status:"error", message:"solo los users pueden visitar esta ruta"});
    }    
}

export const checkAuthenticated = (req, res,next) => {
    if (!req.user) {
        next;
    }else{
        return res.json({status:"error", message:"Necesita estar autenticado"})
    }       
}