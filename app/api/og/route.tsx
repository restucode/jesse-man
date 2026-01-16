import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  
  const score = searchParams.get('score') || '0';
  const status = searchParams.get('status') || 'PLAYING';

  const isWin = status === 'WON';
  const title = isWin ? 'YOU WON!' : 'GAME OVER';
  const titleColor = isWin ? '#4ade80' : '#ef4444'; 

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
          backgroundColor: '#000000',
          color: 'white',
          fontFamily: 'monospace',
          border: '20px solid #222',
        }}
      >
        <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
            backgroundImage: 'radial-gradient(circle, #333 2px, transparent 2px)',
            backgroundSize: '40px 40px', opacity: 0.3, zIndex: -1
        }} />

        <div style={{ fontSize: 80, fontWeight: 'bold', color: '#ffd700', marginBottom: 20, textShadow: '0 0 20px rgba(255, 215, 0, 0.5)' }}>
          JESSE-MAN
        </div>

        <div style={{ fontSize: 60, fontWeight: 'bold', color: titleColor, marginBottom: 40, textTransform: 'uppercase' }}>
          {title}
        </div>

        <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            backgroundColor: '#111', padding: '20px 60px', borderRadius: 20, border: '4px solid #444'
        }}>
            <span style={{ fontSize: 30, color: '#aaa', marginBottom: 10 }}>FINAL SCORE</span>
            <span style={{ fontSize: 90, fontWeight: 'bold', color: 'white' }}>{score}</span>
        </div>
      </div>
    ),
    { width: 1200, height: 630, headers: {'Cache-Control': 'public, max-age=31536000, s-maxage=31536000, stale-while-revalidate',}},
  );
}