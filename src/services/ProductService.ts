import { PrismaClient } from '@prisma/client';
import { Product } from '../models/Product';

const prisma = new PrismaClient({
  log: [{ emit: 'event', level: 'query'}],
});

/* --  Service Methods -- */
export async function getProductByName(name: string) {
  const nameSearch = {
    name: name
  }

  return prisma.product.findUnique({
    where: nameSearch
  })
}

export async function createProduct(name: string ): Promise<Product> {
  return prisma.product.create({
    data: { name: name }
  })
}

export async function getProductById(id: string) {
  return prisma.product.findUnique({
    where: {
      id: parseInt(id),
    },
  });
}
