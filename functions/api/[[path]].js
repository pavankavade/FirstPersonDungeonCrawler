export async function onRequest(context) {
    const { request } = context;
    const url = new URL(request.url);
  
    // Handle healthcheck endpoint
    if (url.pathname === "/api/healthcheck") {
      return new Response(
        JSON.stringify({
          status: "live",
          playersOnline: 42,
          timestamp: Date.now(),
        }),
        { headers: { "Content-Type": "application/json" } }
      );
    }
  
    // Handle other routes
    return new Response("Not Found", { status: 404 });
  }
   