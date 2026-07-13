import Container from "../ui/Container";
import SectionTitle from "../ui/SectionTitle";
import Card from "../ui/Card";

export default function IDEPreview() {
  return (
    <section className="py-24">
      <Container>

        <SectionTitle
          title="Cloud IDE"
          subtitle="Develop from anywhere with a modern cloud workspace."
        />

        <Card>

          <div className="rounded-xl bg-slate-950 border border-slate-800 overflow-hidden">

            <div className="flex items-center gap-2 border-b border-slate-800 px-4 py-3">

              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>

              <span className="ml-4 text-sm text-slate-400">
                App.jsx
              </span>

            </div>

<pre className="p-6 text-sm text-green-400 overflow-x-auto">
{`export default function App() {
  return (
    <h1>
      Welcome to Quavron 🚀
    </h1>
  );
}`}
</pre>

          </div>

        </Card>

      </Container>
    </section>
  );
}

