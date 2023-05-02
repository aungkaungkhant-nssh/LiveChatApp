import React,{useState} from 'react'
import {Drawer,Box,Stack,CircularProgress,List} from '@mui/material'
import SearchBar from '@mkyy/mui-search-bar';
import {Search} from "@mui/icons-material";
import {grey } from '@mui/material/colors';
import Axios from '../../config/Axios';
import {AuthState} from '../../context/AuthProvider';
import SearchUser from './SearchUser';
function SideDrawer({open,setOpen,accessChat}) {
  const [searchKey,setSearchKey] = useState("");
  const [loading,setLoading] = useState(false);
  const [searchUsers,setsearchUsers] = useState([]);
  const [notFound,setNotFound] = useState(null);
  const user = AuthState();
  const searchUser = async (value)=>{
    if(!value){
      setNotFound(null);
      setsearchUsers([]);
      return;
    }
    setSearchKey(value);
    setLoading(true)
    let config = {
        headers:{
            authorization:`Bearer ${user.token}`
        }
    }
    setTimeout(async () => {
      try{
        let res=  await Axios.get(`/api/user?search=${value}`,config);
        setsearchUsers(res.data.data);
        setNotFound(null);
        setLoading(false)
      }catch(err){
        setsearchUsers([]);
        if(err.response.status==404){
          setNotFound(err.response.data.message)
        }
        setLoading(false);
        // console.log(err)
      }
      
    }, 2000);
  }
  const handleClick = (value)=>{
    setOpen(false);
    setsearchUsers([]);
    setSearchKey("");
    accessChat(value); 
  }

  return (
    <Drawer
    anchor="left"
    open={open}
    onClose={()=>setOpen(false)}
    sx={{postion:"relative"}}
  >
    <Box p={1} textAlign='center' sx={{width:{xs:"260px",lg:"280px"}}}>
        <Stack>
              <SearchBar
                value={searchKey}
                onChange={(e)=>searchUser(e)}
                searchIcon={<Search  />}
                style={{
                  margin:"0 auto 15px auto",
                  maxWidth:"240px",
                  width:"100%",
                  backgroundColor:grey[400]
                }}
                />
            {
              loading ?  (
                <CircularProgress color="inherit" size="1.5rem" sx={{position:"absolute",top:"80px",left:"40%"}}/>
              ):
              notFound?(
                  "Search Not Found"
              ):(
                searchUsers.length>0 && (
                  <Box  borderRadius="5px" sx={{maxHeight:"90%",overflow:"auto"}}>
                    <List sx={{padding:"5px"}}>
                          {searchUsers.map((user)=>(
                              <SearchUser user ={user} accessChat={handleClick} key={user._id}/>
                          ))}
                          
                    </List>
                 
                   </Box>
                )
                
                
              )
            }
        </Stack>
    </Box>
  </Drawer>
  )
}

export default SideDrawer