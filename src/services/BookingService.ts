import { PrismaClient } from '@prisma/client';
import { Booking } from '../models/Booking';

const prisma = new PrismaClient({
  log: [{ emit: 'event', level: 'query'}],
});

/* --  Service Methods -- */
export async function reserveProduct(productId: number, inStock: number, reserved: number): Promise<Booking> {
  const [booking] = await prisma.$transaction([
    prisma.booking.create({
      data: { productId }
    }),
    prisma.stock.update({
      where: { productId },
      data: { inStock: (inStock - 1), reserved: (reserved + 1) }
    })
  ])

  return booking
}

export async function getReserveByToken(reservationToken: string, productId: number) {
  return prisma.booking.findFirst({
    where: {
      reservationToken,
      productId: productId
    }
  })
}

export async function unreserveProduct(productId: number, reservationToken: string, inStock: number, reserved: number): Promise<void> {
  await prisma.$transaction([
    prisma.booking.delete({
      where: { reservationToken }
    }),
    prisma.stock.update({
      where: { productId },
      data: { inStock: (inStock + 1), reserved: (reserved - 1) }
    })
  ])
}

export async function soldProduct(productId: number, reservationToken: string, reserved: number, sold: number) {
  await prisma.$transaction([
    prisma.booking.delete({
      where: { reservationToken }
    }),
    prisma.stock.update({
      where: { productId },
      data: { sold: (sold + 1), reserved: (reserved - 1) }
    })
  ])
}
