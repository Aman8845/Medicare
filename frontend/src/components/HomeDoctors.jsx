import React, { useEffect, useState } from "react";
import { homeDoctorsStyles as hd, iconSize } from "../assets/dummyStyles";
import { Link } from "react-router-dom";
import { ChevronRight, Medal, MousePointer2Off } from "lucide-react";

const HomeDoctors = ({ previewCount = 8 }) => {
  const API_BASE = import.meta.env.VITE_API_BASE_URL;
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function fetchDoctors() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_BASE}/api/doctors`);
      const json = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(
          json?.message || `Failed to load doctors (${res.status})`,
        );
      }

      const items = (json && (json.data || json)) || [];
      const normalized = (Array.isArray(items) ? items : []).map((d) => ({
        id: d._id || d.id,
        name: d.name || "Unknown",
        specialization: d.specialization || "",
        image: d.imageUrl || d.image || d.imageSmall ||  "/placeholder-doctor.jpg",
        experience: d.experience !== undefined ? String(d.experience) : "",
        fee: d.fee ?? d.price ?? 0,
        available:
          typeof d.available === "boolean"
            ? d.available
            : String(d.availability).toLowerCase() === "available",
        raw: d,
      }));

      setDoctors(normalized);
    } catch (err) {
      console.error(err);
      setError("Network error while loading doctors.");
      setDoctors([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchDoctors();
  }, []);

  const preview = doctors.slice(0, previewCount);
  return (
    <section className={hd.section}>
      <div className={hd.container}>
        <div className={hd.header}>
          <h1 className={hd.title}>
            Our<span className={hd.titleSpan}>Medical Team</span>
          </h1>
          <p className={hd.subtitle}>
            Book appointments quickly with our verified specialists.
          </p>
        </div>

        {/* error / retry */}
        {error ? (
          <div className={hd.errorContainer}>
            <div className={hd.errorText}>{error}</div>
            <button onClick={fetchDoctors} className={hd.retryButton}>
              Retry
            </button>
          </div>
        ) : null}

        {loading ? (
          <div className={hd.skeletonGrid}>
            {Array.from({ length: previewCount }).map((_, i) => (
              <div key={i} className={hd.skeletonCard}>
                <div className={hd.skeletonImage}></div>
                <div className={hd.skeletonText1}></div>
                <div className={hd.skeletonText2}></div>
                <div className="flex gap-2 mt-auto">
                  <div className={hd.skeletonButton}></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className={hd.doctorsGrid}>
            {preview.map((doctor) => (
              <article key={doctor.id} className={hd.article}>
                {doctor.available ? (
                  <Link
                    to={`/doctors/${doctor.id}`}
                    state={{ doctor: doctor.raw || doctor }}
                  >
                    <div className={hd.imageContainerAvailable}>
                      <img
                        src={doctor.image}
                        alt={doctor.name}
                        loading="lazy"
                        className={hd.image}
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = "/placeholder-doctor.jpg";
                        }}
                      />
                    </div>
                  </Link>
                ) : (
                  <div className={hd.imageContainerUnavailable}>
                    <img
                      src={doctor.image || "/placeholder-doctor.jpg"}
                      alt={doctor.name}
                      loading="lazy"
                      className={hd.image}
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = "/placeholder-doctor.jpg";
                      }}
                    />
                    <div className={hd.unavailableBadge}>Not available</div>
                  </div>
                )}

                {/* body */}
                <div className={hd.cardBody}>
                  <h3 id={`doctor-${doctor.id}-name`} className={hd.doctorName}>
                    {doctor.name}
                  </h3>

                  <p className={hd.specialization}>{doctor.specialization}</p>

                  <div className={hd.experienceContainer}>
                    <div className={hd.experienceBadge}>
                      <Medal className={`${iconSize.small} h-4`} />
                      <span>{doctor.experience}</span>
                    </div>
                  </div>

                  <div className={hd.buttonContainer}>
                    <div className="w-full">
                      {doctor.available ? (
                        <Link
                          to={`/doctors/${doctor.id}`}
                          state={{ doctor: doctor.raw || doctor }}
                          className={hd.buttonAvailable}
                        >
                          <ChevronRight className="w-5 h-5" /> Book now
                        </Link>
                      ) : (
                        <button disabled className={hd.buttonUnavailable}>
                          <MousePointer2Off className=" w-5 h-5" />
                          Not available
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
      <style>{hd.customCSS}</style>
    </section>
  );
};

export default HomeDoctors;
