exports.getSender = (loginUser,chatList)=>{
    return loginUser._id === chatList.users[0]._id ? chatList.users[1] : chatList.users[0]
}

exports.sameSender  = (message,index,messages)=>{
    return messages[index+1] &&   message.sender._id === messages[index+1].sender._id 
}
exports.sameMessageGpUser = (message,index,messages)=>{
    return messages[index-1] ? message.sender._id !== messages[index-1].sender._id  : true
}