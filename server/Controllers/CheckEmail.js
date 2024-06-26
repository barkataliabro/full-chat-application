import UserModel from "../Models/Usermodel.js"


async function checkEmail(req, res) {
    try {

        const {email} = req.body

        const checkemail = await UserModel.findOne({email}).select("-password")

        if (!checkemail) {
            return res.status(400).json({
                message: "Email not found",
                error: true
            })
        }
        
        return res.status(200).json({
            message: "Email verified",
            data: checkemail,
            success: true
        })

    } catch (error) {
        return res.status.json({
            message: error.message,
            error: true
        })
    }
}

export default checkEmail
