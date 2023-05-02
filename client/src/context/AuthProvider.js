import React,{createContext, useContext, useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom'
const AuthContext =createContext();

const AuthProvider = ({children})=>{
    const navigate= useNavigate();
    const [user,setUser]= useState(null);
    useEffect(()=>{
      let userInfo = localStorage.getItem("userInfo")? JSON.parse(localStorage.getItem("userInfo")) :null;
      if(!userInfo) navigate("/");
      else {
        navigate("/chat")
      }
      setUser(userInfo);
    },[navigate])

    return (
        <AuthContext.Provider value={user}>
            {children}
        </AuthContext.Provider>
    )
}
export const AuthState= ()=>{
    return useContext(AuthContext)
}
export default AuthProvider;