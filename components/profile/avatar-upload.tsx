"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Camera, Loader2 } from "lucide-react";
import { uploadToBucket } from "@/lib/storage";
import { updateProfile } from "@/lib/data/actions";
import { initials } from "@/lib/utils";

export function AvatarUpload({
  userId,
  url,
  name,
  size = 96,
}: {
  userId: string;
  url: string | null;
  name: string | null;
  size?: number;
}) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onPick = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);
    if (file.size > 8 * 1024 * 1024) {
      setError("Imagem muito grande (máx. 8 MB).");
      return;
    }
    setBusy(true);
    const up = await uploadToBucket("avatars", file, userId);
    if (up.error || !up.url) {
      setError(up.error ?? "Falha no upload.");
      setBusy(false);
      return;
    }
    await updateProfile({ avatar_url: up.url });
    setBusy(false);
    router.refresh();
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="group relative rounded-full ring-2 ring-border transition-all hover:ring-primary"
        style={{ width: size, height: size }}
        aria-label="Trocar foto de perfil"
      >
        <span className="flex h-full w-full items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-primary to-secondary text-2xl font-bold text-white">
          {url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={url}
              alt={name ?? "avatar"}
              className="h-full w-full object-cover"
            />
          ) : (
            initials(name)
          )}
        </span>
        <span className="absolute inset-0 flex items-center justify-center rounded-full bg-black/55 opacity-0 transition-opacity group-hover:opacity-100">
          {busy ? (
            <Loader2 className="h-6 w-6 animate-spin text-white" />
          ) : (
            <Camera className="h-6 w-6 text-white" />
          )}
        </span>
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/jpg,image/gif,image/webp"
        className="hidden"
        onChange={onPick}
      />
      {error && <p className="text-xs text-danger">{error}</p>}
    </div>
  );
}
