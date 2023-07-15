// export const generateUserErrorInfo = (user) =>{
//     return `
//     Alguno de los campos para crear el usuario no es valido:
//     Lista de campos requeridos:
//     title: Debe ser un campo string, pero recibio "${user.first_name}"
//     description: Debe ser un campo string, pero recibio "${user.last_name}"
//     code: Debe ser un numero entero, pero se recibio "${user.email}"
//     price: Debe ser un numero entero, pero se recibio "${user.age}"        
//     `
// }
export const generateUserErrorInfo = (user) => {
    return `
      Alguno de los campos para crear el usuario no es válido:
      Lista de campos requeridos:
      first_name: Debe ser un campo string, pero recibió "${user.first_name}"
      last_name: Debe ser un campo string, pero recibió "${user.last_name}"
      email: Debe ser un campo string, pero recibió "${user.email}"
      age: Debe ser un campo numérico, pero recibió "${user.age}"
      password: Debe ser un campo string, pero recibió "${user.password}"
    `;
  }