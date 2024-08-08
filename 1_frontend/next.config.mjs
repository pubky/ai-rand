/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "getalby.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
