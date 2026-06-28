export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  try {
    // Forward to backend API
    const backendUrl = new URL(
      `/v1/projects?${searchParams}`,
      process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'
    );

    const response = await fetch(backendUrl.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    const data = await response.json();
    return Response.json(data, { status: response.status });
  } catch (error) {
    console.error('API error:', error);
    return Response.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const backendUrl = new URL(
      '/v1/projects',
      process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'
    );

    const response = await fetch(backendUrl.toString(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
      credentials: 'include',
    });

    const data = await response.json();
    return Response.json(data, { status: response.status });
  } catch (error) {
    console.error('API error:', error);
    return Response.json(
      { error: 'Failed to create project' },
      { status: 500 }
    );
  }
}
