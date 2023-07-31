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
        res.status(400).json({status:"error", message:"solo los premium pueden visitar esta ruta"});
    }    
}

// export const checkRole = (roles) => {
//     return (req,res,next)=>{
//         if (!req.user) {
//             return res.json({status:"error", message:"Necesitas estar autenticado"});
//         }
//         if (!roles.includes(req.user.role)) {
//             return res.json({status:"error", message:"No estas autorizado"});
//         }
//         next();
//     }
// }