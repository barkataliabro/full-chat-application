import ConversationModel from "../Models/Conversation.js";
const getconversation = async(currentuserId)=>{
    if(currentuserId){
        const currentuserConversation = await ConversationModel.find({
            "$or" : [
                {sender : currentuserId},
                {receiver : currentuserId}
            ]
        }).sort({updatedAt : -1}).populate("message").populate("sender").populate("receiver")

        const conversation = currentuserConversation.map((conv)=>{
            const unseenmessage = conv?.message?.reduce((prev,cur)=> {
                const msgbyuserId = cur?.msgbyuserId?.toString()

                if(msgbyuserId !== currentuserId){
                    return prev + (cur?.seen ? 0 : 1)
                }else{
                    return prev
                }
            },0)
            return{
                _id : conv._id,
                sender : conv.sender,
                receiver : conv.receiver,
                unseenmsg : unseenmessage,
                lastmessage : conv.message[conv.message.length - 1],
            }
        })
        return conversation
    }else{
        return []
    }

}

export default getconversation