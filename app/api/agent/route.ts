import { redis } from '../../../lib/redis';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const runtime = 'edge';

export async function POST(req: Request) {
  const { prompt } = await req.json();

  // Tenta buscar no cache do Redis
  const cachedResponse = await redis.get(prompt);
  if (cachedResponse) {
    return new Response(JSON.stringify({ result: cachedResponse }), {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Caso não encontre no cache, chama a API do agente
  const response = await fetch('https://api.your-agent.com/generate', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.AGENT_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ prompt }),
  });

  const data = await response.json();

  // Salva a resposta no banco de dados
  await prisma.consulta.create({
    data: {
      pergunta: prompt,
      resposta: data.result,
    },
  });

  // Salva a resposta no cache do Redis
  await redis.set(prompt, data.result);

  return new Response(JSON.stringify({ result: data.result }), {
    headers: { 'Content-Type': 'application/json' },
  });
}
