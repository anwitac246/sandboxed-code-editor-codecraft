import { Navbar } from "@/components/layout/Navbar";
import { Hero } from "@/components/features/home/Hero";
import { BranchVisual } from "@/components/features/home/BranchVisual";
import { EditorMock } from "@/components/features/home/EditorMock";
import { Features } from "@/components/features/home/Features";
import { Footer } from "@/components/layout/Footer";
export default function Home() {
  return (
    <div className="min-h-screen bg-background">
          <Navbar />
          <Hero />
          <BranchVisual />
          <EditorMock />
          <Features />
          <Footer />
        </div>
  );
}
