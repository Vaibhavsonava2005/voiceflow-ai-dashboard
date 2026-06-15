export async function GET(request: Request) {
  try {
    const apiKey = process.env.DEEPGRAM_API_KEY || process.env.VITE_DEEPGRAM_API_KEY;

    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'Deepgram API key not configured' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // 1. Fetch the project ID
    const projectsResponse = await fetch('https://api.deepgram.com/v1/projects', {
      headers: {
        Authorization: `Token ${apiKey}`,
      },
    });

    if (!projectsResponse.ok) {
      return new Response(JSON.stringify({ error: 'Failed to fetch Deepgram projects' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const projectsData = await projectsResponse.json();
    const projectId = projectsData.projects[0]?.project_id;

    if (!projectId) {
      return new Response(JSON.stringify({ error: 'No Deepgram projects found' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // 2. Create a temporary key
    const keyResponse = await fetch(`https://api.deepgram.com/v1/projects/${projectId}/keys`, {
      method: 'POST',
      headers: {
        Authorization: `Token ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        comment: 'Temporary client token',
        scopes: ['usage:write'],
        time_to_live_in_seconds: 3600, // 1 hour
      }),
    });

    if (!keyResponse.ok) {
      return new Response(JSON.stringify({ error: 'Failed to generate temporary Deepgram token' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const keyData = await keyResponse.json();

    return new Response(JSON.stringify({ token: keyData.key }), {
      status: 200,
      headers: { 
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store'
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
