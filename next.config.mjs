/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Allow Tailscale access in development
  allowedDevOrigins: [
    'openclaws-mac-mini.tailcc5cde.ts.net',
    '100.87.151.56',
    'localhost',
    '127.0.0.1',
  ],
};

export default nextConfig;
