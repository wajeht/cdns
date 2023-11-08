import { PrismaClient } from '@prisma/client';

declare global {
	var prisma: PrismaClient | undefined;
}

export const db =
	global.prisma ||
	new PrismaClient({
		log:
			process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'testing'
				? ['query', 'error', 'warn']
				: ['error'],
	});

if (process.env.NODE_ENV !== 'production') {
	global.prisma = prisma;
}
