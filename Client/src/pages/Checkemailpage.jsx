import React from 'react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import axios from "axios"
import { FaUserCircle } from "react-icons/fa";



const Checkemailpage = () => {
  const [data, setData] = useState({
    email: ''
      })
  
    const navigate = useNavigate()
  
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
      
  
      const url = "http://localhost:5000/api/checkemail"
  
      try {
        const response = await axios.post(url,data,{withCredentials:true})
        toast.success(response.data.message)
  
        if(response.data.success){
           setData({
            email: "",
           })
           navigate('/password',{
            state: response.data.data
           })
        }
      } catch (error) {
         toast.error(error.response.data.message)
      }
  
      console.log(data)
  
    }
  
  





  return (
    <div className='mt-5'>
      <div className='bg-white w-full max-w-md rounded overflow-hidden p-4 mx-auto'>

        <div className='flex justify-center items-center mb-2'>
        <FaUserCircle size={80}/>
        </div>
        <h3>Welcome to the Chat App</h3>

        <form className='grid gap-4 mt-3' onSubmit={HandelSubmit}>

          <div className='flex flex-col gap-1'>
            <label htmlFor="email">email :</label>
            <input type="email" name="email" id="email" placeholder='Enter your email' className='bg-slate-100 px-2 py-1
             focus:outline-primary'
             required
             value={data.email}
             onChange={Handelchange}
             />
          </div>

         <button className='bg-primary text-white px-4 py-2 rounded mt-2 font-bold
          text-lg leading-relaxed hover:bg-secondary tracking-wide'>
          Let's Go</button>

        </form>
        <p className='my-4 text-center'>New User ? <Link to={"/register"} className='hover:text-primary font-semibold'>Register</Link></p>
      </div>
    </div>
  )
}

export default Checkemailpage