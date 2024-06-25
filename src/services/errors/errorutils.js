const generarInfoError = (usuario) => {
    return `Los datos están incompletos o no son válidos. 
    Necesitamos recibir los siguientes datos: 
    - Nombre: String, pero recibimos ${usuario.nombre}
    - Apellido: String, pero recibimos ${usuario.apellido}
    - Email: String, recibimos ${usuario.email}`;
};

const customError = ({ nombre = "Error", causa = "desconocida", mensaje, codigo = 1 }) => {
    const error = new Error(mensaje);
    error.name = nombre;
    error.causa = causa;
    error.code = codigo;
    return error;
};

module.exports = {
    generarInfoError,
    customError
};
