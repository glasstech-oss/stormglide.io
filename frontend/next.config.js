/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    async rewrites() {
        return {
            fallback: [
                {
                    source: '/:path*',
                    destination: 'https://stormglideio.web.app/:path*',
                },
            ],
        }
    },
}

module.exports = nextConfig
