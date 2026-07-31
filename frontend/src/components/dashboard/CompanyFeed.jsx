import {
  Megaphone,
  Newspaper,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import { useEffect, useState } from "react";

import CompanyService from "../../services/CompanyService";
import { useTheme } from "../../theme/ThemeProvider";

const icons = {
  announcement: Megaphone,
  news: Newspaper,
  security: ShieldCheck,
  ai: Sparkles,
};

export default function CompanyFeed() {
  const { isDark } = useTheme();

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFeed();
  }, []);

  async function loadFeed() {
    try {
      const data = await CompanyService.getFeed();
      setPosts(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <section>
        <h2
          className="mb-6 text-2xl font-bold"
          style={{
            color: isDark ? "#fff" : "#111827",
          }}
        >
          Quavron Official
        </h2>

        <div
          className="rounded-2xl p-6"
          style={{
            background: isDark ? "#0f172a" : "#ffffff",
            border: `1px solid ${
              isDark ? "#1e293b" : "#e5e7eb"
            }`,
          }}
        >
          Loading...
        </div>
      </section>
    );
  }

  return (
    <section>

      <div className="mb-6">

        <h2
          className="text-2xl font-bold"
          style={{
            color: isDark ? "#fff" : "#111827",
          }}
        >
          Quavron Official
        </h2>

        <p
          style={{
            color: isDark ? "#94a3b8" : "#6b7280",
          }}
        >
          Official News & Announcements
        </p>

      </div>

      <div className="space-y-5">

        {posts.map((post) => {

          const Icon =
            icons[post.type] ?? Newspaper;

          return (

            <article
              key={post.id}
              className="rounded-2xl p-5 transition"
              style={{
                background: isDark ? "#0f172a" : "#ffffff",
                border: `1px solid ${
                  isDark ? "#1e293b" : "#e5e7eb"
                }`,
              }}
            >

              <div className="flex items-start gap-4">

                <div
                  className="rounded-xl p-3"
                  style={{
                    background: "#06b6d4",
                    color: "#fff",
                  }}
                >
                  <Icon size={22} />
                </div>

                <div className="flex-1">

                  <div
                    className="mb-1 text-xs font-semibold uppercase"
                    style={{
                      color: "#06b6d4",
                    }}
                  >
                    {post.type}
                  </div>

                  <h3
                    className="text-lg font-bold"
                    style={{
                      color: isDark ? "#fff" : "#111827",
                    }}
                  >
                    {post.title}
                  </h3>

                  <p
                    className="mt-2"
                    style={{
                      color: isDark ? "#94a3b8" : "#6b7280",
                    }}
                  >
                    {post.content}
                  </p>

                </div>

              </div>

            </article>

          );
        })}

      </div>

    </section>
  );
}
