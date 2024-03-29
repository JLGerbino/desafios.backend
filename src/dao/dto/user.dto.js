export class CreateUserDto {
    constructor(user){
        this._id = user.id
        this.first_name = user.nombre;
        this.last_name = user.apellido
        this.email = user.email;
        this.age = user.edad;
        this.password = user.contraseña;
        this.cartId = user.id_carrito;
        this.role = user.roles;
        this.avatar = user.avatar;
    }  
}
export class GetUserDto{
    constructor(userDB){
        this.id = userDB._id
        this.nombreCompleto = userDB.first_name + " " + userDB.last_name;
        this.email = userDB.email;
        this.edad = userDB.age;
        this.roles = userDB.role;
        this.cartId = userDB.cartId;        
    }
}
