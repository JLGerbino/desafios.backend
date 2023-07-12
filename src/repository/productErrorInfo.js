export const generateProductErrorInfo = (product) =>{
    return `
    Alguno de los campos para crear el usuario no es valido:
    Lista de campos requeridos:
    title: Debe ser un campo string, pero recibio "${product.title}"
    description: Debe ser un campo string, pero recibio "${product.description}"
    code: Debe ser un numero entero, pero se recibio "${product.code}"
    price: Debe ser un numero entero, pero se recibio "${product.price}"
    stock: Debe ser un numero entero, pero se recibio "${product.stock}"
    category: Debe ser un campo string, pero se recibio "${product.category}"
    thumbnail: Debe ser un campo string, pero se recibio "${product.thumbnail}"    
    `
}