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
    title: "Digital Platform",
    description:
      "A modern technology platform combining development tools, cloud workspace and digital solutions.",
  },

  {
    icon: Bot,
    title: "Artificial Intelligence",
    description:
      "AI-powered systems for automation, development assistance and intelligent innovation.",
  },

  {
    icon: BookOpen,
    title: "Learning & Research",
    description:
      "Technology education, knowledge sharing and continuous skill development.",
  },

  {
    icon: Users,
    title: "Community",
    description:
      "A global environment for collaboration, innovation and professional networking.",
  },

  {
    icon: ShoppingBag,
    title: "Marketplace",
    description:
      "A digital economy connecting creators, developers and businesses.",
  },

  {
    icon: Cloud,
    title: "Cloud Infrastructure",
    description:
      "Scalable hosting and modern infrastructure for digital projects.",
  },

  {
    icon: Briefcase,
    title: "Professional Services",
    description:
      "Freelance opportunities and technology services for organizations.",
  },

  {
    icon: BarChart3,
    title: "Analytics",
    description:
      "Data-driven insights for products, projects and digital ecosystems.",
  },

];



export default function PlatformCards() {

  return (

    <section className="py-24">


      <Container>


        <SectionTitle

          title="Quavron Digital Ecosystem"

          subtitle="
          One company. Multiple technology solutions.
          Building the future through intelligence and innovation.
          "

        />



        <div

          className="
            grid
            gap-6
            md:grid-cols-2
            lg:grid-cols-4
          "

        >


          {services.map((service) => {


            const Icon = service.icon;



            return (

              <Card key={service.title}>


                <Icon

                  size={42}

                  className="text-[var(--q-primary)]"

                />



                <h3

                  className="
                    mt-6
                    text-xl
                    font-bold
                    text-[var(--q-text)]
                  "

                >

                  {service.title}


                </h3>



                <p

                  className="
                    mt-4
                    text-[var(--q-muted)]
                  "

                >

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
