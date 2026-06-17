import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'RECTOR Academy - Learn Solana Development';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  const titles: Record<string, string> = {
    en: 'Learn Solana Development',
    pt: 'Aprenda Desenvolvimento Solana',
    es: 'Aprende Desarrollo en Solana',
  };

  const subtitles: Record<string, string> = {
    en: 'Interactive courses with on-chain credentials',
    pt: 'Cursos interativos com credenciais on-chain',
    es: 'Cursos interactivos con credenciales on-chain',
  };

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#FFF7E1',
          backgroundImage:
            'radial-gradient(circle at 25% 25%, #41CFFF22 0%, transparent 50%), radial-gradient(circle at 75% 75%, #F9C84622 0%, transparent 50%)',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '24px',
          }}
        >
          <div
            style={{
              fontSize: '28px',
              fontWeight: 700,
              color: '#3B2C22',
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
            }}
          >
            RECTOR Academy
          </div>
          <div
            style={{
              fontSize: '56px',
              fontWeight: 800,
              color: '#3B2C22',
              textAlign: 'center',
              maxWidth: '900px',
              lineHeight: 1.2,
            }}
          >
            {titles[locale] ?? titles.en}
          </div>
          <div
            style={{
              fontSize: '24px',
              color: 'rgba(59, 44, 34, 0.7)',
              textAlign: 'center',
            }}
          >
            {subtitles[locale] ?? subtitles.en}
          </div>
          <div
            style={{
              display: 'flex',
              gap: '16px',
              marginTop: '16px',
            }}
          >
            {['Soulbound XP', 'NFT Credentials', 'Gamified Learning'].map((tag) => (
              <div
                key={tag}
                style={{
                  padding: '8px 20px',
                  borderRadius: '999px',
                  border: '1px solid rgba(59, 44, 34, 0.25)',
                  color: '#3B2C22',
                  fontSize: '16px',
                  fontWeight: 600,
                }}
              >
                {tag}
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
