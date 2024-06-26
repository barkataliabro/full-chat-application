import React from 'react'
import { FaUserCircle } from 'react-icons/fa'
import { useSelector } from 'react-redux'

const Avatar = ({userId,name,imageUrl,width,height}) => {
 
    const onlineuser = useSelector((state)=> state.user.onlineuser)

    let Avatarname = ""

    if(name){
         const splitname = name.split(" ")


         if(splitname.length > 1){
            Avatarname = splitname[0][0] + splitname[1][0]
         }else{
            Avatarname = splitname[0][0]
         }
    }
    

    const bgcolor = [
        'bg-slate-800',
        'bg-teal-700',
        'bg-green-600',
        'bg-red-500',
        'bg-yellow-400',
        'bg-pink-500',
        'bg-purple-500',
        'bg-indigo-500',
        'bg-blue-500',
        'bg-gray-500',
    ]

    const randomNumber = Math.floor(Math.random() * bgcolor.length)
    console.log(randomNumber)

    const isonline = onlineuser.includes(userId)

  return (
    <div className={`text-slate-800 rounded-full font-bold overflow-hidden relative`}  style={{width: width+"px", height: height+"px"}}>
{
    imageUrl ? 
    <img
    src={imageUrl}
    alt={name}
    width={width}
    height={height}
    className='overflow-hidden rounded-full'
     />
    :

    name ? 
    <div style={{width: width+"px", height: height+"px"}} className={`overflow-hidden rounded-full flex justify-center items-center  ${bgcolor[randomNumber]}`}>
{Avatarname}
    </div>
    :

    <FaUserCircle size={width}/>

    
}


{
    isonline && (
    <div className='bg-green-500 p-1  absolute bottom-2 -right-0 z-10 rounded-full'></div>
    )
}
    </div>
  )
}

export default Avatar