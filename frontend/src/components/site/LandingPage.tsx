import { Nav } from "./Nav";
import { Hero } from "./Hero";
import { Problem } from "./Problem";
import { Workflow } from "./Workflow";
import { Capabilities } from "./Capabilities";
import { Explainability } from "./Explainability";
import { Evaluation } from "./Evaluation";
import { Architecture } from "./Architecture";
import { Trust } from "./Trust";
import { FinalCta } from "./FinalCta";
import { Footer } from "./Footer";

interface LandingPageProps {
  onLaunchDemo: () => void;
  onViewEvaluation: () => void;
}

export default function LandingPage({ onLaunchDemo, onViewEvaluation }: LandingPageProps) {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-background text-foreground">
      <Nav onLaunchDemo={onLaunchDemo} onViewEvaluation={onViewEvaluation} />
      <main>
        <Hero onLaunchDemo={onLaunchDemo} />
        <Problem />
        <Workflow />
        <Capabilities />
        <Explainability />
        <Evaluation onViewEvaluation={onViewEvaluation} />
        <Architecture />
        <Trust />
        <FinalCta onLaunchDemo={onLaunchDemo} />
      </main>
      <Footer />
    </div>
  );
}
