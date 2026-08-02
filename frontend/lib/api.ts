const API_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");

const handleUnauthorized = (endpoint: string, token: string | null) => {
    if (!token || endpoint.startsWith("/auth/")) {
        return;
    }

    localStorage.removeItem("token");
    window.location.replace("/login?session=expired");
};

export async function apiRequest(
    endpoint: string,
    options: RequestInit = {}
) {
    if (!API_URL) {
        throw new Error("NEXT_PUBLIC_API_URL is not configured");
    }

    const token = localStorage.getItem("token");


    const response = await fetch(`${API_URL}${endpoint}`, {

        ...options,

        headers: {
            "Content-Type": "application/json",

            ...(token && {
                Authorization: `Bearer ${token}`
            }),

            ...options.headers,
        },

    });

    if (response.status === 401) {
        handleUnauthorized(endpoint, token);
    }

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
    }


    return data;
}
