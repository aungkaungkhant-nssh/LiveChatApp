import React,{useState} from 'react'
import { Dialog,Stack,DialogTitle,DialogContent,DialogActions,Chip,DialogContentText,Button,CircularProgress,List, Typography,Box, IconButton, TextField, Grid } from '@mui/material'
import {LoadingButton} from '@mui/lab'
import { AuthState } from '../../context/AuthProvider';
import Axios from '../../config/Axios';
import SearchUser from '../User/SearchUser';
import { toast } from 'react-toastify';
function CreateGroupDialog({open,setOpen,chats,setChats}) {
  const [chatName,setChatName] = useState("");
  const [searchKey,setSearchKey] = useState("");
  const [loading,setLoading]  = useState(false);
  const [createLoading,setCreateLoading] = useState(false);
  const [searchUsers,setSearchUsers] = useState([]);
  const [users,setUsers] = useState([]);

  const user = AuthState();

  const handleSearchUser = async(e)=>{
      setSearchKey(e.target.value);
      setLoading(true);
      setSearchUsers([]);
      if(!e.target.value){
        setSearchUsers([]);
        return;
      }

      let config = {
        headers:{
          authorization:`Bearer ${user.token}`
        }
      }
      setTimeout(async () => {
        try{
          let res=  await Axios.get(`/api/user?search=${e.target.value}`,config);
          setSearchUsers(res.data.data);
          setLoading(false)
        }catch(err){
          setSearchUsers([]);
          setLoading(false);
        }
        
      }, 2000);
  }
  const addUser=(user)=>{
      setSearchKey("");
      let existUser= users.find((u)=>u._id===user._id);
      if(existUser) return;
      setUsers([...users,user]);
  }
  const removeUser = (user)=>{
    setUsers([...users.filter((u)=>u._id !== user._id)]);
  }
  const handleCreateGroup = async(e)=>{
    e.preventDefault();
    if(!chatName || !users.length)return;
    setCreateLoading(true)
    const config = {
      headers:{
        authorization:`Bearer ${user.token}`
      }
    }
    try{
      let createGroup =await Axios.post("/api/chat/create",{chatName,users},config);
      setChats([...chats,createGroup.data.data]);
      setCreateLoading(false);
      setOpen(false);
      setChatName("");
      setUsers([]);
      toast.success("Create Group Success",{
        position: "top-right",
        autoClose: 5000,
      });
    }catch(err){
      setCreateLoading(false);
      toast.error(err.response.data.message,{
        position: "top-right",
        autoClose: 5000,
      });
    }
   
  }
  return (
   <>
         <Dialog
        open={open}
        onClose={()=>setOpen(false)}
        sx={{
            "& .MuiDialog-container": {
              "& .MuiPaper-root": {
                width: "100%",
                maxWidth: "500px", 
              },
            },
          }}
    >
        <DialogTitle id='dialog-title'>
            <Typography variant="h6" sx={{textAlign:"center"}} >Create Group</Typography>
        </DialogTitle>
        <DialogContent>
            <DialogContentText id='dialog-description'>
                <Box>
                  {
                    users.length > 0 &&(
                            <Grid container mb={2} spacing={1}>
                              {
                                users.map((user)=>(
                                    <Grid item key={user._id}>
                                      <Chip label={user.name} onDelete={(e)=>removeUser(user)} color="primary"  />
                                    </Grid>
                                ))
                              }
                           </Grid>
                    )
                  }
                  <form onSubmit={handleCreateGroup}>
                    <Typography component="div" sx={{marginBottom:"15px"}}>
                            <TextField required type="text" value={chatName} onChange={(e)=>setChatName(e.target.value)} color="secondary" size='small' label="group name" fullWidth />
                    </Typography>
                    <Typography component="div" sx={{marginBottom:"15px"}}>
                            <TextField type="text" value={searchKey} onChange={handleSearchUser} color="secondary" size="small" label="user eg.mgmg" fullWidth/>
                    </Typography >
                        {
                          loading ?  (
                            <CircularProgress color="inherit" size="1.5rem" />
                          ):(
                            searchUsers.length>0 && (
                              <Box  borderRadius="5px" sx={{maxHeight:"200px",overflow:"auto",marginBottom:"10px"}}>
                                <List sx={{padding:"5px"}}>
                                      {searchUsers.map((user)=>{
                                          if(!user.chatName){
                                           return  <SearchUser user ={user} accessChat={addUser}  key={user._id}/>
                                          }
                                        
                                      })}
                                      
                                </List>
                            
                              </Box>
                            )
                            
                            
                          )
                        }
                    <LoadingButton loading={createLoading}   type="submit" variant="contained" color="secondary" sx={{width:"100%"}} loadingPosition='center'>Create</LoadingButton>
                  </form>
                
                </Box>
             </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button color="primary" variant='outlined' onClick={()=>setOpen(false)}>
             close
          </Button>
        </DialogActions>
    </Dialog>
   </>
  )
}

export default CreateGroupDialog