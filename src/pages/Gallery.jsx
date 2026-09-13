import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getImages, getTravelBySlug } from "../services/api";
import ImageViewer from "../components/ImageViewer";
import Spinner from "../components/Spinner";
export default function Gallery() {
  const { slug } = useParams();
  const [t, setT] = useState(),
    [imgs, setImgs] = useState([]),
    [idx, setIdx] = useState(-1),
    [e, setE] = useState(""),
    [loading, setLoading] = useState(true);
  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setE("");
    setT(undefined);
    setImgs([]);
    getTravelBySlug(slug)
      .then((x) => {
        if (controller.signal.aborted) return;
        setT(x);
        return getImages(x.id);
      })
      .then((images) => {
        if (!controller.signal.aborted) setImgs(images);
      })
      .catch((x) => {
        if (!controller.signal.aborted) setE(x.message);
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [slug]);
  return (
    <main className="gallery">
      <Link to="/" className="back">
        ← All journeys
      </Link>
      {loading ? (
        <Spinner />
      ) : e ? (
        <div className="error">Error: {e}</div>
      ) : (
        t && (
          <>
            <small>TRAVEL JOURNAL</small>
            <h1>{t.title}</h1>
            <p>
              {t.description ||
                "A collection of photographs from this journey."}
            </p>
            <div className="photo-grid">
              {imgs.map((x, i) => (
                <button key={x.id} onClick={() => setIdx(i)}>
                  <img
                    src={x.thumbnailUrl || x.url}
                    alt={x.fileName}
                    loading="lazy"
                  />
                </button>
              ))}
            </div>
            <ImageViewer images={imgs} index={idx} setIndex={setIdx} />
          </>
        )
      )}
    </main>
  );
}
