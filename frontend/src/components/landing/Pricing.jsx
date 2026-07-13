import Button from "../ui/Button";
import Card from "../ui/Card";
import Container from "../ui/Container";
import Badge from "../ui/Badge";
import SectionTitle from "../ui/SectionTitle";

const plans = [
  {
    name: "Free",
    price: "$0",
    description: "Perfect for beginners and students.",
    features: [
      "Cloud IDE",
      "Basic AI",
      "Community",
      "Limited Hosting",
    ],
    button: "Start Free",
    variant: "secondary",
  },
  {
    name: "Pro",
    price: "$19",
    description: "For professional developers.",
    features: [
      "Unlimited IDE",
      "Advanced AI",
      "Unlimited Hosting",
      "Marketplace",
      "Analytics",
    ],
    button: "Upgrade",
    variant: "primary",
    featured: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "For companies and large teams.",
    features: [
      "Everything in Pro",
      "Dedicated Support",
      "Private Cloud",
      "Custom Integrations",
    ],
    button: "Contact Sales",
    variant: "outline",
  },
];

export default function Pricing() {
  return (
    <section className="py-24">

      <Container>

        <SectionTitle
          badge="Pricing"
          title="Simple Pricing"
          subtitle="Choose the plan that fits your needs."
        />

        <div className="grid gap-8 lg:grid-cols-3">

          {plans.map((plan) => (

            <Card
              key={plan.name}
              className={
                plan.featured
                  ? "border-blue-500"
                  : ""
              }
            >

              {plan.featured && (
                <Badge>
                  Most Popular
                </Badge>
              )}

              <h3 className="mt-6 text-2xl font-bold text-white">
                {plan.name}
              </h3>

              <p className="mt-2 text-slate-400">
                {plan.description}
              </p>

              <h2 className="mt-6 text-5xl font-extrabold text-blue-500">
                {plan.price}
              </h2>

              <ul className="mt-8 space-y-3">

                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    className="text-slate-300"
                  >
                    ✓ {feature}
                  </li>
                ))}

              </ul>

              <Button
                variant={plan.variant}
                className="mt-8 w-full"
              >
                {plan.button}
              </Button>

            </Card>

          ))}

        </div>

      </Container>

    </section>
  );
}

