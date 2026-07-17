import { useState } from "react";

export default function NotificationSettings() {

  const [settings, setSettings] = useState({

    emailNotifications: true,

    pushNotifications: true,

    desktopNotifications: true,

    newFollowers: true,

    likes: true,

    comments: true,

    mentions: true,

    messages: true,

    communityUpdates: true,

    securityAlerts: true,

    marketingEmails: false,

  });

  function toggle(key) {

    setSettings((prev) => ({

      ...prev,

      [key]: !prev[key],

    }));

  }

  function Item({

    title,

    description,

    value,

    onChange,

  }) {

    return (

      <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900 p-5">

        <div>

          <h3 className="font-semibold text-white">

            {title}

          </h3>

          <p className="mt-1 text-sm text-slate-400">

            {description}

          </p>

        </div>

        <button
          onClick={onChange}
          className={`h-7 w-14 rounded-full transition ${
            value
              ? "bg-blue-600"
              : "bg-slate-700"
          }`}
        >

          <div
            className={`h-6 w-6 rounded-full bg-white transition ${
              value
                ? "translate-x-7"
                : "translate-x-1"
            }`}
          />

        </button>

      </div>

    );

  }

  return (

    <div className="space-y-5">

      <Item
        title="Email Notifications"
        description="Receive notifications by email."
        value={settings.emailNotifications}
        onChange={() => toggle("emailNotifications")}
      />

      <Item
        title="Push Notifications"
        description="Receive mobile push notifications."
        value={settings.pushNotifications}
        onChange={() => toggle("pushNotifications")}
      />

      <Item
        title="Desktop Notifications"
        description="Receive browser notifications."
        value={settings.desktopNotifications}
        onChange={() => toggle("desktopNotifications")}
      />

      <Item
        title="New Followers"
        description="Notify when someone follows you."
        value={settings.newFollowers}
        onChange={() => toggle("newFollowers")}
      />

      <Item
        title="Likes"
        description="Notify when someone likes your posts."
        value={settings.likes}
        onChange={() => toggle("likes")}
      />

      <Item
        title="Comments"
        description="Notify when someone comments."
        value={settings.comments}
        onChange={() => toggle("comments")}
      />

      <Item
        title="Mentions"
        description="Notify when someone mentions you."
        value={settings.mentions}
        onChange={() => toggle("mentions")}
      />

      <Item
        title="Messages"
        description="Notify when receiving messages."
        value={settings.messages}
        onChange={() => toggle("messages")}
      />

      <Item
        title="Community Updates"
        description="News and platform updates."
        value={settings.communityUpdates}
        onChange={() => toggle("communityUpdates")}
      />

      <Item
        title="Security Alerts"
        description="Important account security alerts."
        value={settings.securityAlerts}
        onChange={() => toggle("securityAlerts")}
      />

      <Item
        title="Marketing Emails"
        description="Receive promotional emails."
        value={settings.marketingEmails}
        onChange={() => toggle("marketingEmails")}
      />

    </div>

  );

}
