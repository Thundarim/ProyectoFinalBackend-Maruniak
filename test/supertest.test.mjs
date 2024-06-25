import supertest from 'supertest';
import {expect} from 'chai';

import mongoose from 'mongoose';
const requester = supertest('http://localhost:8080');
import Product from '../src/dao/models/products.model.js';


describe("Testeo Api!", () => {
    before(async () => {
        await mongoose.connect('mongodb://localhost:27017/Ecommerce', { useNewUrlParser: true, useUnifiedTopology: true });
    });

    after(async () => {
        await mongoose.disconnect();
    });

    describe('POST /api/carts', function() {
        it('debería crear un nuevo carrito', async function() {
            try {
                const res = await requester.post('/api/carts').send();
                expect(res.status).to.equal(201);
                expect(res.body).to.have.property('_id');
            } catch (error) {
                console.error('Error en POST /api/carts:', error);
                throw error;
            }
        });
    });

    describe('POST /api/sessions/login', function() {
        it('deberia dar una cookie si el login es correcto', async function() {
            const loginData = {
                email: 'admin@ecom.com',
                password: 'superadmin'
            };
    
            try {
                const res = await requester.post('/api/sessions/login')
                    .set('Content-Type', 'application/json')
                    .send(JSON.stringify(loginData));
                    
                expect(res.status).to.equal(302);
    
                const cookies = res.headers['set-cookie'];
                expect(cookies).to.exist;
    
                const sessionCookie = cookies.find(cookie => cookie.startsWith('connect.sid='));
                expect(sessionCookie).to.exist;
                expect(sessionCookie).to.include('connect.sid=');
            } catch (error) {
                console.error('Error en POST /api/sessions/login:', error);
                throw error;
            }
        });
    
        it('deberia no dar una cookie si el login es incorrecto', async function() {
            const loginData = {
                email: 'emailfalso123@mail.com',
                password: 'passfea123'
            };
    
            try {
                const res = await requester.post('/api/sessions/login')
                    .set('Content-Type', 'application/json')
                    .send(JSON.stringify(loginData));
    
                expect(res.status).to.equal(400);
            } catch (error) {
                console.error('Error en POST /api/sessions/login:', error);
                throw error;
            }
        });
    });
    
    describe('POST /api/products', function() {
        it('debería crear un nuevo producto', async function() {
            const newProductData = {
                title: 'Producto de Prueba',
                description: 'Descripción del producto de prueba',
                img: 'http://example.com/image.jpg',
                price: 100,
                thumbnail: 'http://example.com/thumbnail.jpg',
                code: 'PRD12345',
                stock: 50,
                status: true,
                category: 'Categoría de Prueba',
                owner: 'admin'
            };

            try {
                const res = await requester.post('/api/products').send(newProductData);
                expect(res.status).to.equal(200);
                expect(res.body).to.have.property('message', 'Producto agregado correctamente');
                const product = await Product.findOne({ title: 'Producto de Prueba' });
                expect(product).to.not.be.null;
                expect(product).to.have.property('description', 'Descripción del producto de prueba');
                expect(product).to.have.property('img', 'http://example.com/image.jpg');
                expect(product).to.have.property('price', 100);
                expect(product).to.have.property('thumbnail', 'http://example.com/thumbnail.jpg');
                expect(product).to.have.property('code', 'PRD12345');
                expect(product).to.have.property('stock', 50);
                expect(product).to.have.property('status', true);
                expect(product).to.have.property('category', 'Categoría de Prueba');
                expect(product).to.have.property('owner', 'admin');
            } catch (error) {
                console.error('Error en POST /products:', error);
                throw error;
            }
        });
    });
});

