import CourseCard from "../course/CourseCard";
export default function LearningFeed() {

  return (

    <section
  className="space-y-6 rounded-3xl border p-6"
  style={{
    background: "var(--q-surface)",
    borderColor: "var(--q-border)",
  }}
>

  <h2
    className="text-2xl font-bold"
    style={{
      color: "var(--q-text)",
    }}
  >
    Learning Feed
  </h2>

  <div className="grid gap-6 lg:grid-cols-2">

    <CourseCard />

    <CourseCard
      title="Business Management"
      instructor="Global Business Institute"
      category="Business"
      level="Intermediate"
      lessons={18}
      free={false}
    />

  </div>

</section>

  );

}
