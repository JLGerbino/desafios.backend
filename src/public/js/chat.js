const socket = io();

let user
let chatbox = document.getElementById("chatbox")

Swal.fire({
    title: "Ingresa con tu email",
    input: "text",
    inputValidator: (value) =>{
        return !value && "Necesitas ingresar un email para iniciar!"
    },
    allowOutsideClick: false,     
}).then(result =>{
    user  = result.value;
})

chatbox.addEventListener('keyup', evt =>{
    console.log(evt);
    if(evt.key === "Enter"){
        if(chatbox.value.trim().length>0){
            socket.emit('message2',{user:user, message:chatbox.value.trim()})
            chatbox.value = "";
        }
    }
})

socket.on('messageLogs', data =>{
    if(!user) return;
    let log = document.getElementById('messageLogs');
    let messages = "";
    data.forEach(message => {
        messages +=  `${ message.user } dice: ${ message.message } <br/>  `       
    });
    log.innerHTML = messages
})

