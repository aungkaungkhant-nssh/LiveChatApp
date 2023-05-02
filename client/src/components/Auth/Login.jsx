import React,{useState} from 'react'
import  {Box,Alert, Stack, TextField, Typography} from '@mui/material'
import {LoadingButton} from '@mui/lab'
import PasswordField from '../../util/PasswordField';
import Axios from '../../config/Axios';
import {useNavigate} from 'react-router-dom';
import { toast } from 'react-toastify';

function Login() {
  const [showPassword,setShowPassword] =useState(false);
  const [password,setPassword] = useState("");
  const [email,setEmail] = useState("");
  const navigate = useNavigate();
  const [error,setError] = useState(false);
  const [errorMessage,setErrorMessage]= useState("");
  const [loading,setLoading] = useState(false);
  
  /* User Login */
  const userLogin = async(e)=>{
    e.preventDefault();
    setLoading(true);
    try{
      let res=await Axios.post("/api/user/login",{email,password});
      localStorage.setItem("userInfo",JSON.stringify(res.data.data));
      toast.success("Login Success",{
        position: "top-right",
        autoClose: 5000,
      });
      setLoading("false");
      navigate("/chat");
    }catch(err){
        setLoading(false);
        setError(true);
        setErrorMessage(err.response.data.message);
    }
   
  }
  return (
    <Stack  sx={{marginTop:".4rem"}} spacing={2} >
        {
          error && (
           <Box  display="flex" justifyContent="center" alignItems="center"
           width="100%">
               <Alert  severity="error"   onClose={() => setError(false)}>
                  {errorMessage}
              </Alert>
           </Box>
          )
        }
        <Box sx={{width:"100%"}} display="flex" justifyContent="center" alignItems="center"
        width="100%">
            <form onSubmit={userLogin}>
                <Typography component="div" sx={{marginBottom:"15px"}}>
                         <TextField required type="email" value={email} onChange={(e)=>setEmail(e.target.value)} color="secondary" size='small' label="Email" sx={{width:"300px"}}/>
                </Typography>
                <Typography component="div" sx={{marginBottom:"15px"}}>
                <PasswordField showPassword={showPassword} setShowPassword={setShowPassword} password={password} setPassword={setPassword} />
                </Typography >
                <LoadingButton loading={loading}  type="submit" variant="contained" color="secondary" sx={{width:"300px"}} loadingPosition='center'>Login</LoadingButton>
            </form>
        </Box>
        
    </Stack>
  )
}

export default Login