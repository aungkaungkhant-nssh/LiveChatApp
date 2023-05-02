import { Stack, Typography,Box ,Paper, Divider, Tab} from '@mui/material'
import {TabContext,TabList,TabPanel} from '@mui/lab'
import React,{useState} from 'react'
import Login from '../components/Auth/Login';
import Register from '../components/Auth/Register';


const Auth = () => {
  const [component,setComponent] = useState("login");
  return (
    <Stack display="flex" justifyContent="center" alignItems="center"
    minHeight="100vh" width="100%">
        <Paper elevation={5} sx={{width:{xs:"90%",lg:"60%"}}}>
            <Box p={3}>
                <Typography variant='h5' align="center">Mern Live Chat App</Typography>
            </Box>
        </Paper>
        <Divider sx={{ borderBottomWidth: 8}} />
        <Paper  elevation={5} sx={{width:{xs:"90%",lg:"60%"},height:"400px"}}>
            <Box p={3}>
                <TabContext value={component}>
                    <TabList textColor="secondary" indicatorColor='secondary' centered onChange={(e,newValue)=>setComponent(newValue)}>
                        <Tab sx={{marginRight:"100px"}} value="login" label="Login"/>
                        <Tab value="register" label="Register"/>
                    </TabList>
                    <TabPanel value="login">
                        <Login />
                    </TabPanel>
                    <TabPanel value="register">
                        <Register />
                    </TabPanel>
                </TabContext>
            </Box>
        </Paper>
    </Stack>
  )
}

export default Auth