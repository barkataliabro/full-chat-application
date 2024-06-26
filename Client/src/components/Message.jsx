import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link, useParams } from 'react-router-dom'
import Avatar from './Avatar'
import { HiDotsVertical } from "react-icons/hi";
import { FaAngleLeft } from "react-icons/fa6";
import { FaPlus } from "react-icons/fa";
import { IoImage } from "react-icons/io5";
import { FaVideo } from "react-icons/fa6";
import upload from '../Helper/upload';
import { IoIosClose } from "react-icons/io";
import Loading from "./Loading"
import { MdOutlineSend } from "react-icons/md";
import moment from "moment"




const Message = () => {
  const params = useParams()
  const socketconnection = useSelector((state)=> state.user.socketconnection)
  const user = useSelector((state)=> state.user)
  const [imagevideoshow, setImagevideoshow] = useState(false)
  const [loading, setLoading] = useState(false)
  const [Allmessages, setAllmessages] = useState([])
  const currentmessage = useRef()
  const [message,setmessage] = useState({
    text : "",
    imageUrl : "",
    videoUrl : ""
  })
  const [datauser, setDatauser] = useState({
    name : "",
    profilePic : "",
    email : "",
    onlineuser : false,
    _id : ""
  })


  const Handeluploadimagevideo = () => {
    setImagevideoshow(prev => !prev)
  }

  const Handeluploadimage = async(e) => {
    const file = e.target.files[0]
    setLoading(true)
    const uploadphoto = await upload(file)
    setLoading(false)
    setImagevideoshow(false)

    setmessage((prev)=>{
      return{
        ...prev,
        imageUrl : uploadphoto?.url
      }
    })
  }

  const Handelclearuploadimage = () => {
    setmessage((prev)=>{
      return{
        ...prev,
        imageUrl : ""
      }
    })
  }


  const Handelclearuploadvideo = () => {
    setmessage((prev)=>{
      return{
        ...prev,
        videoUrl : ""
      }
    })
  }

  const Handeluploadvideo = async(e) => {
    const file = e.target.files[0]
    setLoading(true)
    const uploadphoto = await upload(file)
    setLoading(false)
    setImagevideoshow(false)

    setmessage((prev)=>{
      return{
        ...prev,
        videoUrl : uploadphoto?.url
      }
    })
    

  }

  useEffect(() => {
     if(socketconnection){
      socketconnection.emit("message-page", params.userId)
      socketconnection.emit("seen", params.userId)


      socketconnection.on("message-user", (data) => {
        setDatauser(data)
      })


      socketconnection.on("message", (data) => {
        console.log(data)

        setAllmessages(data)
      })
     }
  }, [socketconnection,params.userId,user])

  const HandleTextChange = (e)=>{
   const {name,value} = e.target

   setmessage(prev=>{
    return{
      ...prev,
      text : value
    }
   })
  }

  const HandleSendMessage = (e) => {
   e.preventDefault()

  if(message.text || message.imageUrl || message.videoUrl){
    if(socketconnection){
      socketconnection.emit("new-message", {
        sender: user._id,
        receiver: params.userId,
        text : message.text,
        imageUrl : message.imageUrl,
        videoUrl : message.videoUrl,
        msgbyuserId : user._id
      })
     setmessage({
      text : "",
      imageUrl : "",
      videoUrl : ""
     })
    }
  }
  }


  useEffect(()=>{

    if(currentmessage.current){
      currentmessage.current.scrollIntoView({behavior : "smooth", block : "end"})
    }

  },[Allmessages])



  return (
    <div style={{backgroundImage: "url(/background.jpg)"}} className='bg-no-repeat bg-cover'>
      <header className='sticky bottom-0 bg-white h-16 flex justify-between items-center px-4'>
         <div className='flex items-center gap-3'>
          <Link to={"/"} className='lg:hidden'>
           <FaAngleLeft size={25}/>
          </Link>
          <div className='mt-2'>
            <Avatar
            width={40}
            height={40}
            imageUrl={datauser.profilePic}
            name={datauser.name}
            userId={datauser._id}
            />
          </div>
          <div>
            <h1 className='font-semibold text-lg my-0'>{datauser.name}</h1>
            <p className='-my-2 text-sm'>{datauser.onlineuser ? <span className='text-primary'>Online</span> : <span className='text-slate-400'>Offline</span>}</p>
          </div>
         </div>
         <div>
          <button className='cursor-pointer hover:text-primary'>
          <HiDotsVertical/>
          </button>
         </div>
      </header>


      <section className='h-[calc(100vh-128px)] overflow-x-hidden overflow-y-scroll scroll relative bg-slate-200 bg-opacity-20'>
        {
          message.imageUrl && (
            <div className='w-full h-full sticky bottom-0  bg-slate-700 bg-opacity-30 flex justify-center items-center'>
              <div className='w-fit p-2 absolute top-0 right-0 cursor-pointer hover:text-red-500' onClick={Handelclearuploadimage}>
               <IoIosClose size={30}/>
              </div>
            <div className='bg-white p-3'>
             <img src={message.imageUrl} className='w-full h-full max-w-sm'/>
            </div>
             </div>
          )
        }
{
          message.videoUrl && (
            <div className='w-full h-full sticky bottom-0 bg-slate-700 bg-opacity-30 flex justify-center items-center'>
              <div className='w-fit p-2 absolute top-0 right-0 cursor-pointer hover:text-red-500' onClick={Handelclearuploadvideo}>
               <IoIosClose size={30}/>
              </div>
            <div className='bg-white p-3'>
              <video src={message?.videoUrl} className='aspect-video w-full h-full max-w-sm' controls autoPlay muted>
                 <source  src={message?.videoUrl} type='video/mp4'/>
                 <source  src={message?.videoUrl} type='video/webm'/>
                </video>
            </div>
             </div>
          )
        }


        {
          loading && (
            <div className='w-full h-full sticky bottom-0 bg-slate-700 bg-opacity-30 flex justify-center items-center'>
                <Loading/>
            </div>
          )
        }


        {/* show all messages */}

        <div className='flex flex-col gap-2 py-2 mx-2'  ref={currentmessage}>
          {Allmessages.map((msg,index)=>{
            return(
              <div className={` rounded p-1 py-1 my-2 w-fit max-w-[280px] md:max-w-sm lg:max-w-md ${user._id === msg.msgbyuserId ? "ml-auto bg-teal-100" : "bg-white"}`}>
                <div className='w-full'>
                  {
                    msg.imageUrl && (
                      <img src={msg.imageUrl} className='w-full h-full object-scale-down' />
                    )
                  }
                </div>
                <div className='w-full'>
                  {
                    msg.videoUrl && (
                      <video src={msg.videoUrl} className='w-full h-full object-scale-down' controls >
                        <source  src={msg.videoUrl} type='video/mp4'/>
                        <source  src={msg.videoUrl} type='video/webm'/>
                      </video>
                    )
                  }
                </div>
                <p className='px-2'>{msg.text}</p>
                <p className='text-xs ml-auto w-fit'>{moment(msg.createdAt).format("hh:mm")}</p>
              </div>
            )
          })}
        </div>
      </section>

      {/* ////////send message here//////// */}
      <section className='h-16 bg-white flex items-center px-4'>
       <div className='relative'>
        <button onClick={Handeluploadimagevideo} className='flex justify-center items-center w-14 h-14 rounded-full hover:bg-primary hover:text-white'>
         <FaPlus size={20} />
        </button>

        {/*video & image*/}
         {
          imagevideoshow &&(
            <div className='bg-white shadow rounded absolute bottom-12 w-36 p-2'>
            <form>
              <label htmlFor='uploadimage' className='flex items-center gap-2 p-2 hover:bg-slate-200 cursor-pointer'>
                <div className='text-primary'>
                   <IoImage/>
                </div>
                <p>Image</p>
              </label>
              <label htmlFor='uploadvideo'  className='flex items-center gap-2 p-2 hover:bg-slate-200 cursor-pointer'>
                <div className='text-purple-500'>
                   <FaVideo/>
                </div>
                <p>video</p>
                </label>
                <input type="file" id='uploadimage' onChange={Handeluploadimage} className='hidden'/>
                <input type="file" id="uploadvideo" onChange={Handeluploadvideo} className='hidden'/>
            </form>
          </div>
          )
         }


       </div>

       {/* input box */}
       <form className='w-full h-full flex gap-2' onSubmit={HandleSendMessage}>
  <input
    type="text"
    placeholder='Type here message....'
    className='py-1 px-4 outline-none w-full h-full'
    value={message.text}
    onChange={HandleTextChange}
    name='text'
  />
  <button className='text-primary hover:text-secondary cursor-pointer'>
    <MdOutlineSend size={25} /> 
  </button>
</form>
      </section>
      </div>
  )
}

export default Message