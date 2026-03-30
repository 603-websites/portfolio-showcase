"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Plus, Trash2, Save, Loader2 } from "lucide-react";

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
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [clientId, setClientId] = useState<string | null>(null);

  const supabase = createClient();

  useEffect(() => {
    const load = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data: cu } = await supabase
        .from("client_users")
        .select("client_id")
        .eq("user_id", user.id)
        .single();
      if (!cu) return;
      setClientId(cu.client_id);

      const { data: content } = await supabase
        .from("website_content")
        .select("*")
        .eq("client_id", cu.client_id)
        .eq("content_type", "menu")
        .single();

      if (content?.content?.categories) {
        setCategories(content.content.categories);
      }
      setLoading(false);
    };
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSave = async () => {
    if (!clientId) return;
    setSaving(true);
    await supabase.from("website_content").upsert(
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
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-6 h-6 animate-spin text-accent" />
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
        <div className="flex items-center gap-3">
          {saved && <span className="text-success text-sm">Saved!</span>}
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
      </div>

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
