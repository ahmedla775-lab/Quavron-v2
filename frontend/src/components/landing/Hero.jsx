import {
  ArrowRight,
  Code2,
  Sparkles,
  Cpu,
  Factory,
} from "lucide-react";

import { NavLink } from "react-router-dom";

import Button from "../ui/Button";
import Badge from "../ui/Badge";
import Container from "../ui/Container";


export default function Hero() {

  return (

    <section className="relative overflow-hidden py-24 lg:py-36">


      <Container>


        <div className="mx-auto max-w-5xl text-center">


          <Badge variant="primary">

            🚀 SARL QUAVRON — Technology & Engineering Ecosystem

          </Badge>



          <h1

            className="
              mt-8
              text-5xl
              font-extrabold
              leading-tight
              text-[var(--q-text)]
              md:text-7xl
            "

          >

            Building

            <span className="text-blue-500">

              {" "}The Future.

            </span>


            <br />


            Intelligence. Innovation. Industry.


          </h1>



          <p

            className="
              mx-auto
              mt-8
              max-w-4xl
              text-lg
              leading-8
              text-[var(--q-muted)]
            "

          >

            Quavron SARL develops advanced technology solutions
            through Artificial Intelligence, Digital Platforms,
            Engineering Systems and Future Industrial Innovation.


          </p>



          <div className="mt-10 flex flex-wrap justify-center gap-4">


            <NavLink to="/register">


              <Button size="lg">


                Join Quavron Ecosystem


                <ArrowRight size={18} />


              </Button>


            </NavLink>



            <NavLink to="/ide">


              <Button

                variant="outline"

                size="lg"

              >


                <Code2 size={18} />


                Open Platform


              </Button>


            </NavLink>


          </div>




          <div

            className="
              mt-14
              flex
              flex-wrap
              justify-center
              gap-8
              text-[var(--q-muted)]
            "

          >



            <div className="flex items-center gap-2">


              <Sparkles size={18} />


              Artificial Intelligence


            </div>




            <div className="flex items-center gap-2">


              <Code2 size={18} />


              Digital Platforms


            </div>





            <div className="flex items-center gap-2">


              <Factory size={18} />


              Future Industries


            </div>



          </div>



        </div>



      </Container>


    </section>

  );

}
