import { getCollection } from 'astro:content';

export const prerender = true;

export async function GET() {
  const posts = await getCollection('blog');
  const guides = await getCollection('guides');

  const baseUrl = 'https://coffeebyratio.com';

  const staticRoutes = [
    '',
    '/about',
    '/calculator',
    '/contact',
    '/faqs',
    '/privacy-policy',
    '/temperature',
    '/terms-of-service',
    '/timer',
    '/yield',
    '/blog',
    '/guides',
    '/guides/hario-v60',
  ];

  // Helper to format date as YYYY-MM-DD
  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const pages = [
    ...staticRoutes.map(route => {
      let priority = '0.7';
      let changefreq = 'monthly';

      if (route === '') {
        priority = '1.0';
        changefreq = 'daily';
      } else if (
        route.includes('/calculator') || 
        route.includes('/timer') || 
        route.includes('/yield') || 
        route.includes('/temperature')
      ) {
        priority = '0.9';
        changefreq = 'weekly';
      } else if (route === '/blog' || route === '/guides') {
        priority = '0.8';
        changefreq = 'daily';
      }

      return {
        loc: `${baseUrl}${route}`,
        lastmod: formatDate(new Date()),
        changefreq,
        priority,
      };
    }),
    ...posts.map(post => ({
      loc: `${baseUrl}/blog/${post.id}`,
      lastmod: formatDate(post.data.updatedDate || post.data.pubDate),
      changefreq: 'monthly',
      priority: '0.8',
    })),
    ...guides.map(guide => ({
      loc: `${baseUrl}/guides/${guide.id}`,
      lastmod: formatDate(new Date()), // guides don't have update dates in frontmatter schema
      changefreq: 'weekly',
      priority: '0.8',
    })),
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages
  .map(
    page => `  <url>
    <loc>${page.loc}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`.trim();

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=0, must-revalidate',
    },
  });
}
