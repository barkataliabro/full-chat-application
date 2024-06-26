import express from "express"
import cors from "cors"
import mongoose from "mongoose"
import dotenv from "dotenv"
import userrouter from "./Router/index.js"
import cookieParser from "cookie-parser"
import http from "http"
import { Server } from "socket.io"
import getuserDeatil from "./helper/userdetail.js"
import UserModel from "./Models/Usermodel.js"
import ConversationModel from "./Models/Conversation.js"
import MessageModel from "./Models/Message.js"
import getconversation from "./helper/getconversation.js"



const app = express();
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))
dotenv.config();


app.use(express.json());
app.use(cookieParser());
app.use("/api", userrouter)



const connect = () => {
    mongoose.connect(process.env.MONGO_URL).then(() => {
        console.log("Database connected");
    }).catch((err) => {
        console.log(err);
    })
}


const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        withCredentials: true
    }
});
const Onlineuser = new Set()

io.on("connection", async(socket) => {
    console.log("Connected to socket.io", socket.id);

    const token = socket.handshake.auth.token

    const user = await getuserDeatil(token)
 
        socket.join(user._id.toString())
        Onlineuser.add(user._id.toString())


    io.emit("Onlineuser",Array.from(Onlineuser))

    socket.on("message-page", async(userId) => {
        console.log(userId);
        const userDetail = await UserModel.findById(userId).select("-password")
           
        const payload = {
            _id : userDetail._id,
            name : userDetail.name,
            email : userDetail.email,
            profilePic : userDetail.profilePic,
            onlineuser : Onlineuser.has(userId)
        }

        socket.emit("message-user", payload)
        const getConversationmessage = await ConversationModel.findOne({
            "$or" : [
                {sender : user._id, receiver : userId},
                {sender : userId, receiver : user._id}
            ]
          }).populate("message").sort({updatedAt : -1})
    
               socket.emit("message", getConversationmessage?.message || []) 

      })

    socket.on("new-message", async(data)=>{


      let conversation =  await ConversationModel.findOne({
        "$or" : [
            {sender : data.sender, receiver : data.receiver},
            {sender : data.receiver, receiver : data.sender}
        ]
      })

      if(!conversation){
       const createconversation =  await ConversationModel({
            sender : data.sender,
            receiver : data.receiver
       })
       conversation = await createconversation.save()
      }
        
      const message = new MessageModel({
        text : data.text,
        imageUrl : data.imageUrl,
        videoUrl : data.videoUrl,
        msgbyuserId : data.msgbyuserId,
      })

      const savemessage = await message.save()
      const updateconversation = await ConversationModel.updateOne({_id : conversation._id},{
        "$push" : {
            message : savemessage._id
        }
      })

      const getConversationmessage = await ConversationModel.findOne({
        "$or" : [
            {sender : data.sender, receiver : data.receiver},
            {sender : data.receiver, receiver : data.sender}
        ]
      }).populate("message").sort({updatedAt : -1})


      io.to(data?.sender).emit("message", getConversationmessage?.message || [])
      io.to(data?.receiver).emit("message", getConversationmessage?.message || [])


      /// send conversation
      const conversationsender = await getconversation(data?.sender)
      const conversationreceiver = await getconversation(data?.receiver)

      io.to(data?.sender).emit("conversation", conversationsender)
      io.to(data?.receiver).emit("conversation", conversationreceiver)


    })
     
    //sidebar
    socket.on("sidebar", async(currentuserId)=>{
        const conversation = await getconversation(currentuserId)
       socket.emit("conversation", conversation)    
    })


    socket.on("seen", async(msgbyuserId)=>{
    let conversation = await ConversationModel.findOne({
            "$or" : [
                {sender : user?._id, receiver : msgbyuserId},
                {sender : msgbyuserId, receiver : user?._id}
            ]
        })

        const conversationmessageId =  conversation?.message || []
        const updatemessage = await MessageModel.updateMany(
            {_id : {"$in" : conversationmessageId}, msgbyuserId : msgbyuserId},
            {"$set" : {seen : true}}
        ) 

        /// send conversation
      const conversationsender = await getconversation(user?._id?.toString())
      const conversationreceiver = await getconversation(msgbyuserId)

      io.to(user._id?.toString()).emit("conversation", conversationsender)
      io.to(msgbyuserId).emit("conversation", conversationreceiver)

    })

    socket.on("disconnect", () => {
        Onlineuser.delete(user?._id?.toString())
        console.log("Disconnected from socket.io", socket.id);
    })
})


server.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
    connect();
})
