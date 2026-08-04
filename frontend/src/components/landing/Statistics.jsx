import Container from "../ui/Container";
import SectionTitle from "../ui/SectionTitle";
import Card from "../ui/Card";


const stats = [

  {
    number: "11+",
    title: "Registered Business Activities"
  },

  {
    number: "8+",
    title: "Technology Divisions"
  },

  {
    number: "AI",
    title: "Intelligent Systems Development"
  },

  {
    number: "100Y",
    title: "Long-Term Innovation Vision"
  }

];



export default function Statistics() {

  return (

    <section className="py-24">


      <Container>


        <SectionTitle

          title="Quavron Vision in Numbers"

          subtitle="
          Building a technology, engineering and industrial ecosystem for the future.
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


          {stats.map((item) => (

            <Card key={item.title}>


              <h2

                className="
                  text-5xl
                  font-bold
                  text-[var(--q-primary)]
                "

              >

                {item.number}


              </h2>



              <p

                className="
                  mt-4
                  text-[var(--q-muted)]
                "

              >

                {item.title}


              </p>



            </Card>

          ))}


        </div>


      </Container>


    </section>

  );

}
