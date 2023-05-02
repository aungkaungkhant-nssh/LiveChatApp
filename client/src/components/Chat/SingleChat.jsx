import React,{useState} from 'react'
import { useEffect } from 'react';
import io from 'socket.io-client';
import {CircularProgress,Chip, Stack,Box, TextField,InputAdornment, IconButton, Typography,Avatar, Divider } from '@mui/material';
import { AuthState } from '../../context/AuthProvider';
import Axios from '../../config/Axios';
import SendIcon from '@mui/icons-material/Send';
import { sameSender,sameMessageGpUser } from '../../config/ChatLogic';
import ScrollableFeed from 'react-scrollable-feed';
import Typing from '../../assets/images/TypingStatus.gif'
import { NotificationState } from '../../context/NotificationProvider';
import { json } from 'react-router-dom';
const ENDPOINT = "http://localhost:8000";
var socket,selectedCompare;

function SingleChat({userSelected,chats,setChats}) {
  const user = AuthState();
  const {notifications,setNotifications} = NotificationState();
  const [loading,setLoading] = useState(false);
  const [content,setContent] = useState("");
  const [messages,setMessages] = useState([]);
  const [isTyping,setIsTyping] = useState(false);

  useEffect(()=>{
    socket = io(ENDPOINT);
    socket.emit("setup",user)
  },[])
  /* fetchMessage */
  async function fetchMessage(){
    setLoading(true);
    const config={
      headers:{
        authorization:`Bearer ${user.token}`
      }
    }
    try{
      let res =  await Axios.get(`/api/message/${userSelected._id}`,config);
      setMessages(res.data.data)
      setLoading(false);
    }catch(err){
      setLoading(false);
    }
    
  }
  useEffect(()=>{
      fetchMessage();
      selectedCompare = userSelected
  },[userSelected]);

  /* send message button click */
  const handleSendMessage =async()=>{
    if(!content) return;
    const config = {
      headers:{
        authorization:`Bearer ${user.token}`
      }
    }
    
    try{
     let res =  await Axios.post("/api/message",{chatId:userSelected._id,content},config);
   
     socket.emit("sendMessage",res.data.data);
     setMessages([...messages,res.data.data.messages]);
     setContent("")
   
    }catch(err){
      console.log(err);
    }
  }

  /* user send message and other user recieved message */
  useEffect(()=>{
    socket.on("messageRecieved",(messageRecieved)=>{
      console.log(messageRecieved)
      if(selectedCompare && selectedCompare._id!== messageRecieved.chat._id){
        if(notifications===null){
          setNotifications([messageRecieved]);
          localStorage.setItem("notifications",JSON.stringify([messageRecieved]))
        }else{
          setNotifications([...notifications,messageRecieved]);
          localStorage.setItem("notifications",JSON.stringify([...notifications,messageRecieved]))
        }
       
      }else{
        setMessages([...messages,messageRecieved.messages])

      } 
     
    })
  },[messages])

  /* user press enter and send message */
  const pressKeyEnterSendMessage = (e)=>{
    if(e.key === "Enter"){
      handleSendMessage();
    }
  }
  /* user is Typing */
  const userTyping = (e)=>{
    setContent(e.target.value);
    socket.emit("startTyping",userSelected);
    setTimeout(()=>{
      socket.emit("stopTyping",userSelected);
    },3000)
  }
  useEffect(()=>{
    socket.on("startTyping",(data)=>{
      if(selectedCompare && data._id === selectedCompare._id){
        setIsTyping(true);
      }
  
    })
    socket.on("stopTyping",(data)=>{
      if(selectedCompare && data._id === selectedCompare._id){
        setIsTyping(false);
      }
    })
  },[content]);
  return (
    <Stack >
          
          {
            loading ?  <Box display="flex" justifyContent="center" alignItems="center"  minHeight="52vh"><CircularProgress size="5rem"  color="secondary"/></Box>:(
              <Box sx={{margin:"1rem",maxHeight:"360px",overflowY:"scroll"}}>
                  <ScrollableFeed>
                      {
                        messages.map((message,index)=>(
                            <Box marginBottom={index=== messages.length-1 && isTyping  ? "3.5rem" : sameSender(message,index,messages) ? ".5rem" : "2rem"} key={message._id} component="div" display="flex" justifyContent={"space-between"} alignItems="top">
                              {
                                message.sender._id === user._id ? (
                                    <>
                                      <div></div>
                                      <Chip label={message.content} color="secondary"></Chip>
                                    </>
                                    
                                  
                                ):(
                                  <>
                                      <Box sx={{display:"flex"}}>
                                        {!sameSender(message,index,messages) ? (<Avatar src={message.sender.pic} sx={{height:"32px",width:"32px",marginRight:"5px"}}></Avatar>) : <div style={{width:"32px",height:"32px",marginRight:"5px"}}></div>}
                                          <Chip label={message.content}></Chip>
                                          {userSelected.isGroupChat  && sameMessageGpUser(message,index,messages) && (<Typography variant="body1" color="darkness.middle" sx={{marginLeft:"1rem"}}>{message.sender.name}</Typography>)}
                                      </Box>
                                       <div></div>
                                       
                                  </>
                                  
                                )
                               
                              }
                                
                             </Box>
                        ))
                      
                      }
                      
                  </ScrollableFeed>
                
                  
              </Box>  
            )
          }
          <Stack sx={{position:"absolute",bottom:0,left:10,right:10,zIndex:1000}}>
          {isTyping && <img src={Typing} alt="" style={{width:"80px",height:"80px",marginLeft:".3rem"}} />}
            <TextField sx={{backgroundColor:"#eee"}} value={content}   onChange={userTyping} onKeyDown={pressKeyEnterSendMessage} size='small' color="secondary"  placeholder="Text Message"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                      <IconButton onClick={handleSendMessage}>
                          <SendIcon color='primary'/>
                      </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Stack>
        
    </Stack>
  )
}

export default SingleChat