import UserModel from "../Models/Usermodel.js"
async function search(req, res) {
    try {
        const {search} = req.body
       const query = new RegExp(search, 'i', 'g')
       const users = await UserModel.find({
           $or: [
               {name: query},
               {email: query}
           ]
       }).select("-password")


       return res.status(200).json({
           message: "All User",
           data: users,
           success: true
       })
    } catch (error) {
        return res.status(500).json({
            message: error.message,
            error: true
        })
    }
}


export default search