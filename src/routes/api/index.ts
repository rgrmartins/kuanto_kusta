import { Router } from 'express'
import ProductController from '../../controllers/ProductController'

const router = Router()

/* ----- Product ------ */
/* -- Create a new Product -- */
router.post('/product', ProductController.create)

/* -- Upsert a Product in Stock -- */
router.patch('/product/:id/stock', ProductController.putProductStock)

/* -- Get Product Stocks -- */
router.get('/product/:id', ProductController.getProductStocks)

/* -- Reserve Product Stock -- */
router.post('/product/:id/reserve', ProductController.reserveProduct)

/* -- Unreserve Product Stock -- */
router.post('/product/:id/unreserve', ProductController.unreserveProduct)

/* -- Sold Product Stock -- */
router.post('/product/:id/sold', ProductController.soldProduct)

export default router
