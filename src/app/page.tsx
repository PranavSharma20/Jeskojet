import Navbar from "@/components/Navbar";
import HeroScroll from "@/components/HeroScroll";
import PlaneMorph from "@/components/PlaneMorph";
import Globe from "@/components/Globe";

export default function Home() {
  return (
    <main>
      <Navbar />
      <HeroScroll />
      <PlaneMorph />
      <Globe />
    </main>
  );
}
