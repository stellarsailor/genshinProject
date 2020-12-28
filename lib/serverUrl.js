const dev = process.env.NODE_ENV !== 'production';

export const serverUrl = dev ? process.env.NEXT_PUBLIC_LOCAL_SERVER : process.env.NEXT_PUBLIC_API_SERVER;