import LearningLayout from "../components/layout/LearningLayout";
import LearningTopbar from "../components/navigation/LearningTopbar";
import LearningSidebar from "../components/navigation/LearningSidebar";

import LearningHome from "../components/home/LearningHome";
import LearningTabs from "../components/tabs/LearningTabs";

import LearningContent from "../components/pages/LearningContent";

import { LearningProvider } from "../context/LearningContext";

export default function Learning() {

  return (

    <LearningProvider>

      <LearningLayout>

        <LearningTopbar />

        <div className="mx-auto grid max-w-7xl gap-6 p-6 lg:grid-cols-[280px_1fr]">

          <LearningSidebar />

          <div className="space-y-6">

            <LearningHome />

            <LearningTabs />

            <LearningContent />

          </div>

        </div>

      </LearningLayout>

    </LearningProvider>

  );

}
