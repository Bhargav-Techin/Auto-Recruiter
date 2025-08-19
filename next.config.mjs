/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['lh3.googleusercontent.com'],
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/auth',
        permanent: true, // or false if you want a temporary redirect
      },
    ];
  },
};

export default nextConfig;
