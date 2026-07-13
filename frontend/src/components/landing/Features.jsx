import {
  ShieldCheck,
  Cpu,
  Rocket,
  Globe,
  Lock,
  Zap,
} from "lucide-react";

import Card from "../ui/Card";
import Container from "../ui/Container";
import SectionTitle from "../ui/SectionTitle";

const features = [
  {
    icon: Cpu,
    title: "Modern Development",
    description:
      "Powerful cloud environment with the latest development tools.",
  },
  {
    icon: Rocket,
    title: "High Performance",
    description:
      "Fast loading, optimized builds and instant deployment.",
  },
  {
    icon: ShieldCheck,
    title: "Enterprise Security",
    description:
      "Authentication, permissions and encrypted infrastructure.",
  },
  {
    icon: Globe,
    title: "Global Platform",
    description:
      "Access your projects from anywhere in the world.",
  },
  {
    icon: Lock,
    title: "Private Workspaces",
    description:
      "Your code remains protected and securely stored.",
  },
  {
    icon: Zap,
    title: "AI Productivity",
    description:
      "Automate repetitive work and accelerate development.",
  },
];

export default function Features() {
  return (
    <section className="py-24">

      <Container>

        <SectionTitle
          badge="Features"
          title="Everything You Need To Build Faster"
          subtitle="Designed to help developers learn, create, deploy and grow from one integrated platform."
        />

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">

          {features.map((feature) => {

            const Icon = feature.icon;

            return (

              <Card key={feature.title}>

                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-blue-600/20">

                  <Icon
                    size={28}
                    className="text-blue-400"
                  />

                </div>

                <h3 className="text-xl font-bold text-white">

                  {feature.title}

                </h3>

                <p className="mt-3 text-slate-400">

                  {feature.description}

                </p>

              </Card>

            );

          })}

        </div>

      </Container>

    </section>
  );
}

