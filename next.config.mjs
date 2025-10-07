/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // remove 'experimental.appDir' — não é mais necessário no Next 15
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;
