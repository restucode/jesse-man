// app/share/[data]/page.tsx
import { minikitConfig } from "../../../minikit.config";
import { Metadata } from "next";

type Props = {
  params: Promise<{ data: string }>;
};

// Fungsi ini akan dibaca oleh bot Farcaster untuk menampilkan preview
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const { data } = await params;
    // Parsing data dari URL (format: SKOR-STATUS, contoh: 1500-WON)
    const [score, status] = data.split('-');

    // Membuat URL gambar dinamis menggunakan homeUrl dari config
    const imageUrl = `${minikitConfig.miniapp.homeUrl}/api/og?score=${score}&status=${status}`;

    return {
      title: `Pac-Man Result: ${status}`,
      description: `I scored ${score} in Pac-Man!`,
      other: {
        "fc:miniapp": JSON.stringify({
          version: minikitConfig.miniapp.version,
          imageUrl: imageUrl,
          button: {
            title: "Play Pac-Man",
            action: {
              name: "Play Pac-Man",
              type: "launch_frame",
              url: minikitConfig.miniapp.homeUrl, // Link balik ke game utama
            },
          },
        }),
      },
    };
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : 'Unknown error';
    console.log(JSON.stringify({ 
      timestamp: new Date().toISOString(), 
      level: 'error', 
      message: 'Failed to generate metadata', 
      error: errorMessage 
    }));
    
    // Fallback metadata jika terjadi error parsing
    return {
      title: "Pac-Man Game",
      description: "Play Pac-Man on Farcaster",
    };
  }
}

export default async function SharePage({ params }: Props) {
  const { data } = await params;
  const [score] = data.split('-');
    
  // Tampilan sederhana jika manusia (bukan bot) membuka link ini langsung di browser
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      height: '100vh', 
      background: '#111', 
      color: 'white',
      fontFamily: 'monospace' 
    }}>
      <h1>SCORE: {score}</h1>
      <p>Redirecting to game...</p>
      
      {/* Menggunakan homeUrl dari config untuk tombol Play */}
      <a 
        href={minikitConfig.miniapp.homeUrl}
        style={{ 
          marginTop: 20, 
          padding: '10px 20px', 
          background: '#ffd700', 
          color: 'black', 
          textDecoration: 'none', 
          fontWeight: 'bold',
          borderRadius: 5
        }}
      >
        PLAY NOW
      </a>
    </div>
  );
}