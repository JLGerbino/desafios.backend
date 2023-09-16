export const generateUserErrorInfo = (user) => {
    return `
      Alguno de los campos para crear el usuario no es válido:
      Lista de campos requeridos:
      first_name: Debe ser un campo string, pero recibió "${user.first_name}"
      last_name: Debe ser un campo string, pero recibió "${user.last_name}"
      email: Debe ser un campo string, pero recibió "${user.email}"
      age: Debe ser un campo numérico, pero recibió "${user.age}"
      password: Debe ser un campo string, pero recibió "${user.password}"
      role: Debe ser un campo string, pero recibió "${user.role}"
    `;
  }