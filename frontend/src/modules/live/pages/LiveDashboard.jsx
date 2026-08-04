import { LIVE_LIMITS } from "../utils/liveLimits";
import { LIVE_PRICING } from "../utils/livePricing";

export default function LiveDashboard() {

  return (

    <div className="mx-auto max-w-6xl p-6">

      <h1 className="mb-8 text-3xl font-bold">
        Live Dashboard
      </h1>

      <div className="grid gap-6 lg:grid-cols-2">

        <div className="rounded-2xl border border-[var(--q-border)] bg-[var(--q-card)] p-6">

          <h2 className="mb-4 text-xl font-bold">
            Free Plan
          </h2>

          <ul className="space-y-2">

            <li>Concurrent Lives: {LIVE_LIMITS.FREE.maxConcurrentLives}</li>

            <li>Viewers: {LIVE_LIMITS.FREE.maxViewers}</li>

            <li>Minutes: {LIVE_LIMITS.FREE.maxMinutes}</li>

            <li>Bandwidth: {LIVE_LIMITS.FREE.maxBandwidthMB} MB</li>

            <li>
              Qualities:
              {" "}
              {LIVE_LIMITS.FREE.qualities.join(", ")}
            </li>

            <li>
              Price:
              {" "}
              {LIVE_PRICING.FREE.price} USD
            </li>

          </ul>

        </div>

        <div className="rounded-2xl border border-[var(--q-border)] bg-[var(--q-card)] p-6">

          <h2 className="mb-4 text-xl font-bold">
            Pro Plan
          </h2>

          <ul className="space-y-2">

            <li>Concurrent Lives: {LIVE_LIMITS.PRO.maxConcurrentLives}</li>

            <li>Viewers: {LIVE_LIMITS.PRO.maxViewers}</li>

            <li>Minutes: {LIVE_LIMITS.PRO.maxMinutes}</li>

            <li>Bandwidth: {LIVE_LIMITS.PRO.maxBandwidthMB} MB</li>

            <li>
              Qualities:
              {" "}
              {LIVE_LIMITS.PRO.qualities.join(", ")}
            </li>

            <li>
              Price:
              {" "}
              {LIVE_PRICING.PRO.price ?? "Custom"} USD
            </li>

          </ul>

        </div>

      </div>

    </div>

  );

}
