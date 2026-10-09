/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['tesseract.js', 'tesseract.js-core'],
  outputFileTracingIncludes: {
    '/api/webhook/telegram': [
      './node_modules/tesseract.js/**/*',
      './node_modules/tesseract.js-core/**/*',
    ],
  },
};

export default nextConfig;
