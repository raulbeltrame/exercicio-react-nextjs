import Image from "next/image";
import Noticias from "./pages/noticias/noticias";
export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Noticias/>
    </main>
  );
}
