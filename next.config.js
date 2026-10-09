/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: [
    'tesseract.js',
    'tesseract.js-core',
    'bmp-js',
    'zlibjs',
    'is-url',
    'wasm-feature-detect',
  ],
  outputFileTracingIncludes: {
    '/api/**/*': [
      './node_modules/tesseract.js/**/*',
      './node_modules/tesseract.js-core/**/*',
      './node_modules/bmp-js/**/*',
      './node_modules/zlibjs/**/*',
      './node_modules/is-url/**/*',
      './node_modules/wasm-feature-detect/**/*',
    ],
  },
};

export default nextConfig;
