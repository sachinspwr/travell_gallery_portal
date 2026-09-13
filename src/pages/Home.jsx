import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { getTravels } from "../services/api";
import TravelCard from "../components/TravelCard";
import Spinner from "../components/Spinner";
export default function Home() {
  const location = useLocation();
  const [t, setT] = useState([]),
    [e, setE] = useState(""),
    [loading, setLoading] = useState(true);
  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setE("");
    getTravels()
      .then(setT)
      .catch((x) => {
        if (controller.signal.aborted) return;
        setE(x.message);
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [location.pathname]);
  return (
    <main>
      <section className="hero">
        <div>
          <small>PERSONAL TRAVEL ARCHIVE</small>
          <h1>
            Places I’ve been.
            <br />
            <em>Stories I keep.</em>
          </h1>
          <p>
            A visual collection of journeys, landscapes and little moments worth
            remembering.
          </p>
        </div>
      </section>
      <section className="section">
        <header>
          <div>
            <small>THE JOURNEYS</small>
            <h2>Explore destinations</h2>
          </div>
          <span>{t.length} journeys</span>
        </header>
        {loading ? (
          <Spinner />
        ) : e ? (
          <div className="error">{e}</div>
        ) : (
          <div className="travel-grid">
            {t.map((x) => (
              <TravelCard key={x.id} t={x} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
