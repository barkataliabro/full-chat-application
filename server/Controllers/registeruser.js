import UserModel from "../Models/Usermodel.js";
import bcryptjs from "bcryptjs";

async function registerUser(req, res) {
    try {
        const { name, email, password, profilePic } = req.body

        const checkemail = await UserModel.findOne({ email })

        if (checkemail) {
            return res.status(400).json({
                message: "Email already exists",
                error: true
            })
        }

       const salt = await bcryptjs.genSalt(10)
       const hashedPassword = await bcryptjs.hash(password, salt)

       const newUser = new UserModel({
        name,
        email,
        password: hashedPassword,
        profilePic
       })

       await newUser.save()

       return res.status(200).json({
        message: "User created successfully",
        data: newUser,
        success: true
       })   


    } catch (error) {
        return res.status(500).json({
            message: error.message,
            error: true
        })
    }
}

export default registerUser
