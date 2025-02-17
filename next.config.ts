/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  output: "standalone",
  async redirects() {
    return [
      {
        source: "/signup",
        destination: "/",
        permanent: false,
      },
    ];
  },
};

module.exports = nextConfig;
