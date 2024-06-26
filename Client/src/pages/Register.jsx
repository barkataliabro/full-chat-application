import React, { useState } from 'react'
import {IoClose} from 'react-icons/io5'
import { Link, useNavigate } from 'react-router-dom'
import upload from '../Helper/upload'
import toast from 'react-hot-toast'
import axios from "axios"
const Register = () => {
  const [data, setData] = useState({
  name: '',
  email: '',
  password: '',
  profilePic: ''
  })

  const [photo, setPhoto] = useState("")
  const navigate = useNavigate()

  const Handelphoto = async(e) => {
    const file = e.target.files[0]

    const uploadPhoto = await upload(file)
    console.log(uploadPhoto, "this is uploadPhoto")

    setData((prev)=>{
        return{
            ...prev,
          profilePic: uploadPhoto?.url
        }
    })



    setPhoto(file)
  }

  const Handelchange = (e) => {
    const {name, value} = e.target


    setData((prev)=>{
      return {...prev, [name]: value}
    })
  }

  const HandelCLear = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setPhoto(null)
  }

  const HandelSubmit = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    

    const url = "https://localhost:5000/api/register"

    try {
      const response = await axios.post(url,data)
      toast.success(response.data.message)

      if(response.data.success){
         setData({
          name: "",
          email: "",
          password: "",
          profilePic: ""
         })
         navigate('/email')
      }
    } catch (error) {
       toast.error(error.response.data.message)
    }

    console.log(data)

  }


  return (
    <div className='mt-5'>
      <div className='bg-white w-full max-w-md rounded overflow-hidden p-4 mx-auto'>
        <h3>Welcome to the Chat App</h3>

        <form className='grid gap-4 mt-5' onSubmit={HandelSubmit}>
          <div className='flex flex-col gap-1'>
            <label htmlFor="name">Name :</label>
            <input type="text" name="name" id="name" placeholder='Enter your name' className='bg-slate-100 px-2 py-1
             focus:outline-primary'
             required
             value={data.name}
             onChange={Handelchange}
             />
          </div>

          <div className='flex flex-col gap-1'>
            <label htmlFor="email">email :</label>
            <input type="email" name="email" id="email" placeholder='Enter your email' className='bg-slate-100 px-2 py-1
             focus:outline-primary'
             required
             value={data.email}
             onChange={Handelchange}
             />
          </div>

          <div className='flex flex-col gap-1'>
            <label htmlFor="password">password :</label>
            <input type="password" name="password" id="password" placeholder='Enter your password' className='bg-slate-100 px-2 py-1
             focus:outline-primary'
             required
             value={data.password}
             onChange={Handelchange}
             />
          </div>

          <div className='flex flex-col gap-1'>
            <label htmlFor="Photo">Photo :
              <div className='h-14 bg-slate-200 flex justify-center items-center  rounded border hover:border-primary'>
                <p className='text-sm max-w-[300px] text-ellipsis line-clamp-1'>
                  {photo ? photo?.name : 'Upload Photo'}
                </p>
                {
                  photo?.name && 
                <button className='ml-2 text-lg hover:text-red-600' onClick={HandelCLear}>
                  <IoClose/>
                </button>
                }
              </div>
            </label>
            <input type="file" name="Photo" id="Photo" placeholder='Enter your Photo' className='bg-slate-100 px-2 py-1
             focus:outline-primary hidden '
             onChange={Handelphoto}
             />
          </div>


         <button className='bg-primary text-white px-4 py-2 rounded mt-2 font-bold
          text-lg leading-relaxed hover:bg-secondary tracking-wide'>
          Register</button>

        </form>
        <p className='my-4 text-center'>Already have an account ? <Link to={"/email"} className='hover:text-primary font-semibold'>Login</Link></p>
      </div>
    </div>
  )
}

export default Register