/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: 'export', // Statischer Export für GitHub Pages
  basePath: '/tft-espi-designer', // Repository-Name
};

export default nextConfig;
