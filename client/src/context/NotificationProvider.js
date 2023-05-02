import { createContext, useContext, useState } from "react";

const NotificationContext = createContext();
const NotificationProvider = ({children})=>{
    const [notifications,setNotifications] = useState(localStorage.getItem("notifications") ? JSON.parse(localStorage.getItem("notifications")): null);
    return (
        <NotificationContext.Provider value={{notifications,setNotifications}}>
            {children}
        </NotificationContext.Provider>
    )
}
export const NotificationState = ()=>{
    return useContext(NotificationContext);
}

export default NotificationProvider;