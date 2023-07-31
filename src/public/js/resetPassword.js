const form = document.getElementById("restartPasswordForm");

form.addEventListener("submit", e=>{
    e.preventDefault();

    const data = new FormData(form);
    const obj = {};

    data.forEach((value,key)=>obj[key]=value);

    //fetch("/api/sessions/restartPassword", {
    fetch("/api/resetPassword", {
        method: "POST",
        body: JSON.stringify(obj),
        headers:{
            'Content-Type': 'application/json'
        }
    }).then(result=>result.json()).then(json=>{ 
        localStorage.setItem('token',json.access_token)
     })
})