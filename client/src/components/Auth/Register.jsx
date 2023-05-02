import React,{useState} from 'react'
import  {Box,Alert, Divider, Stack, TextField, Typography,InputAdornment,IconButton} from '@mui/material'
import PasswordField from '../../util/PasswordField';
import Axios from '../../config/Axios'
import { toast } from 'react-toastify';
import {useNavigate} from 'react-router-dom';
import {LoadingButton} from '@mui/lab'
function Register() {
  const [showPassword,setShowPassword] =useState(false);
  const [password,setPassword] = useState("");
  const [name,setName] = useState("");
  const [email,setEmail] = useState("");
  const [error,setError] = useState(false);
  const [errorMessage,setErrorMessage]= useState("");
  const navigate  = useNavigate();
  const [loading,setLoading] = useState(false);
  /* User Register */
  const userRegister =async (e)=>{
    e.preventDefault();
    setLoading(true);
    if(name && email && password){
      try{
        let res= await Axios.post("/api/user/register",{name,email,password});
        localStorage.setItem("userInfo",JSON.stringify(res.data.data));
        toast.success("Regsiter Success",{
          position: "top-right",
          autoClose: 5000,
        });
        setLoading(false)
        navigate("/chat")
      }catch(err){
        setLoading(false)
        setError(true);
        setErrorMessage(err.response.data.message);
      }
      setLoading(false)
    }
    
  }
  return (
    <Stack sx={{marginTop:".4rem"}}>
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
          <form onSubmit={userRegister}>
              <Typography component="div" sx={{marginBottom:"15px"}}>
                      <TextField required value={name} onChange={(e)=>setName(e.target.value)} color="secondary" size='small' label="Name" fullWidth/>
              </Typography>
              <Typography component="div" sx={{marginBottom:"15px"}}>
                      <TextField required type="email" value={email} onChange={(e)=>setEmail(e.target.value)} color="secondary" size='small' label="Email" fullWidth/>
              </Typography>
             <Typography component="div" sx={{marginBottom:"15px"}}>
                    <PasswordField showPassword={showPassword} setShowPassword={setShowPassword} password={password} setPassword={setPassword} />
             </Typography>
              <Divider />
              <LoadingButton loading={loading}  type="submit" variant="contained" color="secondary" sx={{width:"300px"}} loadingPosition='center'>Register</LoadingButton>
          </form>
      </Box>
    </Stack>
  )
}

export default Register