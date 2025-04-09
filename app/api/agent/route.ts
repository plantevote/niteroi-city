export const runtime = 'edge';

export async function POST(req: Request) {
  const { prompt } = await req.json();
  
  const response = await fetch('https://api.your-agent.com/generate', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.AGENT_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ prompt })
  });

  const data = await response.json();

  return new Response(JSON.stringify({ result: data.result }), {
    headers: { 'Content-Type': 'application/json' }
  });
}
