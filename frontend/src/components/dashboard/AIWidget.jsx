import { Bot, Sparkles } from "lucide-react";
import { useTranslation } from "react-i18next";

import Card from "../ui/Card";
import Button from "../ui/Button";

export default function AIWidget() {

  const { t } = useTranslation("dashboard");

  return (

    <Card>

      <div className="flex items-center gap-3">

        <Bot
          size={32}
          className="text-blue-500"
        />

        <div>

          <h2 className="text-2xl font-bold text-white">
            {t("aiAssistant")}
          </h2>

          <p className="text-slate-400">
            {t("aiSubtitle")}
          </p>

        </div>

      </div>

      <div className="mt-8 rounded-xl border border-slate-800 bg-slate-900 p-5">

        <p className="leading-7 text-slate-300">

          {t("aiDescription")}

        </p>

      </div>

      <div className="mt-8 flex gap-4">

        <Button>

          <Sparkles size={18} />

          {t("openAI")}

        </Button>

        <Button variant="outline">

          {t("history")}

        </Button>

      </div>

    </Card>

  );

}
