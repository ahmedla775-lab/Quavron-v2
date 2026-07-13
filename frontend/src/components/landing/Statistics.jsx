import Container from "../ui/Container";
import SectionTitle from "../ui/SectionTitle";
import Card from "../ui/Card";

const stats = [
  {
    number: "100K+",
    title: "Developers"
  },
  {
    number: "25K+",
    title: "Projects"
  },
  {
    number: "1M+",
    title: "AI Requests"
  },
  {
    number: "99.9%",
    title: "Uptime"
  }
];

export default function Statistics() {
  return (
    <section className="py-24">
      <Container>

        <SectionTitle
          title="Quavron in Numbers"
          subtitle="Building the future of software development."
        />

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">

          {stats.map((item) => (
            <Card key={item.title}>

              <h2 className="text-5xl font-bold text-blue-500">
                {item.number}
              </h2>

              <p className="mt-4 text-slate-400">
                {item.title}
              </p>

            </Card>
          ))}

        </div>

      </Container>
    </section>
  );
}

