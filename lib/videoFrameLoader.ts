const FRAME_COUNT = 120;
const VIDEO_SRC   = "/Videos/Produkt.mp4";

type ProgressCb = (pct: number) => void;

let cachedPromise: Promise<ImageBitmap[]> | null = null;
const progressListeners: Set<ProgressCb> = new Set();
let currentPct = 0;

export function getFrameCount() {
  return FRAME_COUNT;
}

export function onProgress(cb: ProgressCb): () => void {
  progressListeners.add(cb);
  // immediately fire current progress if already loading
  if (currentPct > 0) cb(currentPct);
  return () => progressListeners.delete(cb);
}

export function preloadFrames(): Promise<ImageBitmap[]> {
  if (cachedPromise) return cachedPromise;

  cachedPromise = (async () => {
    const video = document.createElement("video");
    video.src         = VIDEO_SRC;
    video.muted       = true;
    video.playsInline = true;
    video.crossOrigin = "anonymous";
    video.preload     = "auto";
    video.load();

    await new Promise<void>((res) => {
      if (video.readyState >= 1) { res(); return; }
      video.addEventListener("loadedmetadata", () => res(), { once: true });
    });

    const duration = video.duration;
    const frames: ImageBitmap[] = [];

    for (let i = 0; i < FRAME_COUNT; i++) {
      video.currentTime = (i / (FRAME_COUNT - 1)) * duration;
      await new Promise<void>((res) =>
        video.addEventListener("seeked", () => res(), { once: true })
      );
      frames.push(await createImageBitmap(video));
      currentPct = Math.round(((i + 1) / FRAME_COUNT) * 100);
      progressListeners.forEach((cb) => cb(currentPct));
    }

    return frames;
  })();

  return cachedPromise;
}
