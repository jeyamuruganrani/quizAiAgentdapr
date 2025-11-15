export async function POST(request) {
  const body = await request.json();

  const payload = {
    operation: "post",
    data: body,
  };

  const res = await fetch("http://localhost:3600/v1.0/bindings/flowise-binding", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const json = await res.json();

  return new Response(JSON.stringify(json), {
    headers: { "Content-Type": "application/json" },
  });
}
