import getuserDeatil from "../helper/userdetail.js"


 async function userDeatil(req, res) {
    try {
        const token = req.cookies.token

        const user = await getuserDeatil(token)

        return res.status(200).json({
            message: "User details fetched successfully",
            data: user,
            success: true
        })
    } catch (error) {
        return res.status(500).json({
            message: error.message,
            error: true
        })
    }
 }


 export default userDeatil