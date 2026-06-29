/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // Imagens externas (capas de imóveis vindas das fontes de leilão) serão
    // adicionadas aqui em remotePatterns conforme a ingestão for implementada.
    remotePatterns: [],
  },
};

module.exports = nextConfig;
