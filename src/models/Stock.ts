export type Stock = {
  id: number
  productId: number
  inStock: number
  reserved?: number
  sold?: number
  createdAt: Date
  updatedAt: Date
}

export interface PutStock {
  productId: number
  stock: number
}
