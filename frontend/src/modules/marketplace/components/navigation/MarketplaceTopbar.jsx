import {
  Search,
  SlidersHorizontal,
  Bell,
  ShoppingCart,
  MapPin,
} from "lucide-react";

import { useTheme } from "../../../../theme/ThemeProvider";

export default function MarketplaceTopbar() {
  const { isDark } = useTheme();

  return (
    <header
      className="sticky top-0 z-40 mb-6 rounded-3xl border backdrop-blur-xl"
      style={{
        background: isDark
          ? "rgba(15,23,42,.88)"
          : "rgba(255,255,255,.90)",
        borderColor: "var(--q-border)",
      }}
    >
      <div className="flex flex-col gap-4 p-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex-1">
          <h1
            className="text-3xl font-black tracking-tight"
            style={{ color: "var(--q-text)" }}
          >
            Marketplace
          </h1>

          <p
            className="mt-2"
            style={{ color: "var(--q-muted)" }}
          >
            Discover companies, institutions, individuals and services in one organized marketplace.
          </p>
        </div>

        <div className="flex flex-1 items-center gap-3">
          <div
            className="flex flex-1 items-center gap-3 rounded-2xl border px-4 py-3"
            style={{
              background: "var(--q-surface)",
              borderColor: "var(--q-border)",
            }}
          >
            <Search size={20} color="#06b6d4" />

            <input
              type="text"
              placeholder="Search products, companies, services..."
              className="w-full bg-transparent outline-none"
              style={{
                color: "var(--q-text)",
              }}
            />
          </div>

          <button
            className="rounded-2xl p-3 transition hover:scale-105"
            style={{
              background: "#06b6d4",
              color: "#fff",
            }}
          >
            <SlidersHorizontal size={20} />
          </button>

          <button
            className="rounded-2xl p-3"
            style={{
              background: "var(--q-surface)",
              color: "var(--q-text)",
            }}
          >
            <MapPin size={20} />
          </button>

          <button
            className="rounded-2xl p-3"
            style={{
              background: "var(--q-surface)",
              color: "var(--q-text)",
            }}
          >
            <Bell size={20} />
          </button>

          <button
            className="rounded-2xl p-3"
            style={{
              background: "#1E88E5",
              color: "#fff",
            }}
          >
            <ShoppingCart size={20} />
          </button>
        </div>
      </div>
    </header>
  );
}
