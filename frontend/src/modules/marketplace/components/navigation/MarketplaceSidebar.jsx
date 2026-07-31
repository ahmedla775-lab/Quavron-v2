import {
  Building2,
  Landmark,
  UserRound,
  Megaphone,
  Truck,
  Package,
  ShoppingCart,
  Star,
} from "lucide-react";

import { NavLink } from "react-router-dom";
import { useTheme } from "../../../../theme/ThemeProvider";

const sections = [
  {
    title: "Marketplace",
    items: [
      { icon: Package, label: "Discover", path: "/marketplace" },
      { icon: Building2, label: "Companies", path: "/marketplace/companies" },
      { icon: Landmark, label: "Institutions", path: "/marketplace/institutions" },
      { icon: UserRound, label: "Individuals", path: "/marketplace/individuals" },
    ],
  },
  {
    title: "Commerce",
    items: [
      { icon: Truck, label: "Delivery", path: "/marketplace/delivery" },
      { icon: ShoppingCart, label: "Orders", path: "/marketplace/orders" },
      { icon: Star, label: "Featured", path: "/marketplace/featured" },
      { icon: Megaphone, label: "Quavron Ads", path: "/marketplace/ads" },
    ],
  },
];

export default function MarketplaceSidebar() {
  const { isDark } = useTheme();

  return (
    <aside
      className="w-full rounded-3xl border p-5 lg:w-72"
      style={{
        background: "var(--q-surface)",
        borderColor: "var(--q-border)",
      }}
    >
      <div className="mb-6">
        <h2
          className="text-xl font-black"
          style={{ color: "var(--q-text)" }}
        >
          Marketplace
        </h2>

        <p
          className="mt-1 text-sm"
          style={{ color: "var(--q-muted)" }}
        >
          Digital Business Ecosystem
        </p>
      </div>

      {sections.map((section) => (
        <div key={section.title} className="mb-8">
          <p
            className="mb-3 text-xs font-bold uppercase tracking-widest"
            style={{
              color: "#06b6d4",
            }}
          >
            {section.title}
          </p>

          <div className="space-y-2">
            {section.items.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-2xl px-4 py-3 transition-all ${
                      isActive ? "scale-[1.02]" : ""
                    }`
                  }
                  style={({ isActive }) => ({
                    background: isActive
                      ? "#06b6d4"
                      : "transparent",
                    color: isActive
                      ? "#ffffff"
                      : "var(--q-text)",
                  })}
                >
                  <Icon size={20} />
                  <span className="font-medium">
                    {item.label}
                  </span>
                </NavLink>
              );
            })}
          </div>
        </div>
      ))}

      <div
        className="rounded-2xl p-4"
        style={{
          background: isDark ? "#082f49" : "#ecfeff",
        }}
      >
        <p
          className="text-sm font-bold"
          style={{
            color: "#06b6d4",
          }}
        >
          Quavron Business
        </p>

        <p
          className="mt-2 text-sm"
          style={{
            color: "var(--q-text)",
          }}
        >
          Connect companies, institutions, professionals and customers through one unified marketplace.
        </p>
      </div>
    </aside>
  );
}
