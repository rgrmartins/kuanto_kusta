import { PrismaClient } from '@prisma/client';
import { PutStock } from '../models/Stock';

const prisma = new PrismaClient({
  log: [{ emit: 'event', level: 'query'}],
});

/* --  Service Methods -- */
export async function upsertProductStock(putStock: PutStock) {
  return prisma.stock.upsert({
    where: {
      productId: putStock.productId,
    },
    update: {
      inStock: putStock.stock
    },
    create: {
      productId: putStock.productId,
      inStock: putStock.stock
    }
  })
}

export async function getProductStocks(productId: number) {
  return prisma.stock.findUnique({
    where: {
      productId: productId
    }
  })
}
