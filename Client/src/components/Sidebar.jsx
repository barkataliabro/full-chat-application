import React, { useEffect, useState } from 'react'
import { IoChatbubbleEllipses } from "react-icons/io5";
import { FaImage, FaUserPlus, FaVideo } from "react-icons/fa";
import { IoLogOutOutline } from "react-icons/io5";
import { NavLink, useNavigate } from 'react-router-dom';
import Avatar from "../components/Avatar"
import { useDispatch, useSelector } from 'react-redux';
import EdituserDetail from './EdituserDetail';
import { FiArrowUpLeft } from "react-icons/fi";
import Search from './Search';
import { logout } from '../redux/userslice';

const Sidebar = () => {
    const user = useSelector((state)=>state.user)
    const [edituseropen, setEdituseropen] = useState(false)
    const [Alluser, setAlluser] = useState([])
    const [opensearchuser, setOpensearchuser] = useState(false)
    const socketconnection = useSelector((state)=> state.user.socketconnection)
    const dispatch = useDispatch()
    const navigate = useNavigate()


    useEffect(()=>{
    if(socketconnection){
        socketconnection.emit("sidebar", user._id)

        socketconnection.on("conversation",(data)=>{
          console.log(data)

       const conversation = data.map((conversationuser,index)=>{
           if(conversationuser.sender._id === conversationuser.receiver._id){
            return{
                ...conversationuser,
                userDetail : conversationuser.sender
            }
           }
           else if(conversationuser.receiver._id !== user._id){
               return{
                ...conversationuser,
                userDetail : conversationuser.receiver
               }
           }else{
                 return{
                    ...conversationuser,
                    userDetail : conversationuser.sender
                 }
           }
       })

          setAlluser(conversation)
        })
    }
    },[socketconnection,user])


    const Handlelogout = () => {
        dispatch(logout())
        navigate('/email')
        localStorage.clear()
    }
  return (
    <div className='w-full h-full grid grid-cols-[48px,1fr]'>
        <div className='bg-slate-100 w-12 h-full rounded-tr-lg rounded-br-lg py-5 text-slate-600 flex flex-col justify-between'>
            <div>
            <NavLink className={({isActive})=> `cursor-pointer w-12 h-12 flex justify-center items-center hover:bg-slate-200 rounded ${isActive && "bg-slate-200"}`} title='Chat'>
            <IoChatbubbleEllipses
            size={25}/>
            </NavLink>

            <div onClick={()=>setOpensearchuser(true)} title='Add user' className='cursor-pointer w-12 h-12 flex justify-center items-center hover:bg-slate-200 rounded'>
             <FaUserPlus size={25}/>
            </div>
            </div>

            <div className='flex flex-col items-center'>
                <button className='mx-auto' title={user?.name} onClick={()=>setEdituseropen(true)}>
                    <Avatar
                    width={40} height={40} name={user.name} imageUrl={user?.profilePic} userId={user._id}/>
                </button>
            <button onClick={Handlelogout} title='Logout' className='cursor-pointer w-12 h-12 flex justify-center items-center hover:bg-slate-200 rounded'>
                <IoLogOutOutline size={25}/>
            </button>
            </div>
        </div>


        <div className='w-full'>
            <div className='h-16 flex items-center'>
            <h2 className='text-2xl font-bold p-4 text-slate-800'>Message</h2>
            </div>
            <div className='bg-slate-200 p-[0.5px]'></div>
            <div className="h-[calc(100vh-65px)] overflow-x-hidden overflow-y-auto scroll">
                {
                    Alluser.length === 0 && (
                        <div className='mt-12'>
                            <div className='flex justify-center items-center text-slate-500 my-4'>
                                <FiArrowUpLeft size={50}/>
                            </div>
                            <p className='text-slate-400 text-lg text-center '>Explore users to start a convarsation with them</p>
                        </div>
                    )
                }

                {
                    Alluser.map((user,index)=>{
                        return(
                            <NavLink to={`/${user?.userDetail?._id}`} key={user._id} className='flex items-center gap-2 p-4 cursor-pointer border hover:bg-slate-200'>
                           <div>
                           <Avatar imageUrl={user.userDetail.profilePic}
                           name={user.userDetail.name} userId={user.userDetail._id}
                           width={35} height={35}/>
                           </div>
                           <div>
                           <h1 className='text-ellipsis line-clamp-1 font-semibold text-sm'>{user.userDetail.name}</h1>
                           <div className=' text-slate-500 text-xs flex items-center gap-1'>
                            <div>
                                {
                                    user.lastmessage.imageUrl && (
                                        <div className='flex items-center gap-1'>
                                            <span><FaImage/></span>
                                            {!user.lastmessage.text && <span>Image</span>}
                                        </div>
                                    )
                                }
                                                                {
                                    user.lastmessage.videoUrl && (
                                        <div className='flex items-center gap-1'>
                                            <span><FaVideo/></span>
                                          {!user.lastmessage.text &&  <span>Video</span>}
                                        </div>
                                    )
                                }

                            </div>
                            <p className='text-ellipsis line-clamp-1'>{user.lastmessage.text}</p>
                           </div>
                           </div>
                           {
                            Boolean(user.unseenmsg) && (
                                <p className='text-xs ml-auto p-1 w-6 h-6 flex justify-center items-center bg-primary text-white rounded-full font-semibold'>{user.unseenmsg}</p>
                            )
                           }
                            </NavLink>
                        )
                    })
                }
            </div>
        </div>

{
    edituseropen && <EdituserDetail onClose={()=>setEdituseropen(false)} user={user}/>
}

{
    opensearchuser && (
        <Search onClose={()=>setOpensearchuser(false)}/>
    )
}


    </div>
  )
}

export default Sidebar