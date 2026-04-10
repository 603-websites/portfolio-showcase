"use client";

import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import {
  Facebook,
  Image as ImageIcon,
  Video,
  Download,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Unlink,
} from "lucide-react";

type Photo = {
  id: string;
  name?: string;
  images: Array<{ source: string; height: number; width: number }>;
  created_time: string;
};

type Video = {
  id: string;
  title?: string;
  description?: string;
  source: string;
  picture: string;
  created_time: string;
};

type ConnectionStatus = {
  connected: boolean;
  page_name?: string;
  page_id?: string;
  connected_at?: string;
};

export default function SocialPage() {
  const searchParams = useSearchParams();
  const justConnected = searchParams.get("connected") === "true";
  const connectError = searchParams.get("error");

  const [status, setStatus] = useState<ConnectionStatus | null>(null);
  const [tab, setTab] = useState<"photos" | "videos">("photos");
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [videos, setVideos] = useState<Video[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [mediaLoading, setMediaLoading] = useState(false);

  useEffect(() => {
    fetch("/api/facebook/status")
      .then((r) => r.json())
      .then(setStatus);
  }, [justConnected]);

  const fetchMedia = useCallback(
    async (after?: string) => {
      setMediaLoading(true);
      const params = new URLSearchParams({ type: tab });
      if (after) params.set("after", after);
      const res = await fetch(`/api/facebook/media?${params}`);
      const data = await res.json();
      if (data.error) {
        setMediaLoading(false);
        return;
      }
      if (tab === "photos") {
        setPhotos((prev) =>
          after ? [...prev, ...(data.data || [])] : data.data || []
        );
      } else {
        setVideos((prev) =>
          after ? [...prev, ...(data.data || [])] : data.data || []
        );
      }
      setNextCursor(data.paging?.cursors?.after || null);
      setMediaLoading(false);
    },
    [tab]
  );

  useEffect(() => {
    if (status?.connected) {
      setPhotos([]);
      setVideos([]);
      setNextCursor(null);
      fetchMedia();
    }
  }, [status?.connected, tab, fetchMedia]);

  async function disconnect() {
    if (!confirm("Disconnect Facebook page?")) return;
    setLoading(true);
    await fetch("/api/facebook/disconnect", { method: "POST" });
    setStatus({ connected: false });
    setLoading(false);
  }

  async function downloadFile(url: string, filename: string) {
    const res = await fetch(url);
    const blob = await res.blob();
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    a.click();
  }

  const currentItems = tab === "photos" ? photos : videos;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Social Media</h1>
        <p className="text-text-muted mt-1">
          Connect your Facebook page to browse and download photos and videos.
        </p>
      </div>

      {/* Status banner */}
      {justConnected && (
        <div className="flex items-center gap-3 p-4 bg-success/10 border border-success/30 rounded-xl">
          <CheckCircle className="w-5 h-5 text-success flex-shrink-0" />
          <p className="text-success text-sm font-medium">
            Facebook page connected successfully!
          </p>
        </div>
      )}
      {connectError && (
        <div className="flex items-center gap-3 p-4 bg-error/10 border border-error/30 rounded-xl">
          <AlertCircle className="w-5 h-5 text-error flex-shrink-0" />
          <p className="text-error text-sm font-medium">
            {connectError === "facebook_denied"
              ? "Facebook connection was cancelled."
              : connectError === "no_pages"
              ? "No Facebook pages found on your account. Make sure you manage at least one page."
              : "Something went wrong connecting Facebook. Please try again."}
          </p>
        </div>
      )}

      {/* Connection card */}
      <div className="bg-dark-light border border-dark-border rounded-xl p-6">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#1877F2]/15 flex items-center justify-content-center justify-center">
              <Facebook className="w-6 h-6 text-[#1877F2]" />
            </div>
            <div>
              <p className="font-semibold text-text">Facebook</p>
              {status?.connected ? (
                <p className="text-sm text-success">
                  Connected · {status.page_name}
                </p>
              ) : (
                <p className="text-sm text-text-muted">Not connected</p>
              )}
            </div>
          </div>
          {status?.connected ? (
            <button
              onClick={disconnect}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 text-sm text-text-muted hover:text-error border border-dark-border rounded-lg transition"
            >
              <Unlink className="w-4 h-4" />
              Disconnect
            </button>
          ) : (
            <a
              href="/api/facebook/connect"
              className="flex items-center gap-2 px-5 py-2.5 bg-[#1877F2] hover:bg-[#1665d8] text-white text-sm font-semibold rounded-lg transition"
            >
              <Facebook className="w-4 h-4" />
              Connect Facebook Page
            </a>
          )}
        </div>
      </div>

      {/* Media browser */}
      {status?.connected && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex gap-1 bg-dark-light border border-dark-border rounded-lg p-1">
              <button
                onClick={() => setTab("photos")}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition ${
                  tab === "photos"
                    ? "bg-accent text-white"
                    : "text-text-muted hover:text-text"
                }`}
              >
                <ImageIcon className="w-4 h-4" /> Photos
              </button>
              <button
                onClick={() => setTab("videos")}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition ${
                  tab === "videos"
                    ? "bg-accent text-white"
                    : "text-text-muted hover:text-text"
                }`}
              >
                <Video className="w-4 h-4" /> Videos
              </button>
            </div>
            <button
              onClick={() => fetchMedia()}
              disabled={mediaLoading}
              className="flex items-center gap-2 text-sm text-text-muted hover:text-text transition"
            >
              <RefreshCw className={`w-4 h-4 ${mediaLoading ? "animate-spin" : ""}`} />
              Refresh
            </button>
          </div>

          {mediaLoading && currentItems.length === 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="aspect-square bg-dark-lighter rounded-lg animate-pulse"
                />
              ))}
            </div>
          ) : currentItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-text-dim">
              {tab === "photos" ? (
                <ImageIcon className="w-12 h-12 mb-3" />
              ) : (
                <Video className="w-12 h-12 mb-3" />
              )}
              <p className="text-sm">No {tab} found on this page.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {tab === "photos"
                  ? (photos as Photo[]).map((photo) => {
                      const src =
                        photo.images?.find((img) => img.width >= 600)
                          ?.source || photo.images?.[0]?.source;
                      const best =
                        photo.images?.sort((a, b) => b.width - a.width)?.[0]
                          ?.source;
                      return (
                        <div
                          key={photo.id}
                          className="group relative aspect-square bg-dark-lighter rounded-lg overflow-hidden"
                        >
                          <img
                            src={src}
                            alt={photo.name || ""}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                            <button
                              onClick={() =>
                                downloadFile(
                                  best || src || "",
                                  `photo-${photo.id}.jpg`
                                )
                              }
                              className="flex items-center gap-2 bg-white text-black text-xs font-semibold px-3 py-2 rounded-lg hover:bg-gray-100 transition"
                            >
                              <Download className="w-3.5 h-3.5" />
                              Download
                            </button>
                          </div>
                        </div>
                      );
                    })
                  : (videos as Video[]).map((video) => (
                      <div
                        key={video.id}
                        className="group relative aspect-video bg-dark-lighter rounded-lg overflow-hidden"
                      >
                        <img
                          src={video.picture}
                          alt={video.title || ""}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex flex-col items-center justify-center gap-2 p-3">
                          {video.title && (
                            <p className="text-white text-xs text-center line-clamp-2 font-medium">
                              {video.title}
                            </p>
                          )}
                          <a
                            href={video.source}
                            download={`video-${video.id}.mp4`}
                            className="flex items-center gap-2 bg-white text-black text-xs font-semibold px-3 py-2 rounded-lg hover:bg-gray-100 transition"
                          >
                            <Download className="w-3.5 h-3.5" />
                            Download
                          </a>
                        </div>
                      </div>
                    ))}
              </div>

              {nextCursor && (
                <div className="flex justify-center pt-2">
                  <button
                    onClick={() => fetchMedia(nextCursor)}
                    disabled={mediaLoading}
                    className="px-6 py-2.5 bg-dark-light border border-dark-border text-sm font-medium rounded-lg hover:border-accent/50 transition disabled:opacity-50"
                  >
                    {mediaLoading ? "Loading..." : "Load More"}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
