import {
  Code2,
  Bot,
  BookOpen,
  Users,
  ShoppingBag,
  Cloud,
  Briefcase,
  BarChart3,
} from "lucide-react";

import Card from "../ui/Card";
import Container from "../ui/Container";
import SectionTitle from "../ui/SectionTitle";

const services = [
  {
    icon: Code2,
    title: "Cloud IDE",
    description: "Develop directly from your browser with a powerful cloud workspace.",
  },
  {
    icon: Bot,
    title: "AI Assistant",
    description: "Generate, explain and improve your code using AI.",
  },
  {
    icon: BookOpen,
    title: "Courses",
    description: "Interactive programming courses from beginner to advanced.",
  },
  {
    icon: Users,
    title: "Community",
    description: "Collaborate, share projects and learn with other developers.",
  },
  {
    icon: ShoppingBag,
    title: "Marketplace",
    description: "Download templates, plugins and developer resources.",
  },
  {
    icon: Cloud,
    title: "Hosting",
    description: "Deploy your applications with one click.",
  },
  {
    icon: Briefcase,
    title: "Freelance",
    description: "Find freelance jobs and build your professional profile.",
  },
  {
    icon: BarChart3,
    title: "Analytics",
    description: "Track projects, users and performance with modern dashboards.",
  },
];

export default function PlatformCards() {
  return (
    <section className="py-24">
      <Container>

        <SectionTitle
          title="Everything Developers Need"
          subtitle="One ecosystem. One account. Unlimited possibilities."
        />

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">

          {services.map((service) => {
            const Icon = service.icon;

            return (
              <Card key={service.title}>

                <Icon
                  size={42}
                  className="text-blue-500"
                />

                <h3 className="mt-6 text-xl font-bold text-white">
                  {service.title}
                </h3>

                <p className="mt-4 text-slate-400">
                  {service.description}
                </p>

              </Card>
            );
          })}

        </div>

      </Container>
    </section>
  );
}

