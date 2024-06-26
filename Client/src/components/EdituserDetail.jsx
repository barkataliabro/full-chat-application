import React, { useEffect, useRef, useState } from 'react'
import Avatar from './Avatar'
import upload from "../Helper/upload.js"
import Divider from './Divider.jsx'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useDispatch } from 'react-redux'
import { setUser } from '../redux/userslice.js'

const EdituserDetail = ({onClose,user}) => {
    const uploadphotoref = useRef()
    const dispatch = useDispatch()
    const [data,setData] = useState({
      name : user.name,
      profilePic : user.profilePic
    })


    useEffect(()=>{
        setData((prev)=>{
            return {
                ...prev,
                ...user
            }
        })
    },[user])
const HandelChange = (e) => {
    const {name,value} = e.target


    setData((prev)=>{
        return {...prev,[name]:value}
    })
}


const Handeluploadphoto = async (e) => {
    const file = e.target.files[0]

    const uploadPhoto = await upload(file)
    console.log(uploadPhoto, "this is uploadPhoto")

    setData((prev)=>{
        return{
            ...prev,
          profilePic: uploadPhoto?.url
        }
    })
}

const Handelopenupload = (e) => {
  e.preventDefault()
  e.stopPropagation()
  uploadphotoref.current.click()
}


    const HandelSubmit = async (e) => {
         e.preventDefault()
         e.stopPropagation()
         try {
            const url = "https://localhost:500/api/updateuserdetail"

            const response = await axios({
                method : "post",
                url : url,
                data: data,
                withCredentials : true
            })
            if(response.data.success){
                dispatch(setUser(response.data.data))
                onClose()
            }
            toast.success(response.data.message)
         } catch (error) {
           console.log(error)
         }
    }

    
  return (
    <div className='fixed top-0 bottom-0 left-0 right-0 bg-gray-700 bg-opacity-50 flex justify-center items-center z-10'>
        <div className='bg-white rounded p-4 py-6 m-1 w-full max-w-sm'>
        <h2 className='font-semibold'>Profile Detail</h2>
        <p className='text-sm'>Edit user Detail</p>

        <form className='grid gap-3 mt-3' onSubmit={HandelSubmit}>
            <div className='flex flex-col gap-1'>
                <label htmlFor="name">Name:</label>
                <input type="text"
                name="name"
                id="name"
                value={data.name}
                onChange={HandelChange}
                className='w-full py-1 px-2 focus:outline-primary border'
                />
            </div>
            <div>
                Photo
                <div className='my-1 flex items-center gap-3'>
                 <Avatar width={40} height={40} name={data.name} imageUrl={data.profilePic}/>
                 <label htmlFor="profilePic">
                 <button className='font-semibold' onClick={Handelopenupload}>Change Photo</button>
                 <input type="file" className='hidden' id='profilePic' onChange={Handeluploadphoto} ref={uploadphotoref}/>
                 </label>
                </div>
            </div>

            <Divider/>

            <div className='flex gap-3 ml-auto'>
            <button onClick={onClose} className='bg-white text-primary font-semibold py-1 px-4 rounded border-primary border hover:bg-primary hover:text-white'>cancel</button>
            <button onClick={HandelSubmit} className='bg-primary text-white font-semibold py-1 px-4 rounded border-primary border hover:bg-secondary'>Save</button>
            </div>
        </form>
        </div>
        </div>
  )
}

export default EdituserDetail