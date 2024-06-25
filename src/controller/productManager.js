const Product = require("../dao/models/products.model");
const EmailManager = require("../services/email.js");
const emailManager = new EmailManager();


class ProductManager {
    static ultId = 0;

    constructor(path) {
        this.products = [];
        this.path = path;
        this.removedProductId = null;
    }
    async getProducts() {
        try {
            const products = await Product.find();
            return products;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
    
    async getProductById(id) {
        try {
            const product = await Product.findById(id);
            return product;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
    
    async addProduct(newProduct, user) {
        try {
            if (!newProduct.title || !newProduct.description || !newProduct.code || !newProduct.price || !newProduct.stock || !newProduct.category) {
                throw new Error("Todos los campos son obligatorios");
            }
            if (user.role === 'premium') {
                newProduct.owner = user.email;
            } else if (user.role === 'admin') {
                newProduct.owner = 'admin';
            } else {
                throw new Error("Usuario no autorizado para agregar productos");
            }
    
            const ultId = await Product.countDocuments() + 1;
            newProduct.id = ultId;
            newProduct.status = true;
    
            const addedProduct = await Product.create(newProduct);
            return addedProduct;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
    
    
    async updateProduct(productId, updatedFields) {
        try {
            const updatedProduct = await Product.findByIdAndUpdate(productId, updatedFields, { new: true });
            return updatedProduct;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
    async deleteProduct(identifier) {
        try {
            const isId = !isNaN(identifier);
            
            if (isId || (typeof identifier === 'string' && identifier.trim() !== '')) {
                let deletedProduct;
                if (isId) {
                    deletedProduct = await Product.findOne({ _id: identifier });
                } else {
                    deletedProduct = await Product.findOne({ code: identifier });
                }
                if (deletedProduct) {
                    const ownerEmail = deletedProduct.owner;
                    const productName = deletedProduct.title;
                    if (ownerEmail) {
                        try {
                            await emailManager.enviarCorreoEliminacionProducto(ownerEmail, productName);
                            console.log(`Email ha sido enviado a ${ownerEmail} Por la eliminacion del producto: ${productName}`);
                        } catch (emailError) {
                            console.error("Error al enviar el correo electrónico de eliminación de producto:", emailError);
                        }
                    }
                    await Product.findOneAndDelete({ _id: deletedProduct._id });
                    this.removedProductId = deletedProduct._id;
                    return true;
                } else {
                    return false;
                }
            } else {
                console.error('ID o codigo invalido:', identifier);
                return false;
            }
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
    
getRemovedProductId() {
        return this.removedProductId;
    }
}
module.exports = ProductManager;
