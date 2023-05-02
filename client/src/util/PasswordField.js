import { forwardRef } from "react";
import  {TextField, InputAdornment,IconButton} from '@mui/material'
import {Visibility,VisibilityOff} from '@mui/icons-material';
const PasswordField =forwardRef((props,ref)=>(
    <TextField required color="secondary" type={props.showPassword ? "text" :"password"} size="small" fullWidth label="Password"
    value={props.password}
    onChange={(e)=>props.setPassword(e.target.value)}
    InputProps={{
      endAdornment: <InputAdornment position='end'>
        <IconButton
          onClick={()=>props.setShowPassword(!props.showPassword)}
        >
            {props.showPassword ? <VisibilityOff /> :<Visibility />}
        </IconButton>
      </InputAdornment>
    }}
  />
))

export default PasswordField