import Container from "../ui/Container";
import SectionTitle from "../ui/SectionTitle";
import Card from "../ui/Card";

export default function AIPreview() {
  return (
    <section className="py-24">
      <Container>

        <SectionTitle
          title="AI Assistant"
          subtitle="Ask questions, generate code and debug instantly."
        />

        <Card>

          <div className="space-y-4">

            <div className="rounded-xl bg-slate-800 p-4">
              <p className="text-slate-300">
                👤 Create a responsive login page using React.
              </p>
            </div>

            <div className="rounded-xl bg-blue-600/20 p-4 border border-blue-500">
              <p className="text-blue-300">
                🤖 Done! Login page created with responsive layout,
                validation and modern UI.
              </p>
            </div>

          </div>

        </Card>

      </Container>
    </section>
  );
}

