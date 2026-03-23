/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
  reactStrictMode: true,
  // Parent folder also has package-lock.json; pin Turbopack to this app root.
  turbopack: {
    root: path.join(__dirname),
  },
};

module.exports = nextConfig;
