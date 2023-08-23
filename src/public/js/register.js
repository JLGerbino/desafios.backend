
const form = document.getElementById("registerForm");

form.addEventListener("submit", async e => {
    e.preventDefault();    
    const data = new FormData(form);
    const response = await fetch("/api/sessions/register", {
        method: "POST",
        body: data,
    });
    if (response.ok) {
        const json = await response.json();
        console.log(json);
    } else {
        console.error("Error en la solicitud de registro");
    }
});

// const form = document.getElementById("registerForm");


// form.addEventListener("submit", e=>{
//     e.preventDefault();
//     const data = new FormData(form);
//     const obj = {};
//     data.forEach((value,key)=>obj[key]=value);
//     fetch("/api/sessions/register",{
//         method:"POST",                
//         body: JSON.stringify(obj),
//         headers: {
//             'Content-Type': 'application/json'
//         }
//     }).then(result=>result.json())//.then(json =>console.log(json))esto estaba descomentado
// })