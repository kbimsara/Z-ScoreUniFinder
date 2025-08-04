/** @type {import('next').NextConfig} */
   const nextConfig = {
     reactStrictMode: true,
     swcMinify: true,
     async headers() {
       return [
         {
           source: '/:path*',
           headers: [
             {
               key: 'Access-Control-Allow-Origin',
               value: 'http://localhost:3000',
             },
           ],
         },
       ];
     },
   };

   export default nextConfig;