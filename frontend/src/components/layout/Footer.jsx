import Container from "../ui/Container";

export default function Footer() {
  return (
    <footer className="border-t border-slate-800 py-10 mt-24">
      <Container>

        <div className="flex flex-col md:flex-row justify-between items-center gap-4">

          <div>
            <h2 className="text-xl font-bold text-white">
              Quavron
            </h2>

            <p className="text-slate-400 mt-2">
              The complete ecosystem for developers.
            </p>
          </div>

          <div className="flex gap-6 text-slate-400">

            <a href="#">Docs</a>
            <a href="#">Community</a>
            <a href="#">Marketplace</a>
            <a href="#">Support</a>

          </div>

        </div>

      </Container>
    </footer>
  );
}

