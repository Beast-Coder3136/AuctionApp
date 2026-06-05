import jwt from "jsonwebtoken";
 
export const verifyJWT = async(req,res,next)=>{
  try{
  const token = req.cookies.token;
  if(!token){
    return res.status(401).json({
      message : "User is not authenticated",
      success : false,
      authorized : false 
    })
  }
  const decode = jwt.verify(token,process.env.SECRET_KEY);
  if(!decode){
    return res.status().json({
      message : "Token is not verified",
      success : false ,
      authorized : false 
    })
  }
  req.user = decode;
  // console.log(req.user)
  next(); 
  }
  catch(err){
    console.log(err);
  }
}

export const verifyRole = (role)=>{
  return (req,res,next)=>{
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
        authorized : false 
      });
    }

    if (role === req.user.role) {
      return next();
    }

    return res.status(403).json({
      success: false,
      message: "Role mismatch",
      authorized : false
    });
  }
}

