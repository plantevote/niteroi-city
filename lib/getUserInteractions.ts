import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Lista as últimas 20 interações de um usuário ordenadas por data (descendente)
 * @param userId - ID do usuário cujas interações serão listadas
 * @returns Lista de interações
 */
export async function getUserInteractions(userId: string) {
  return await prisma.consulta.findMany({
    where: {
      userId: userId,
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: 20,
  });
}
