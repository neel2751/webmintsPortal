export async function GET(request) {
  const users = [
    { id: 1, name: "Alice" },
    { id: 2, name: "Bob" },
  ];
  return new Response(JSON.stringify(users), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export async function POST(request) {
  const body = await request.json();
  const { name } = body;
  const newUser = {
    id: Date.now(),
    name,
  };
  return new Response(JSON.stringify(newUser), {
    status: 201,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
