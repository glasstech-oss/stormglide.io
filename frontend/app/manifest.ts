import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'Stormglide',
        short_name: 'Stormglide',
        description: 'Stormglide client portal and operations system.',
        start_url: '/',
        display: 'standalone',
        background_color: '#0B0F19',
        theme_color: '#1688FF',
        icons: [
            {
                src: '/icon.png',
                sizes: '512x512',
                type: 'image/png',
            },
        ],
    };
}
