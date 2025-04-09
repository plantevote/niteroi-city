import { NextResponse } from 'next/server';

export async function middleware(req: Request) {
  const token = req.headers.get('Authorization');

  // Verifica se o token existe e é válido
  if (!token || token !== `Bearer ${process.env.VALID_TOKEN}`) {
    return new NextResponse(
      JSON.stringify({ error: 'Unauthorized' }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // Continua a requisição se o token for válido
  return NextResponse.next();
}

export const config = {
  // Define as rotas onde o middleware será aplicado
  matcher: '/api/:path*',
};
