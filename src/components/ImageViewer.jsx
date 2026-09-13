import { useEffect, useState } from "react";
import {
  X,
  ChevronLeft,
  ChevronRight,
  Plus,
  Minus,
  RotateCcw,
} from "lucide-react";

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

export default function ImageViewer({ images, index, setIndex }) {
  const [zoom, setZoom] = useState(1);

  useEffect(() => {
    setZoom(1);
  }, [index]);

  if (index < 0) return null;

  const x = images[index];

  const zoomIn = () =>
    setZoom((current) => clamp(Number((current + 0.2).toFixed(2)), 1, 3));
  const zoomOut = () =>
    setZoom((current) => clamp(Number((current - 0.2).toFixed(2)), 1, 3));
  const resetZoom = () => setZoom(1);

  const handleWheel = (event) => {
    event.preventDefault();
    if (event.deltaY < 0) {
      zoomIn();
    } else {
      zoomOut();
    }
  };

  return (
    <div className="viewer" onClick={() => setIndex(-1)}>
      <div className="viewer-shell" onClick={(e) => e.stopPropagation()}>
        <div className="viewer-toolbar">
          <div className="zoom-controls">
            <button type="button" aria-label="Zoom out" onClick={zoomOut}>
              <Minus size={18} />
            </button>
            <button type="button" aria-label="Reset zoom" onClick={resetZoom}>
              <RotateCcw size={18} />
            </button>
            <button type="button" aria-label="Zoom in" onClick={zoomIn}>
              <Plus size={18} />
            </button>
          </div>
          <button
            type="button"
            className="close"
            aria-label="Close image viewer"
            onClick={() => setIndex(-1)}
          >
            <X size={20} />
          </button>
        </div>

        <button
          type="button"
          className="prev"
          aria-label="Previous image"
          onClick={(e) => {
            e.stopPropagation();
            setIndex((index - 1 + images.length) % images.length);
          }}
        >
          <ChevronLeft size={26} />
        </button>

        <img
          src={x.url}
          alt={x.fileName}
          onWheel={handleWheel}
          style={{ transform: `scale(${zoom})` }}
        />

        <button
          type="button"
          className="next"
          aria-label="Next image"
          onClick={(e) => {
            e.stopPropagation();
            setIndex((index + 1) % images.length);
          }}
        >
          <ChevronRight size={26} />
        </button>
      </div>
    </div>
  );
}
