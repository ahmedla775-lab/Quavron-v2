import ProfilePosts from "./ProfilePosts";
import ProfileMedia from "./ProfileMedia";
import ProfileProjects from "./ProfileProjects";
import ProfileReels from "./ProfileReels";
import ProfileStories from "./ProfileStories";
import ProfileActivity from "./ProfileActivity";
import ProfileAbout from "./ProfileAbout";
import ProfileSaved from "./ProfileSaved";

export default function ProfileContent({
  tab,
  profile,
}) {

  switch (tab) {

    case "Posts":
      return (
        <ProfilePosts
          profile={profile}
        />
      );

    case "Media":
      return (
        <ProfileMedia
          profile={profile}
        />
      );

    case "Projects":
      return (
        <ProfileProjects
          profile={profile}
        />
      );

    case "Reels":
      return <ProfileReels />;

    case "Stories":
      return <ProfileStories />;

    case "Activity":
      return <ProfileActivity />;

    case "About":
      return (
        <ProfileAbout
          profile={profile}
        />
      );

    case "Saved":
      return (
        <ProfileSaved
          profile={profile}
        />
      );

    default:
      return (
        <ProfilePosts
          profile={profile}
        />
      );

  }

}
