import { Request, Response } from "express"
import { getProductStocks, upsertProductStock } from "../services/StockService";
import * as Yup from 'yup';
import { createProduct, getProductById, getProductByName } from '../services/ProductService'
import { getReserveByToken, reserveProduct, soldProduct, unreserveProduct } from "../services/BookingService";

class ProductController {
  async create(req: Request, res: Response) {
   try {
    const schema = Yup.object().shape({
      name: Yup.string().required()
    })

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails => Name is required' });
    }

    const { name } = req.body

    const productExists = await getProductByName(name)

    if (productExists) {
      return res.status(400).json({ error: 'Product already exists.' });
    }

    const product = await createProduct(name)

    return res.status(200).json(product)
  } catch (err) {
    return res.status(500).json({ error: 'Unable to create a product.' })
  }
  }

  async putProductStock(req: Request, res: Response) {
    try {
      const schema = Yup.object().shape({
        stock: Yup.number().required()
      })

      if (!(await schema.isValid(req.body))) {
        return res.status(400).json({ error: 'Validation fails => Stock quantity is required' });
      }

      const { stock } = req.body
      const { id: productId } = req.params

      const product = await getProductById(productId)

      if (!product) {
        return res.status(400).json({ error: 'Product not found' });
      }

      const stockUpsert = await upsertProductStock({ productId: parseInt(productId), stock })

      return res.status(200).json(stockUpsert)
    } catch (err) {
      return res.status(500).json({ error: 'Unable to put the product in stock.' })
    }
  }

  async getProductStocks(req: Request, res: Response) {
    try {
      const { id: productId } = req.params

      const product = await getProductById(productId)

      if (!product) {
        return res.status(400).json({ error: 'Product not found' });
      }

      const productStocks = await getProductStocks(parseInt(productId))

      if (!productStocks) {
        return res.status(404).json({ error: 'Product stocks not found' })
      }

      return res.status(200).json({
        IN_STOCK: productStocks.inStock,
        RESERVED: productStocks.reserved ? productStocks.reserved : 0 ,
        SOLD: productStocks.sold ? productStocks.sold : 0
      })
    } catch (err) {
      return res.status(500).json({ error: 'Unable to get the product stocks.' })
    }
  }

  async reserveProduct(req: Request, res: Response) {
    try {
      const { id: productId } = req.params

      const product = await getProductById(productId)

      if (!product) {
        return res.status(400).json({ error: 'Product not found' });
      }

      const productStocks = await getProductStocks(parseInt(productId))

      if (!productStocks) {
        return res.status(404).json({ error: 'Product stocks not found' })
      }

      if (productStocks.inStock < 1) {
        return res.status(400).json({ error: 'Insufficient minimum stock'})
      }

      const productsReserved = productStocks.reserved ? productStocks.reserved : 0

      const reserveProductStock = await reserveProduct(parseInt(productId), productStocks.inStock, productsReserved)

      return res.status(200).json({
        reservationToken: reserveProductStock.reservationToken
      })
    } catch (err) {
      return res.status(500).json({ error: 'Unable to reserve the product.' })
    }
  }

  async unreserveProduct(req: Request, res: Response) {
    try {
      const schema = Yup.object().shape({
        reservationToken: Yup.string().required()
      })

      if (!(await schema.isValid(req.body))) {
        return res.status(400).json({ error: 'Validation fails => reservationToken is required' });
      }

      const { reservationToken } = req.body
      const { id: productId } = req.params

      const product = await getProductById(productId)

      if (!product) {
        return res.status(400).json({ error: 'Product not found' });
      }

      const reserveProduct = await getReserveByToken(reservationToken, parseInt(productId))

      if (!reserveProduct) {
        return res.status(404).json({ error: 'Reserve Token or Product ID invalid' })
      }

      const productStocks = await getProductStocks(parseInt(productId))

      // Double Validation, but it will never happen
      const productsReserved = productStocks?.reserved ? productStocks.reserved : 0
      const productInStock = productStocks?.inStock ? productStocks.inStock : 0

      await unreserveProduct(parseInt(productId), reservationToken, productInStock, productsReserved)

      return res.status(200).json({
        message: 'Unreserved done successfully.'
      })
    } catch (err) {
      return res.status(500).json({ error: 'Unable to Unreserve the product.' })
    }
  }

  async soldProduct(req: Request, res: Response) {
    try {
      const schema = Yup.object().shape({
        reservationToken: Yup.string().required()
      })

      if (!(await schema.isValid(req.body))) {
        return res.status(400).json({ error: 'Validation fails => reservationToken is required' });
      }

      const { reservationToken } = req.body
      const { id: productId } = req.params

      const product = await getProductById(productId)

      if (!product) {
        return res.status(400).json({ error: 'Product not found' });
      }

      const reserveProduct = await getReserveByToken(reservationToken, parseInt(productId))

      if (!reserveProduct) {
        return res.status(404).json({ error: 'Reserve Token or Product ID invalid' })
      }

      const productStocks = await getProductStocks(parseInt(productId))

      // Double Validation, but it will never happen
      const productsReserved = productStocks?.reserved ? productStocks.reserved : 0
      const productSold = productStocks?.sold ? productStocks.sold : 0

      await soldProduct(parseInt(productId), reservationToken, productsReserved, productSold)

      return res.status(200).json({
        message: 'Sold Product done successfully.'
      })
    } catch (err) {
      return res.status(500).json({ error: 'Unable to sold the product.' })
    }
  }
}

export default new ProductController()
