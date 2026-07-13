import { ArrowRight, Code2, Sparkles } from "lucide-react";
import { NavLink } from "react-router-dom";

import Button from "../ui/Button";
import Badge from "../ui/Badge";
import Container from "../ui/Container";

export default function Hero() {
  return (
    <section className="relative overflow-hidden py-24 lg:py-36">

      <Container>

        <div className="mx-auto max-w-4xl text-center">

          <Badge variant="primary">
            🚀 Next Generation Developer Platform
          </Badge>

          <h1 className="mt-8 text-5xl font-extrabold leading-tight text-white md:text-7xl">

            Build.

            <span className="text-blue-500">
              {" "}Learn.
            </span>

            <br />

            Deploy.

          </h1>

          <p className="mx-auto mt-8 max-w-3xl text-lg leading-8 text-slate-400">

            Quavron combines a Cloud IDE, AI Assistant,
            Courses, Marketplace, Hosting,
            Community and Analytics into one modern platform.

          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-4">

            <NavLink to="/register">

              <Button size="lg">

                Get Started

                <ArrowRight size={18} />

              </Button>

            </NavLink>

            <NavLink to="/ide">

              <Button
                variant="outline"
                size="lg"
              >

                <Code2 size={18} />

                Open IDE

              </Button>

            </NavLink>

          </div>

          <div className="mt-14 flex flex-wrap justify-center gap-8 text-slate-400">

            <div className="flex items-center gap-2">

              <Sparkles size={18} />

              AI Powered

            </div>

            <div className="flex items-center gap-2">

              <Code2 size={18} />

              Cloud IDE

            </div>

            <div>

              ⚡ Fast Deployment

            </div>

          </div>

        </div>

      </Container>

    </section>
  );
}

