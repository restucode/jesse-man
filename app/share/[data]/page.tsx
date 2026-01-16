import { Metadata } from "next";
import Link from "next/link";

type Props = {
  params: Promise<{ data: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  
  const [score, status] = resolvedParams.data.split("-");
  
  const baseUrl = process.env.NEXT_PUBLIC_HOME_URL || "https://jesse-man.vercel.app";
  const dynamicImageUrl = `${baseUrl}/api/og?score=${score}&status=${status}`;

  return {
    title: `Jesse-Man Score: ${score}`,
    openGraph: {
      title: `Jesse-Man Score: ${score}`,
      description: status === "WON" ? "I Won playing Jesse-Man!" : "Game Over!",
      images: [dynamicImageUrl],
    },
    other: {
      
      "fc:frame": JSON.stringify({
        version: "next",
        imageUrl: dynamicImageUrl,
        button: {
          title: "Play Again",
          action: {
            type: "launch_frame",
            name: "Jesse-Man",
            url: baseUrl,
            splashImageUrl: `${baseUrl}/splash.png`, 
            splashBackgroundColor: "#000000",
          },
        },
      }),
    },
  };
}

export default async function SharePage({ params }: Props) {

  const resolvedParams = await params;
  const [score, status] = resolvedParams.data.split("-");

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
      <h1>JESSE-MAN RESULT</h1>
      <h2 style={{ color: status === "WON" ? "#4ade80" : "#ef4444" }}>
        {status === "WON" ? "YOU WON!" : "GAME OVER"}
      </h2>
      <p style={{ fontSize: "2rem" }}>Score: {score}</p>
      <Link href="/" style={{ color: "yellow", marginTop: "20px", textDecoration: "underline" }}>
        Play Again
      </Link>
    </div>
  );
}