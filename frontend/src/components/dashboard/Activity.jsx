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

      <h2 className="mb-6 text-2xl font-bold text-white">
        Recent Activity
      </h2>

      <div className="space-y-4">

        {activities.map((activity, index) => (

          <div
            key={index}
            className="rounded-xl border border-slate-800 bg-slate-900 p-4"
          >

            <p className="text-slate-300">

              {activity}

            </p>

          </div>

        ))}

      </div>

    </Card>
  );
}

