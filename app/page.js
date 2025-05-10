import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function Home() {
  return (
    <div>
      <h1>Welcome to AI Recuiter Agent</h1>
      <p>
        This is a simple AI-powered recruitment agent built using Next.js, Tailwind CSS, and Geist UI.
      </p>
      <Button>
        <a href="https://github.com/joseph-pineda/ai-recuiter-agent">
          View the source code on GitHub
        </a>
      </Button>
    </div>
  );
}
