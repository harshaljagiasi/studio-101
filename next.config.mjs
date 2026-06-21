/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'xbhjegleqavecszkbnzg.supabase.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;