import { Bot, Sparkles } from "lucide-react";
import { useTranslation } from "react-i18next";

import Card from "../ui/Card";
import Button from "../ui/Button";

export default function AIWidget() {
  const { t } = useTranslation("dashboard");

  return (
    <Card>

      <div className="flex items-center gap-3">

        <div className="rounded-2xl bg-blue-600/20 p-3">

          <Bot
            size={26}
            className="text-blue-400"
          />

        </div>

        <div>

          <h2 className="text-xl font-bold lg:text-2xl">
            {t("aiAssistant")}
          </h2>

          <p className="text-sm text-slate-400">
            {t("aiSubtitle")}
          </p>

        </div>

      </div>

      <div
        className="
          mt-5
          rounded-2xl
          border
          border-slate-800
          bg-slate-900
          p-4
        "
      >

        <p className="leading-7 text-slate-300">
          {t("aiDescription")}
        </p>

      </div>

      <div
        className="
          mt-5
          flex
          flex-col
          gap-3

          sm:flex-row
        "
      >

        <Button className="w-full sm:w-auto">

          <Sparkles size={18} />

          {t("openAI")}

        </Button>

        <Button
          variant="outline"
          className="w-full sm:w-auto"
        >
          {t("history")}
        </Button>

      </div>

    </Card>
  );
}
