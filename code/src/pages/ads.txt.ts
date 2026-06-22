export const prerender = true;

export async function GET() {
  const adClient = import.meta.env.PUBLIC_ADSENSE_CLIENT_ID || 'ca-pub-XXXXXXXXXXXXXXXX';
  // Strip "ca-" if present to get the publisher ID
  const publisherId = adClient.replace(/^ca-/, '');
  
  const content = `# Google AdSense Publisher Authorization File
# Dynamically compiled from PUBLIC_ADSENSE_CLIENT_ID env variable at build time
google.com, ${publisherId}, DIRECT, f08c47fec0942fa0
`;
  
  return new Response(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=0, must-revalidate',
    },
  });
}
