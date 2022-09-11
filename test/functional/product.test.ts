import { debug } from 'console'
import request from 'supertest'
import app from '../../src/index'

describe('Product', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let server: any
  beforeEach(async () => {
    server = app.listen(3015, () => {
      debug('Server listening on port 3015')
    })
  })

  afterEach(() => {
    server.close()
  })

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

      it('should return a status = 200', async () => {
        const response = await request(app).post('/api/product').send({ name: 'Keyboard'})
        console.log(response.body)
        expect(response.status).toBe(200)
        expect(response.body.name).toEqual('Keyboard')
      })
    })

    describe('PATCH - put product in stock', () => {
      it('should return a error because the stcok is required', async () => {
        const response = await request(app).post('api/product/1/stock')
        expect(response.status).toBe(400)
        expect(response.body.error).toEqual('Validation fails => Stock quantity is required')
      })

      it('should return a error because the productId is invalid', async () => {
        const response = await request(app).patch('/api/product/11/stock').send({ stock: 12 })
        expect(response.status).toBe(400)
        expect(response.body.error).toEqual('Product not found')
      })
    })
  })
})
