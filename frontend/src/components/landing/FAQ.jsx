import Card from "../ui/Card";
import Container from "../ui/Container";
import SectionTitle from "../ui/SectionTitle";

const questions = [
  {
    question: "What is Quavron?",
    answer:
      "Quavron is an all-in-one platform for developers that combines a Cloud IDE, AI Assistant, Courses, Hosting, Marketplace, Community and Analytics."
  },
  {
    question: "Do I need to install anything?",
    answer:
      "No. Quavron is cloud-based, so you can start coding directly from your browser."
  },
  {
    question: "Does Quavron include AI?",
    answer:
      "Yes. The built-in AI Assistant helps you write, explain, debug and improve your code."
  },
  {
    question: "Can I deploy my projects?",
    answer:
      "Yes. You can deploy your applications directly using Quavron Hosting."
  },
  {
    question: "Is there a free plan?",
    answer:
      "Yes. A free plan is available for students, beginners and personal projects."
  }
];

export default function FAQ() {
  return (
    <section className="py-24">

      <Container>

        <SectionTitle
          badge="FAQ"
          title="Frequently Asked Questions"
          subtitle="Everything you need to know before getting started."
        />

        <div className="space-y-6">

          {questions.map((item) => (

            <Card
              key={item.question}
              hover={false}
            >

              <h3 className="text-xl font-bold text-white">
                {item.question}
              </h3>

              <p className="mt-4 text-slate-400 leading-7">
                {item.answer}
              </p>

            </Card>

          ))}

        </div>

      </Container>

    </section>
  );
}

