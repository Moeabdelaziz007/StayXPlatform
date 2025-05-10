import { QueryClient, QueryFunction } from "@tanstack/react-query";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    try {
      // Try to get response text
      const text = await res.text();
      // If response is HTML (likely an error page), provide a clearer message
      if (text.trim().startsWith('<!DOCTYPE') || text.trim().startsWith('<html')) {
        throw new Error(`Server error: ${res.status} ${res.statusText}. The server returned an HTML error page instead of JSON.`);
      }
      throw new Error(`${res.status}: ${text || res.statusText}`);
    } catch (innerError) {
      // If we can't read the response at all
      if (innerError instanceof Error && innerError.message !== '') {
        throw innerError;
      }
      throw new Error(`${res.status}: ${res.statusText}`);
    }
  }
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  const res = await fetch(url, {
    method,
    headers: data ? { "Content-Type": "application/json" } : {},
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
  });

  await throwIfResNotOk(res);
  return res;
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const res = await fetch(queryKey[0] as string, {
      credentials: "include",
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    
    try {
      return await res.json();
    } catch (error) {
      console.error("Failed to parse JSON response", error);
      
      // Try to log the response text for debugging
      try {
        // We need to clone the response since it was already consumed
        const clonedRes = res.clone();
        const text = await clonedRes.text();
        console.error("Response text that failed to parse:", text);
      } catch (e) {
        console.error("Could not get response text:", e);
      }
      
      throw new Error("Invalid JSON response from server");
    }
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
