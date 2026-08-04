import DomainsPage from "./DomainsPage";
import { useLearning } from "../../context/LearningContext";

import LearningFeedPage from "./LearningFeedPage";
import ExplorePage from "./ExplorePage";
import EducatorsPage from "./EducatorsPage";

export default function LearningContent() {
  const { page } = useLearning();

  switch (page) {
    case "explore":
      return <ExplorePage />;

case "domains":
  return <DomainsPage />;

    case "educators":
      return <EducatorsPage />;

    case "feed":
    default:
      return <LearningFeedPage />;
  }
}
