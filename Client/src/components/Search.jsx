import React, { useEffect } from 'react'
import { useState } from 'react';
import { IoSearchOutline } from "react-icons/io5";
import Loading  from '../components/Loading.jsx';
import Usersearchcard from './Usersearchcard.jsx';
import toast from 'react-hot-toast';
import axios from "axios"
import { IoClose } from "react-icons/io5";

const Search = ({onClose}) => {
    const [searchuser,setsearchuser] = useState([])
    const [loading,setloading] = useState(false)
    const [search, setsearch] = useState("")


    const Handelsearch = async (e) => {
        const url = "https://chat-app-server-taupe.vercel.app/api/search-user"
        setloading(true)
        try {
            const response = await axios.post(url,{
                search : search
            })
           setloading(false)
            setsearchuser(response.data.data)
        } catch (error) {
            toast.error(error.response.data.message)
        }
    }

    useEffect(()=>{
        Handelsearch()
    },[search])


    console.log(searchuser)
  return (
    <div className='fixed top-0 left-0 bottom-0 right-0 bg-slate-700 bg-opacity-40 p-2 z-10'>
       <div className='w-full max-w-lg mx-auto mt-10'>
        <div className='bg-white rounded h-14 overflow-hidden flex'>
            <input type="text" placeholder='search by name and email'
            className='w-full outline-none py-1 px-4 h-full ' onChange={(e)=>setsearch(e.target.value)} value={search} />
        <div className='h-14 w-14 flex justify-center items-center'>
            <IoSearchOutline size={25}/>
        </div>
        </div>

         <div className='bg-white mt-2 w-full p-4 rounded'>
           
           {
            searchuser.length === 0 && !loading && (
                <p className='text-center text-slate-500'>No user found</p>
            )
           }

           {
            loading && (
                <p><Loading/></p>
            )
           }

        {
            searchuser.length !==0 && !loading && (
                searchuser.map((user,index)=>(
                  <Usersearchcard key={user._id} user={user} onClose={onClose}/>
                ))
            )
            
        }


         </div>
       </div>
       <div className='absolute top-4 right-4 text-2xl  lg:text-4xl hover:text-white' onClick={onClose}>
        <button>
            <IoClose/>
        </button>
       </div>
    </div>
  )
}

export default Search