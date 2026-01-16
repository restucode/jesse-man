// app/share/[data]/page.tsx
import { Metadata } from "next";

type Props = {
  params: { data: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // 1. Ekstrak skor dan status dari slug (format: "345-WON")
  const [score, status] = params.data.split("-");
  
  // 2. Arahkan URL gambar ke API OG dinamis Anda
  const baseUrl = process.env.NEXT_PUBLIC_HOME_URL || "https://jesse-man.vercel.app";
  const dynamicImageUrl = `${baseUrl}/api/og?score=${score}&status=${status}`;

  return {
    title: `Jesse-Man Score: ${score}`,
    openGraph: {
      images: [dynamicImageUrl],
    },
    other: {
      "fc:frame": JSON.stringify({
        version: "next", // Gunakan string "next" untuk Farcaster Frames v2
        imageUrl: dynamicImageUrl,
        button: {
          title: "Main Lagi!",
          action: {
            type: "launch_frame",
            name: "Jesse-Man Game",
            url: baseUrl, // Kembali ke halaman utama game
          },
        },
      }),
      // Support untuk Frames v1 (fallback)
      "fc:frame:image": dynamicImageUrl,
    },
  };
}

export default function SharePage({ params }: Props) {
  const [score, status] = params.data.split("-");

  return (
    <div style={{ 
      backgroundColor: "black", 
      color: "white", 
      height: "100vh", 
      display: "flex", 
      flexDirection: "column", 
      alignItems: "center", 
      justifyContent: "center",
      fontFamily: "monospace" 
    }}>
      <h1>PAC-MAN RESULT</h1>
      <h2 style={{ color: status === "WON" ? "#4ade80" : "#ef4444" }}>
        {status === "WON" ? "YOU WON!" : "GAME OVER"}
      </h2>
      <p style={{ fontSize: "2rem" }}>Score: {score}</p>
      <a href="/" style={{ color: "yellow", marginTop: "20px" }}>Mainkan Game</a>
    </div>
  );
}