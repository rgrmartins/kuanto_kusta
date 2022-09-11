import request from 'supertest'
import { app } from '../src/app'

describe('Product', () => {

  describe('Products Endpoints', () => {
    describe('POST - Create a new Produuct', () => {
      it('should return a error because the name is required', async () => {
        const response = await request(app).post('/api/product')
        expect(response.status).toBe(400)
        expect(response.body.error).toEqual('Validation fails => Name is required')
      })

      it('should return a error because the name already exists', async () => {
        await request(app).post('/api/product').send({ name: 'Computer'})
        const response = await request(app).post('/api/product').send({ name: 'Computer'})
        expect(response.status).toBe(400)
        expect(response.body.error).toEqual('Product already exists.')
      })

      it('should return a status = 200, because create a new product', async () => {
        const response = await request(app).post('/api/product').send({ name: 'Keyboard'})
        expect(response.status).toBe(200)
        expect(response.body.name).toEqual('Keyboard')
      })
    })

    describe('PATCH - put product in stock', () => {
      it('should return a error because the stock is required', async () => {
        const response = await request(app).patch('/api/product/1/stock')
        expect(response.status).toBe(400)
        expect(response.body.error).toEqual('Validation fails => Stock quantity is required')
      })

      it('should return a error because the productId is invalid', async () => {
        const response = await request(app).patch('/api/product/11/stock').send({ stock: 12 })
        expect(response.status).toBe(400)
        expect(response.body.error).toEqual('Product not found')
      })

      it('should return staus 200 - the product is in stock', async () => {
        const response = await request(app).patch('/api/product/1/stock').send({ stock: 12 })
        expect(response.status).toBe(200)
        expect(response.body.inStock).toEqual(12)
      })
    })

    describe('GET - Get Products Stock', () => {
      it('Should return a error becasue the pruductId is invalid', async () => {
        const response = await request(app).get('/api/product/11')

        expect(response.status).toBe(400)
        expect(response.body.error).toEqual('Product not found')
      })

      it('Should return status 200 - containing the stock information of this product', async () => {
        const response = await request(app).get('/api/product/1')

        expect(response.status).toBe(200)
        expect(response.body.IN_STOCK).toEqual(12)
        expect(response.body.RESERVED).toEqual(0)
        expect(response.body.SOLD).toEqual(0)
      })
    })

    describe('POST - Reserve a Product', () => {
      it('Should return a error because the product is invalid', async () => {
        const response = await request(app).post('/api/product/12/reserve')

        expect(response.status).toBe(400)
        expect(response.body.error).toEqual('Product not found')
      })

      it('Should return a error because the minimium quantity of the product it\'s smaller of 1', async () => {
        await request(app).patch('/api/product/1/stock').send({ stock: 0 })
        const response = await request(app).post('/api/product/1/reserve')

        expect(response.status).toBe(400)
        expect(response.body.error).toEqual('Insufficient minimum stock')
      })

      it('Should return status 200 - reserve of product done successfully', async () => {
        await request(app).patch('/api/product/1/stock').send({ stock: 12 })
        const response = await request(app).post('/api/product/1/reserve')

        expect(response.status).toBe(200)
        expect(response.body.reservationToken).toBeTruthy()
      })
    })

    describe('POST - Unreserve a Product', () => {
      it('Should return a error because the reservationToken is required', async () => {
        const response = await request(app).post('/api/product/12/unreserve')

        expect(response.status).toBe(400)
        expect(response.body.error).toEqual('Validation fails => reservationToken is required')
      })

      it('Should return a error because the productID is invalid', async () => {
        const reservationToken = await request(app).post('/api/product/1/reserve')
        const response = await request(app).post('/api/product/12/unreserve').send({ reservationToken: reservationToken.body.reservationToken })


        expect(response.status).toBe(400)
        expect(response.body.error).toEqual('Product not found')
      })

      it('Should return a error because the reservationToken is invalid', async () => {
        const response = await request(app).post('/api/product/1/unreserve').send({ reservationToken: '12321asa' })


        expect(response.status).toBe(404)
        expect(response.body.error).toEqual('Reserve Token or Product ID invalid')
      })

      it('Should return status 200 - unreserve of product done successfully', async () => {
        const reservationToken = await request(app).post('/api/product/1/reserve')
        const response = await request(app).post('/api/product/1/unreserve').send({ reservationToken: reservationToken.body.reservationToken })

        expect(response.status).toBe(200)
        expect(response.body).toBeTruthy()
        expect(response.body.message).toEqual('Unreserved done successfully.')
      })
    })

    describe('POST - Sold a Product', () => {
      it('Should return a error because the reservationToken is required', async () => {
        const response = await request(app).post('/api/product/1/sold')

        expect(response.status).toBe(400)
        expect(response.body.error).toEqual('Validation fails => reservationToken is required')
      })

      it('Should return a error because the productID is invalid', async () => {
        const reservationToken = await request(app).post('/api/product/1/reserve')
        const response = await request(app).post('/api/product/12/sold').send({ reservationToken: reservationToken.body.reservationToken })


        expect(response.status).toBe(400)
        expect(response.body.error).toEqual('Product not found')
      })

      it('Should return a error because the reservationToken is invalid', async () => {
        const response = await request(app).post('/api/product/1/sold').send({ reservationToken: '12321asa' })


        expect(response.status).toBe(404)
        expect(response.body.error).toEqual('Reserve Token or Product ID invalid')
      })

      it('Should return status 200 - Sold the product done successfully', async () => {
        const reservationToken = await request(app).post('/api/product/1/reserve')
        const response = await request(app).post('/api/product/1/sold').send({ reservationToken: reservationToken.body.reservationToken })

        expect(response.status).toBe(200)
        expect(response.body).toBeTruthy()
        expect(response.body.message).toEqual('Sold Product done successfully.')
      })
    })
  })
})
