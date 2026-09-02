/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    config.resolve.alias['@'] = path.resolve(__dirname, './src');
    config.resolve.alias['@shared'] = path.resolve(__dirname, '../shared');
    return config;
  },
};

module.exports = nextConfig;
