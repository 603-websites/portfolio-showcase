"use client";

import { useEffect, useState } from "react";
import { Facebook, CheckCircle } from "lucide-react";

type Page = { id: string; name: string; picture?: { data: { url: string } } };

export default function PickPagePage() {
  const [pages, setPages] = useState<Page[]>([]);
  const [userId, setUserId] = useState("");
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    // Pages are passed via server action from cookie
    fetch("/api/facebook/pages")
      .then((r) => r.json())
      .then((d) => {
        setPages(d.pages || []);
        setUserId(d.userId || "");
      });
  }, []);

  async function connect(page: Page) {
    setSelected(page.id);
    setLoading(true);
    await fetch("/api/facebook/pages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pageId: page.id }),
    });
    window.location.href = "/client/social?connected=true";
  }

  return (
    <div className="max-w-lg mx-auto py-16 px-4">
      <div className="flex items-center gap-3 mb-8">
        <Facebook className="w-8 h-8 text-[#1877F2]" />
        <h1 className="text-2xl font-bold">Select Your Facebook Page</h1>
      </div>
      <p className="text-text-muted mb-8">
        We found multiple pages on your account. Choose which one to connect.
      </p>
      <div className="space-y-3">
        {pages.map((page) => (
          <button
            key={page.id}
            onClick={() => connect(page)}
            disabled={loading}
            className="w-full flex items-center gap-4 p-4 bg-dark-light border border-dark-border rounded-xl hover:border-accent/50 transition text-left"
          >
            {page.picture?.data?.url ? (
              <img
                src={page.picture.data.url}
                alt=""
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-[#1877F2]/20 flex items-center justify-center">
                <Facebook className="w-5 h-5 text-[#1877F2]" />
              </div>
            )}
            <div className="flex-1">
              <p className="font-medium text-text">{page.name}</p>
              <p className="text-xs text-text-muted">ID: {page.id}</p>
            </div>
            {selected === page.id && (
              <CheckCircle className="w-5 h-5 text-success" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
