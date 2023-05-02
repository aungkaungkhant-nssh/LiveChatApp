import React from 'react'
import Navbar from '../components/Navbar'
import { AuthState } from '../context/AuthProvider';
import MyChat from '../components/Chat/MyChat';
import ChatBox from '../components/Chat/ChatBox';
import {Grid, Box} from "@mui/material"
import { makeStyles } from '@mui/styles';
import Axios from '../config/Axios';
import { useState } from 'react';
import { NotificationState } from '../context/NotificationProvider';

function Chat() {

  const user= AuthState();
  const [chats,setChats] = useState([]);
  const [userSelected,setUserSelected] = useState(null);
  const {notifications,setNotifications} = NotificationState();
  const [mediumDevice,setMediumDevice] = useState(false);

  const accessChat = async (value)=>{
    const config = {
      headers:{
        authorization:`Bearer ${user.token}`
      }
    }
    try{
      let res = await Axios.post("/api/chat",{id:value._id},config);
    
      setChats([...chats,res.data.data])
      if(userSelected && window.innerWidth<=768){
        setMediumDevice(true);
        setUserSelected(null) 
      }
    }catch(err){
      console.log(err);
    }
  }
  const selectForChat =(chat)=>{
    setMediumDevice(false)
    setUserSelected(chat);
   
    const existNoti = notifications.filter((n)=>(
      n.chat._id !== chat._id
    ))
    setNotifications([...existNoti]);
    localStorage.setItem("notifications",JSON.stringify(existNoti));
  }
  const readNotfication = (chat)=>{
    const userSelectedChat =  chats.find((c)=> c._id === chat._id);
    if(!userSelectedChat){
      setChats([...chats,chat]);
    }
    selectForChat(chat)
  }

  return (
    <>
      {user && <Navbar accessChat={accessChat} readNotfication={readNotfication}/>}
      <Box>
        <Grid container  spacing={1} p={2} >
              <Grid  item xs={12} md={4}  display={{ xs:mediumDevice ? "block" : userSelected ? "none":"block", lg: "block" }}>
                {user && <MyChat chats={chats} setChats={setChats} selectForChat={selectForChat} userSelected={userSelected}/>}
              </Grid>
              <Grid item  xs={12} md={8}  display={{ xs:mediumDevice ? "none" : userSelected ? "block":"none", lg: "block" }}>
                {user && <ChatBox chats={chats} setChats={setChats} userSelected={userSelected} setUserSelected={setUserSelected} />}
              </Grid>
          </Grid>
      </Box>
        
    </>
  )
}

export default Chat