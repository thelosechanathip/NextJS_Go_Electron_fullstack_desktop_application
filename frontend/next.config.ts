/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // สำคัญมาก! บอกให้ Next.js build ออกมาเป็น html file
  images: {
    unoptimized: true, // ปิด Image Optimization เพราะไม่มี Server มา process รูป
  },
};

export default nextConfig;