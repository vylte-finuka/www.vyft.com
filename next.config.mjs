/** @type {import('next').NextConfig} */
const nextConfig = {};

export default {
    ...nextConfig,
    logging: {
      fetches: {
        fullUrl: true,
      },
    },
  };