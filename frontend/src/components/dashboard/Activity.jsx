import Card from "../ui/Card";

const activities = [
  "Created a new project",
  "AI generated React component",
  "Deployment completed",
  "Marketplace package installed",
  "Community discussion joined",
];

export default function Activity() {
  return (
    <Card>

      <h2 className="mb-5 text-xl font-bold lg:text-2xl">
        Recent Activity
      </h2>

      <div className="space-y-3">

        {activities.map((activity, index) => (

          <div
            key={index}
            className="
              flex
              items-center
              gap-3
              rounded-2xl
              border
              border-slate-800
              bg-slate-900
              p-4
            "
          >

            <div
              className="
                h-3
                w-3
                rounded-full
                bg-blue-500
              "
            />

            <p className="text-sm text-slate-300">
              {activity}
            </p>

          </div>

        ))}

      </div>

    </Card>
  );
}
