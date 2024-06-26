import getuserDeatil from "../helper/userdetail.js"
import UserModel from "../Models/Usermodel.js"


async function updateuserdetail(req, res) {
    try {
    
        const token = req.cookies.token

        const user = await getuserDeatil(token)

        const {name, email, profilePic} = req.body


        const updateUser = await UserModel.updateOne({_id: user._id}, {
          name,
          email,
          profilePic
        })

        const userinfo = await UserModel.findById(user._id)
        return res.status(200).json({
            message: "User details updated successfully",
            data: userinfo,
            success: true
        })

    } catch (error) {
        return res.status(500).json({
            message: error.message,
            error: true
        })
    }
}


export default updateuserdetail