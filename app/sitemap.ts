export default async function sitemap() {
  return [
    {
      url: 'https://recordatorios.vercel.app',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: 'https://recordatorios.vercel.app/lista',
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 0.9,
    },
    {
      url: 'https://recordatorios.vercel.app/calendario',
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 0.8,
    },
    {
      url: 'https://recordatorios.vercel.app/crear',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: 'https://recordatorios.vercel.app/registro',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.7,
    },
    {
      url: 'https://recordatorios.vercel.app/ajustes',
      lastModified: new Date(),
      changeFrequency: 'never',
      priority: 0.6,
    },
    {
      url: 'https://recordatorios.vercel.app/guia',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ];
}
