import mongoose from "mongoose";


const ConversationSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true

    },
    receiver: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true
    },
    message: [
        {
            type: mongoose.Schema.ObjectId,
            ref: "Message"
        }
    ]
},
    { timestamps: true }
)


const Conversation = mongoose.model("Conversation", ConversationSchema);
export default Conversation