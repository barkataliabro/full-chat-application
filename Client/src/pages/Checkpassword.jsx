import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import axios from "axios"
import Avatar from '../components/Avatar'
import { setUser } from "../redux/userslice.js"
import { useDispatch } from 'react-redux'


const  Checkpassword = () => {

  const dispatch = useDispatch()
  const [data, setData] = useState({
    password: ''
      })
  
    const navigate = useNavigate()
    const location = useLocation()

    console.log(location.state)

    useEffect(()=>{
      if(!location?.state?.name){
        navigate('/email')
      }
    },[])
    const Handelchange = (e) => {
      const {name, value} = e.target
  
  
      setData((prev)=>{
        return {...prev, [name]: value}
      })
    }
  
  
    const HandelSubmit = async (e) => {
      e.preventDefault()
      e.stopPropagation()
      
  
      const url = "http://localhost:5000/api/login"

      try {
        const response = await axios({
          method : "post",
          url : url,
          data : {
            userId : location?.state?._id,
            password : data.password
          },
          withCredentials : true
        })        
        console.log(response)
        toast.success(response.data.message)
  
        if(response.data.success){
          dispatch(setUser(response.data.token))
          localStorage.setItem("token", response.data.token)
           setData({
            password: "",
           })
           navigate('/')
        }
      } catch (error) {
         toast.error(error.response.data.message)
      }
  
    }
  
  





  return (
    <div className='mt-5'>
      <div className='bg-white w-full max-w-md rounded overflow-hidden p-4 mx-auto'>

        <div className='flex justify-center items-center flex-col mb-2'>
        {/* <FaUserCircle size={80}/> */}
        <Avatar width={70} height={70} name={location.state.name} imageUrl={location.state.profilePic}/>
        <h2 className='font-semibold text-lg mt-1'>{location.state.name}</h2>
        </div>
        <h3>Welcome to the Chat App</h3>

        <form className='grid gap-4 mt-3' onSubmit={HandelSubmit}>

          <div className='flex flex-col gap-1'>
            <label htmlFor="password">password:</label>
            <input type="password" name="password" id="password" placeholder='Enter your password' className='bg-slate-100 px-2 py-1
             focus:outline-primary'
             required
             value={data.password}
             onChange={Handelchange}
             />
          </div>

         <button className='bg-primary text-white px-4 py-2 rounded mt-2 font-bold
          text-lg leading-relaxed hover:bg-secondary tracking-wide'>
          Login</button>

        </form>
        <p className='my-4 text-center'><Link to={"/forgot-password"} className='hover:text-primary font-semibold'>Forgot Password ?</Link></p>
      </div>
    </div>
  )
}

export default Checkpassword