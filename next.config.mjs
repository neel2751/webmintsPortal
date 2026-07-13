/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [
          // {
          //   key: "Access-Control-Allow-Origin",
          //   value: [
          //     process.env.MAIN_SITE_URL, // e.g., https://subdomain.vercel.app
          //     "http://localhost:3001", // allow this during local testing
          //     "https://webmints.com", // allow this during local testing
          //   ].join(", "),
          // },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET, POST, PUT, DELETE, OPTIONS",
          },
          {
            key: "Access-Control-Allow-Headers",
            value: "Content-Type, Authorization, x-api-key",
          },
        ],
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdcneel.s3.eu-west-2.amazonaws.com",
      },
    ],
  },
};

export default nextConfig;
