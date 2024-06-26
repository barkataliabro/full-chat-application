import UserModel from "../Models/Usermodel.js";
import bcryptjs from "bcryptjs"
import jwt from "jsonwebtoken"
async function checkPassword(req, res) {
    try {

        const {password,userId} = req.body

        const user = await UserModel.findById(userId)

        const verifypassword = await bcryptjs.compare(password, user.password)
  
        if (!verifypassword) {
            return res.status(400).json({
                message: "Incorrect password",
                error: true
            })
        }

        const token = await jwt.sign({id: user._id,email: user.email, }, process.env.JWT_SECRET, { expiresIn: "1d" })

        return res.cookie("token", token).status(200).json({
            message: "Logged in successfully",
            token: token,
            success: true
        })
        
    } catch (error) {
        return res.status(500).json({
            message: error.message,
            error: true
        })
    }
}


export default checkPassword