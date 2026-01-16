import { minikitConfig } from "../../../minikit.config";
import { Metadata } from "next";

type Props = {
  params: Promise<{ data: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const { data } = await params;
    const [score, status] = data.split('-');

    // Pastikan homeUrl valid. Jika tidak, gambar tidak akan muncul.
    // const baseUrl = minikitConfig.miniapp.homeUrl;
    // const imageUrl = `${baseUrl}/api/og?score=${score}&status=${status}`;

    // return {
    //   title: `Pac-Man Result: ${status}`,
    //   description: `I scored ${score} in Pac-Man!`,
    //   other: {
    //     "fc:miniapp": JSON.stringify({
    //       version: minikitConfig.miniapp.version,
    //       imageUrl: imageUrl, // Ini yang dirender Farcaster
    //       button: {
    //         title: "Play Pac-Man",
    //         action: {
    //           name: "Play Pac-Man",
    //           type: "launch_frame",
    //           url: baseUrl, 
    //         },
    //       },
    //     }),
    //   },
    // };

    return {
      title: minikitConfig.miniapp.name,
      description: minikitConfig.miniapp.description,
      other: {
        "fc:miniapp": JSON.stringify({
          version: minikitConfig.miniapp.version,
          imageUrl: `${minikitConfig.miniapp.homeUrl}/api/og/?score=${score}&status=${status}`,
          button: {
            title: `Join the ${minikitConfig.miniapp.name}`,
            action: {
              name: `Launch ${minikitConfig.miniapp.name}`,
              type: "launch_frame",
              url: `${minikitConfig.miniapp.homeUrl}`,
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
    
    return {
      title: minikitConfig.miniapp.name,
      description: minikitConfig.miniapp.description,
    };
  }
}

export default async function SharePage({ params }: Props) {
  const { data } = await params;
  const [score] = data.split('-');
    
  return (
    <div style={{ 
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', 
      height: '100vh', background: '#111', color: 'white', fontFamily: 'monospace' 
    }}>
      <h1>SCORE: {score}</h1>
      <p>Redirecting to game...</p>
      
      <a 
        href={minikitConfig.miniapp.homeUrl}
        style={{ marginTop: 20, padding: '10px 20px', background: '#ffd700', color: 'black', textDecoration: 'none', fontWeight: 'bold', borderRadius: 5 }}
      >
        PLAY NOW
      </a>
    </div>
  );
}