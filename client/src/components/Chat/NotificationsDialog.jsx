import React from 'react'
import {Dialog,DialogContent,DialogContentText,Typography,DialogTitle,List,ListItemText,ListItem,Avatar,ListItemAvatar} from '@mui/material';
import { NotificationState } from '../../context/NotificationProvider';
import { grey } from '@mui/material/colors';
import { AuthState } from '../../context/AuthProvider';
function NotificationsDialog({open,setOpen,readNotfication}) {
  const {notifications,setNotifications} = NotificationState();
  const user = AuthState();
  const handleReadNotification = (chat)=>{
    readNotfication(chat);
    setOpen(false);
  }


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
        <DialogTitle id='dialog-title'>
            <Typography variant="h6" sx={{textAlign:"center"}} >Notifications</Typography>
        </DialogTitle>
        <DialogContent>
            <DialogContentText>
                    <List>
                        {
                            notifications.map((noti)=>(
                                <ListItem sx={{backgroundColor:grey[300],borderRadius:"5px",cursor:"pointer"}} onClick={()=>handleReadNotification(noti.chat)}>
                                    <ListItemAvatar>
                                        <Avatar src={noti.messages.sender.pic}/>
                                    </ListItemAvatar>
                                    <ListItemText primary={noti.chat.isGroupChat ? noti.chat.chatName : noti.messages.sender.name}  
                                    secondary={`${noti.chat.latestMessage.sender.name} : ${noti.chat.latestMessage.content}`} />
                                 </ListItem>
                            ))
                        }
                        
                    </List>
            </DialogContentText>
        </DialogContent>
        
    </Dialog>
  )
}

export default NotificationsDialog