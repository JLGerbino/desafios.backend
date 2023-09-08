document.addEventListener("DOMContentLoaded", () => {
const form = document.getElementById("cargaDocs");
form.addEventListener("submit", async e => {
    e.preventDefault();
    const idUser = document.getElementById("idUser").value;    
    const data = new FormData(form);    
    const response = await fetch(`/api/users/${idUser}/documents`, {
      method: "PUT",
      body: data,
    });
    if (response.ok) {
      const json = await response.json();
      location.reload();//agregue
      Swal.fire("La carga de los documentos se realizó con exito.")
      console.log(json);
    } else {
      console.error("Error en la carga de documentos");
    }
  });

  const cambioRoleButton = document.getElementById("cambioRole");
    cambioRoleButton.addEventListener("click", async e => {
        e.preventDefault();
        const idUser1 = document.getElementById("idUser1").value;        
        const response = await fetch(`/api/users/premium/${idUser1}`, {
            method: "PUT",
        });
        if (response.ok) {
            const json = await response.json();
            location.reload();//agregue
            Swal.fire("el cambio de rol se realizó con exito.")
            console.log(json);
            // Realiza cualquier acción adicional que necesites después de cambiar el rol
        } else {
            console.error("Error al cambiar el rol del usuario");
        }
    });
      
  const eliminarUsuario = document.getElementById("eliminarUsuario");
    eliminarUsuario.addEventListener("click", async e => {
        e.preventDefault();
        const idUser2 = document.getElementById("idUser2").value;        
        const response = await fetch(`/api/users/${idUser2}`, {
            method: "DELETE",
        });
        if (response.ok) {
            const json = await response.json();
            location.reload();//agregue
            Swal.fire("EL usuario se elimino correctamente.")
            console.log(json);
            // Realiza cualquier acción adicional que necesites después de cambiar el rol
        } else {
            console.error("Error al intentar eliminar a los usuarios inactivos");
        }
    });

  const eliminarUsuarioInactivo = document.getElementById("eliminarUsuarioInactivo");
  eliminarUsuarioInactivo.addEventListener("click", async e => {
        e.preventDefault();
        //const idUser2 = document.getElementById("idUser2").value;        
        const response = await fetch(`/api/users/`, {
            method: "DELETE",
        });
        if (response.ok) {
            const json = await response.json();
            location.reload();//agregue
            Swal.fire("Los usuarios inactivos se eliminaron correctamente.")
            console.log(json);
            // Realiza cualquier acción adicional que necesites después de cambiar el rol
        } else {
            console.error("Error al intentar eliminar a los usuarios inactivos");
        }
    });  

});



