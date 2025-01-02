import React,{useEffect} from 'react'
import { useNavigate } from 'react-router-dom';
function Logout() {
    const navigate=useNavigate()
  return (
   useEffect(()=>{navigate('/login')},[])
  )
}

export default Logout