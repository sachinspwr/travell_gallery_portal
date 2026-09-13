import { Link } from "react-router-dom";
import { ArrowUpRight, MapPin } from "lucide-react";
export default function TravelCard({ t }) {
  return (
    <Link className="travel-card" to={"/travel/" + t.slug}>
      <div className="cover">
        {t.imageUrl ? (
          <img src={t.imageUrl} alt={t.title} />
        ) : (
          <div>No cover yet</div>
        )}
        <i />
      </div>
      <div className="card-info">
        <div>
          <small>
            <MapPin size={13} />
            {t.title}
          </small>
          <h2>{t.title}</h2>
          <p>{t.photoCount} photographs</p>
        </div>
        <b>
          <ArrowUpRight />
        </b>
      </div>
    </Link>
  );
}
