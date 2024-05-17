import { expect } from "chai";
import supertest from "supertest";

const requester = supertest('http://localhost:8080')
console.log(`Dirección de host: ${requester}`)

describe('Testing Products', () => {
    describe('Test de producto', async function() {
        this.timeout(10000)

        it('Testing de endpoint POST /api/users debe crear un producto correctamente', async function(){
            let mockProduct = {
                title: 'Producto 2',
                description: 'Descripción del producto 2',
                price: 146,
                code: 'abcede4567845698',
                stock: 95,
                category: "nuevos"
            }

            try {
                const resp = await requester.post('/api/products').send(mockProduct)
            console.log(resp.body)

            expect(resp.status).to.equal(201)
            expect(resp.body).to.have.property('_id')
            } catch (error) {
                console.error(error)
                throw error
            }

            
        })
    })
})