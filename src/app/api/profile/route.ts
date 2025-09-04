export async function GET(request: Request)
{
    try {
        const auth = request.headers.get("authorization") || request.headers.get("Authorization");
        const token = auth?.startsWith("Bearer ") ? auth.slice(7) : undefined;

        if (token === "123") {
            const profile = {name: "Admin", email: "admin@example.com"};

            return new Response(JSON.stringify(profile), {
                status: 200,
                headers: {"Content-Type": "application/json"},
            });
        }

        return new Response("Unauthorized", {status: 401});
    } catch {
        return new Response("Bad Request", {status: 400});
    }
}
