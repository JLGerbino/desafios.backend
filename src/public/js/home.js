const socket = io();
const log = document.getElementById("log");

const botonEnviar = document.getElementById("enviar"); 
const newrole = window.role
const user = window.owner;
console.log("front", newrole);
console.log("front", owner);

botonEnviar.addEventListener("click", event => {
   if (event){
      const title = document.getElementById("title").value;
      const description = document.getElementById("description").value;
      const code = document.getElementById("code").value;
      const price = document.getElementById("price").value;
      const stock = document.getElementById("stock").value;
      const category = document.getElementById("category").value;
      const thumbnail = document.getElementById("thumbnail").value;       
      let nuevoOwner;      
      if (role === "premium") {
         nuevoOwner = user;
      } else {
         nuevoOwner = "admin";
      }     
      const nuevoProducto = {title, description, code, price, status: "true", stock, category, owner: nuevoOwner, thumbnail};      
      socket.emit("message", nuevoProducto);
   }      
})

socket.on("actualizado", productos => {
   console.log(productos)
   if (productos === "campos"){
      Swal.fire("Todos los campos son obligatorios")
   }
   if(productos === "code"){
      Swal.fire("El 'code' del producto ya existe, intente cambiarlo.")
   }  
   if (productos === "inexistente") {
      Swal.fire("El producto que quiere eliminar no existe")
   } 
   else{
   let inicio = document.getElementById("inicio");
   inicio.style.display = "none";
   let listaProductos = document.getElementById("productos");
   listaProductos.innerHTML = "";    
   productos.forEach(producto => {
     let p = document.createElement("p");
     p.innerText = `id: ${producto._id}, title: ${producto.title}, description: ${producto.description},code: ${producto.code} ,price: ${producto.price}, status: ${producto.status}, stock: ${producto.stock}, category: ${producto.category}, owner:${producto.owner}, thumbnail: ${producto.thumbnail}`;
     listaProductos.appendChild(p);
   });
 }
});

const botonEliminar = document.getElementById("eliminar");
botonEliminar.addEventListener("click", event => {
  if (event){
     const id =  document.getElementById("id").value;
     const data = {
      id: id,
      user: user,
      role: newrole
     }     
     socket.emit("message1", data);
  }
})


//  const botonEliminar = document.getElementById("eliminar");
//  botonEliminar.addEventListener("click", event => {
//    if (event){
//       const id =  document.getElementById("id").value;
//       socket.emit("message1", id);
//    }
// })
//agregue
// botonEliminar.addEventListener("click", event => {
//    if (event) {
//      const id = document.getElementById("id").value;
//      socket.emit("deleteProduct", { productId: id, userEmail: user, userRole: role });
//    }
//  });
 
// botonEliminar.addEventListener("click", event => {
//    if (event) {
//      const id = document.getElementById("id").value;
//      socket.emit("getProductInfo", id); // Enviamos una solicitud para obtener información del producto
//    }
//  });
 //agregue
//  socket.on("productInfo", product => {
//    if (!product) {
//      Swal.fire("El producto no existe o hubo un error al obtener la información");
//    } else if (role === "premium" && product.owner !== user) {
//      Swal.fire("Solo puedes borrar tus propios productos");
//    } else {
//      socket.emit("message1", product._id); // Si el usuario es "premium" y es el dueño del producto, enviamos el ID para eliminarlo
//    }
//  });
//  socket.on("productInfo", product => {
//    // product contiene la información del producto obtenida del servidor
//    if (role === "premium" && product.owner !== user) {
//      Swal.fire("Solo puedes borrar tus propios productos");
//    } else {
//      socket.emit("message1", product._id); // Si el usuario es "premium" y es el dueño del producto, enviamos el ID para eliminarlo
//    }
//  }); 

//
//botonEliminar = document.getElementById("eliminar"); 
// botonEliminar.addEventListener("click", event => {
//    if (event){
//       const id =  document.getElementById("id").value;
//       // Verificar que el usuario premium solo pueda borrar sus propios productos
//       if (role === "premium" && owner !== user) {
//          Swal.fire("Solo puedes borrar tus propios productos");
//       } else {
//          socket.emit("message1", id);
//       }
//    }
// });

//este es el que anda
 



// //ESTA ES LA PARTE DEL CLIENTE
// const socket = io();
// const log = document.getElementById("log");
// const botonEnviar = document.getElementById("enviar");
// //const owner = window.owner;
// //const user = {user};
// //agregue esto
// //console.log("front", user);
// botonEnviar.addEventListener("click", event => {
//    if (event){
//       const title = document.getElementById("title").value;
//       const description = document.getElementById("description").value;
//       const code = document.getElementById("code").value;
//       const price = document.getElementById("price").value;
//       const stock = document.getElementById("stock").value;
//       const category = document.getElementById("category").value;
//       const thumbnail = document.getElementById("thumbnail").value;      
      
//       const nuevoProducto = {title, description, code, price, status: "true", stock, category, thumbnail};
      
//       socket.emit("message", nuevoProducto);
//    }      
// })

// socket.on("actualizado", productos => {
//    console.log(productos)
//    if (productos === "campos"){
//       Swal.fire("Todos los campos son obligatorios")
//    }
//    if(productos === "code"){
//       Swal.fire("El 'code' del producto ya existe, intente cambiarlo.")
//    }  
//    if (productos === "inexistente") {
//       Swal.fire("El producto que quiere eliminar no existe")
//    } 
//    else{
//    let inicio = document.getElementById("inicio");
//    inicio.style.display = "none";
//    let listaProductos = document.getElementById("productos");
//    listaProductos.innerHTML = "";    
//    productos.forEach(producto => {
//      let p = document.createElement("p");
//      p.innerText = `id: ${producto._id}, title: ${producto.title}, description: ${producto.description},code: ${producto.code} ,price: ${producto.price}, status: ${producto.status}, stock: ${producto.stock}, category: ${producto.category}, thumbnail: ${producto.thumbnail}`;
//      listaProductos.appendChild(p);
//    });
//  }
// });
 
//  botonEliminar = document.getElementById("eliminar");
//  botonEliminar.addEventListener("click", event => {
//    if (event){
//       const id =  document.getElementById("id").value;
//       socket.emit("message1", id);
//    }
// })
 




