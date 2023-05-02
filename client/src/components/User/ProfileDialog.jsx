import {ListItem,ListItemAvatar,ListItemText, Dialog,Skeleton,DialogTitle,List,DialogContent,DialogActions,DialogContentText,Button,Avatar, Typography,Box, IconButton } from '@mui/material'
import React,{useState} from 'react'
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import axios from "axios"
import Axios from '../../config/Axios';
import { AuthState } from '../../context/AuthProvider';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import {grey } from '@mui/material/colors';
function ProfileDialog({open,setOpen,profileUser,chats,setChats}) {
  const user = AuthState();
  const [loading,setLoading] = useState(false);
  const [groupUsers,setGroupUsers] = useState(profileUser.users);
  const updateProfilePicture = async (e)=>{
    let pics = e.target.files[0];
    if(!pics) return;
    setLoading(true);
    if(pics.type==="image/jpeg" || pics.type==="image/png"){
      const data = new FormData();
      data.append("file",pics);
      data.append("upload_preset","mernchatapp");
      data.append("cloud_name", "dqlplxvtx");
      let config = {
          headers:{
              "Authorization":`Bearer ${user.token}`
          }
       }
      try{
        let res=  await axios.post("https://api.cloudinary.com/v1_1/dqlplxvtx/image/upload",data);
        let updateUser =  await Axios.put("/api/user/update/profile-picture",{pic:res.data.url},config);
        user.pic = updateUser.data.data.pic;
        localStorage.setItem("userInfo",JSON.stringify(updateUser.data.data));
        setLoading(false);
      }catch(err){
        console.log(err)
        setLoading(false);
      }
      
    }
    setLoading(false);
  }
  const removeFromGroup = async(userId)=>{
    let config = {
      headers:{
          "Authorization":`Bearer ${user.token}`
      }
    }
    try{
      let res = await Axios.post("/api/chat/remove",{userId,chatId:profileUser._id},config);
      if(res.data.data.users.length<=2){
        setOpen(false);
        setChats([...chats.filter((c)=>c._id != profileUser._id)])
      }
      const existGpUsers=groupUsers.filter((gu)=>gu._id !==userId);
      if(existGpUsers.length<=0){
        setOpen(false);
        setChats([...chats.filter((c)=>c._id != profileUser._id)])
      }
      setGroupUsers(existGpUsers)      
    }catch(err){
      console.log(err)
    }
  }
  const leaveGroup =()=>{
    removeFromGroup(user._id);
    setChats([...chats.filter((c)=>c._id != profileUser._id)])
    setOpen(false);
  }
  const loginUserIsGroupAdmin = profileUser.groupAdmin === user._id;
  return (
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
        <DialogTitle id='dialog-title' sx={{position:"relative"}}>
            <Typography variant="h6" sx={{textAlign:"center"}} >Profile</Typography>
            {
              profileUser.isGroupChat &&  <Button color="error" onClick={leaveGroup}  sx={{position:"absolute",top:"12px",right:"10px"}}>Leave Group</Button>
            }
            
        </DialogTitle>
        <DialogContent>
            <DialogContentText id='dialog-description'>
                <Box sx={{position:"relative",width: 100, height: 100,margin:"13px auto" }}>
                    {
                      loading ?  <Skeleton
                        variant='circular'
                        width="100%"
                        height="100%"
                        animation='wave'
                      />:(
                        <Avatar sx={{width:"100%",height:"100%"}} src={profileUser.pic} size="large"/>
                      )
                    }
                    <input
                      id="icon-button-photo"
                      onChange={updateProfilePicture}
                      type="file"
                      style={{display:"none"}}
                    />
                    {
                      user._id === profileUser._id && (
                        <label htmlFor="icon-button-photo">
                          <IconButton color="primary" component="span"  sx={{postiton:"absolute",bottom:"40px",left:"70px"}}> 
                              <PhotoCameraIcon />
                          </IconButton>
                        </label>
                      )
                    }
                 
                </Box>
               
                <Typography variant="h5"  sx={{textAlign:"center",fontWeight:"bolder",textTransform:"uppercase"}} color="darkness.main" gutterBottom>
                    {profileUser.chatName || profileUser.name}
                </Typography>
                {
                  !profileUser.isGroupChat ?(
                    <Typography variant="body1" sx={{textAlign:"center"}} color="dark.light">
                       Email : {profileUser.email}
                    </Typography>
                  ):(
                    <Box>
                        <List sx={{padding:"5px"}}>
                              {groupUsers.map((user)=>(
                                <ListItem sx={{padding:"3px 5px",marginBottom:"12px",backgroundColor:grey[200],borderRadius:"5px",cursor:"pointer",position:"relative"}} >
                                   <ListItemAvatar>
                                       <Avatar src={user.pic}/> 
                                   </ListItemAvatar>
                                   <ListItemText primary={user.chatName || user.name} secondary={user._id===profileUser.groupAdmin ? "Admin":"Member"} />
                                   {
                                  
                                  loginUserIsGroupAdmin &&  user._id!==profileUser.groupAdmin   && (
                                        <IconButton color="warning" onClick={()=>removeFromGroup(user._id)}>
                                               <PersonRemoveIcon />
                                         </IconButton>
                                      )
                                    
                                   
                                   }
   
                                 </ListItem>
                              ))}
                                      
                         </List>
                    </Box>
                  )
                }
               
             </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button color="primary" variant='outlined' onClick={()=>setOpen(false)}>
             close
          </Button>
        </DialogActions>
    </Dialog>
  )
}

export default ProfileDialog