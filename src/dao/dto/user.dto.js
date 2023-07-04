export class CreateUserDto {
    constructor(user){
        this.first_name = user.nombre;
        this.last_name = user.apellido
        this.email = user.email;
        this.age = user.edad;
        this.password = user.contraseña;
        this.cartId = user.id_carrito;
        this.role = user.roles
    }  
}
export class GetUserDto{
    constructor(userDB){
        this.nombreCompleto = userDB.first_name + " " + userDB.last_name;
        this.email = userDB.email;
        this.edad = userDB.age;
        this.roles = userDB.role;
    }
}
