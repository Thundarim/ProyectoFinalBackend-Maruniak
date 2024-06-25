const { customError } = require('./errorutils.js');

const erroresComunes = {
    CREAR_PRODUCTO: customError({
        nombre: "ErrorCrearProducto",
        causa: "No se pudo crear el producto.",
        mensaje: "Error al crear el producto.",
        codigo: 1001
    }),
    AGREGAR_AL_CARRITO: customError({
        nombre: "ErrorAgregarAlCarrito",
        causa: "No se pudo agregar el producto al carrito.",
        mensaje: "Error al agregar el producto al carrito.",
        codigo: 1002
    }),
    LOGIN_CREDENCIALES_INVALIDAS: customError({
        nombre: "ErrorCredencialesInvalidas",
        causa: "Las credenciales proporcionadas no son válidas.",
        mensaje: "Error de inicio de sesión: Credenciales inválidas.",
        codigo: 1003
    }),
    EMAIL_YA_UTILIZADO: customError({
        nombre: "ErrorEmailUtilizado",
        causa: "El correo electrónico proporcionado ya está en uso.",
        mensaje: "Error al registrar usuario: Correo electrónico ya utilizado.",
        codigo: 1004
    }),
};

module.exports = erroresComunes;
