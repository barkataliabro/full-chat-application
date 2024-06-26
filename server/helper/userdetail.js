import UserModel from "../Models/Usermodel.js";
import jwt from "jsonwebtoken"


const getuserDeatil = (token)=>{

    if (!token) {
        return {
            message: "session expired",
            logout: true
        }
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    const user = UserModel.findById(decoded.id).select("-password")

    return user
    
}


export default getuserDeatil