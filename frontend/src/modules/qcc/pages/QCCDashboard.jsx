import {
  Globe,
  FileText,
  Image,
  FolderOpen,
  Boxes,
  ShieldCheck,
} from "lucide-react";

import Card from "../../../components/ui/Card";
import QCCLayout from "../components/QCCLayout";

const modules = [
  {
    icon: Globe,
    title: "Homepage Builder",
    description:
      "Manage the public homepage, sections and corporate presentation.",
  },
  {
    icon: FileText,
    title: "Corporate Content",
    description:
      "Create and manage official company content and announcements.",
  },
  {
    icon: Image,
    title: "Media Library",
    description:
      "Store posters, images, videos and branding assets.",
  },
  {
    icon: FolderOpen,
    title: "Documents",
    description:
      "Manage brochures, PDFs and official company files.",
  },
  {
    icon: Boxes,
    title: "Products & Services",
    description:
      "Manage technology products, services and future solutions.",
  },
  {
    icon: ShieldCheck,
    title: "Security Center",
    description:
      "Control permissions, access and platform protection.",
  },
];

export default function QCCDashboard() {
  return (
    <QCCLayout>

      <div className="mx-auto max-w-7xl">

        <div className="mb-10">

          <h1
            className="
              text-4xl
              font-bold
              text-[var(--q-text)]
            "
          >
            Welcome to QCC
          </h1>

          <p
            className="
              mt-3
              max-w-3xl
              text-lg
              text-[var(--q-muted)]
            "
          >
            Quavron Control Center is the central management platform
            for your company's digital ecosystem.
          </p>

        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">

          {modules.map((item) => {

            const Icon = item.icon;

            return (

              <Card
                key={item.title}
                className="p-6"
              >

                <Icon
                  size={42}
                  className="text-[var(--q-primary)]"
                />

                <h2
                  className="
                    mt-6
                    text-xl
                    font-bold
                    text-[var(--q-text)]
                  "
                >
                  {item.title}
                </h2>

                <p
                  className="
                    mt-3
                    leading-7
                    text-[var(--q-muted)]
                  "
                >
                  {item.description}
                </p>

              </Card>

            );

          })}

        </div>

      </div>

    </QCCLayout>
  );
}
