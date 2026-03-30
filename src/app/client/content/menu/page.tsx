"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { AlertCircle, Plus, Trash2, Save, Loader2, UtensilsCrossed } from "lucide-react";
import toast from "react-hot-toast";
import SessionExpiredModal from "@/components/shared/SessionExpiredModal";

interface MenuItem {
  name: string;
  price: string;
  description: string;
  available: boolean;
}

interface Category {
  name: string;
  items: MenuItem[];
}

export default function MenuEditorPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [clientId, setClientId] = useState<string | null>(null);
  const [sessionExpired, setSessionExpired] = useState(false);

  const supabase = createClient();

  useEffect(() => {
    const load = async () => {
      try {
        const {
          data: { user },
          error: authError,
        } = await supabase.auth.getUser();

        // Item 2 — session expiry
        if (authError || !user) {
          setSessionExpired(true);
          setLoading(false);
          return;
        }

        const { data: cu, error: cuError } = await supabase
          .from("client_users")
          .select("client_id")
          .eq("user_id", user.id)
          .single();

        if (cuError || !cu) {
          setError("Failed to load your account.");
          setLoading(false);
          return;
        }
        setClientId(cu.client_id);

        const { data: content, error: contentError } = await supabase
          .from("website_content")
          .select("*")
          .eq("client_id", cu.client_id)
          .eq("content_type", "menu")
          .single();

        if (contentError && contentError.code !== "PGRST116") {
          setError("Failed to load menu content.");
          setLoading(false);
          return;
        }

        if (content?.content?.categories) {
          setCategories(content.content.categories);
        }
      } catch {
        setError("An unexpected error occurred.");
      } finally {
        setLoading(false);
      }
    };
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSave = async () => {
    if (!clientId) return;
    setSaving(true);
    const { error: saveError } = await supabase.from("website_content").upsert(
      {
        client_id: clientId,
        content_type: "menu",
        content: { categories },
        is_published: true,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "client_id,content_type" }
    );
    setSaving(false);
    if (saveError) {
      // Item 5 — error toast
      toast.error("Failed to save menu. Please try again.");
    } else {
      // Item 5 — success toast
      toast.success("Menu saved successfully!");
    }
  };

  const addCategory = () => {
    setCategories([...categories, { name: "New Category", items: [] }]);
  };

  const addItem = (catIndex: number) => {
    const updated = [...categories];
    updated[catIndex].items.push({
      name: "",
      price: "",
      description: "",
      available: true,
    });
    setCategories(updated);
  };

  const updateCategory = (index: number, name: string) => {
    const updated = [...categories];
    updated[index].name = name;
    setCategories(updated);
  };

  const updateItem = (
    catIndex: number,
    itemIndex: number,
    field: keyof MenuItem,
    value: string | boolean
  ) => {
    const updated = [...categories];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (updated[catIndex].items[itemIndex] as any)[field] = value;
    setCategories(updated);
  };

  const removeCategory = (index: number) => {
    setCategories(categories.filter((_, i) => i !== index));
  };

  const removeItem = (catIndex: number, itemIndex: number) => {
    const updated = [...categories];
    updated[catIndex].items = updated[catIndex].items.filter(
      (_, i) => i !== itemIndex
    );
    setCategories(updated);
  };

  // Item 2
  if (sessionExpired) return <SessionExpiredModal show />;

  // Item 1 — loading skeleton
  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="h-8 w-32 bg-dark-lighter rounded" />
            <div className="h-4 w-56 bg-dark-lighter rounded" />
          </div>
          <div className="h-10 w-24 bg-dark-lighter rounded-lg" />
        </div>
        {[1, 2].map((i) => (
          <div key={i} className="bg-dark-light border border-dark-border rounded-xl p-6 space-y-4">
            <div className="h-6 w-40 bg-dark-lighter rounded" />
            {[1, 2, 3].map((j) => (
              <div key={j} className="h-10 bg-dark-lighter rounded-lg" />
            ))}
          </div>
        ))}
      </div>
    );
  }

  // Item 1 — error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <AlertCircle className="w-10 h-10 text-error" />
        <p className="text-text-muted">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="bg-accent hover:bg-accent-hover text-white rounded-lg px-4 py-2 text-sm font-medium transition"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Edit Menu</h1>
          <p className="text-text-muted mt-1">
            Manage your menu categories and items
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-accent hover:bg-accent-hover text-white rounded-lg px-4 py-2.5 font-medium transition disabled:opacity-50 flex items-center gap-2"
        >
          {saving ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          Save
        </button>
      </div>

      {/* Item 1 — empty state */}
      {categories.length === 0 && (
        <div className="bg-dark-light border border-dark-border rounded-xl p-12 text-center space-y-3">
          <UtensilsCrossed className="w-12 h-12 text-text-dim mx-auto" />
          <h3 className="text-lg font-semibold text-text">No Menu Items Yet</h3>
          <p className="text-text-dim text-sm">
            Add your first category to start building your menu.
          </p>
        </div>
      )}

      {categories.map((cat, catIndex) => (
        <div
          key={catIndex}
          className="bg-dark-light border border-dark-border rounded-xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <input
              value={cat.name}
              onChange={(e) => updateCategory(catIndex, e.target.value)}
              className="text-lg font-semibold bg-transparent border-b border-transparent hover:border-dark-border focus:border-accent outline-none text-text"
            />
            <button
              onClick={() => removeCategory(catIndex)}
              className="text-text-dim hover:text-error transition"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-3">
            {cat.items.map((item, itemIndex) => (
              <div
                key={itemIndex}
                className="grid grid-cols-12 gap-3 items-center bg-dark-lighter rounded-lg p-3"
              >
                <input
                  value={item.name}
                  onChange={(e) =>
                    updateItem(catIndex, itemIndex, "name", e.target.value)
                  }
                  placeholder="Item name"
                  className="col-span-4 bg-dark border border-dark-border rounded-lg px-3 py-2 text-sm text-text placeholder-text-dim focus:border-accent outline-none"
                />
                <input
                  value={item.price}
                  onChange={(e) =>
                    updateItem(catIndex, itemIndex, "price", e.target.value)
                  }
                  placeholder="$0.00"
                  className="col-span-2 bg-dark border border-dark-border rounded-lg px-3 py-2 text-sm text-text placeholder-text-dim focus:border-accent outline-none"
                />
                <input
                  value={item.description}
                  onChange={(e) =>
                    updateItem(
                      catIndex,
                      itemIndex,
                      "description",
                      e.target.value
                    )
                  }
                  placeholder="Description"
                  className="col-span-4 bg-dark border border-dark-border rounded-lg px-3 py-2 text-sm text-text placeholder-text-dim focus:border-accent outline-none"
                />
                <label className="col-span-1 flex items-center justify-center">
                  <input
                    type="checkbox"
                    checked={item.available}
                    onChange={(e) =>
                      updateItem(
                        catIndex,
                        itemIndex,
                        "available",
                        e.target.checked
                      )
                    }
                    className="accent-accent"
                  />
                </label>
                <button
                  onClick={() => removeItem(catIndex, itemIndex)}
                  className="col-span-1 text-text-dim hover:text-error transition flex justify-center"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          <button
            onClick={() => addItem(catIndex)}
            className="mt-3 text-sm text-accent hover:underline flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" /> Add Item
          </button>
        </div>
      ))}

      <button
        onClick={addCategory}
        className="border border-dashed border-dark-border rounded-xl p-6 w-full text-text-dim hover:text-accent hover:border-accent transition flex items-center justify-center gap-2"
      >
        <Plus className="w-5 h-5" /> Add Category
      </button>
    </div>
  );
}
