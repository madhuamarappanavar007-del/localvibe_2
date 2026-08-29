const FALLBACK_IMAGE = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="800" height="400" viewBox="0 0 800 400"><defs><linearGradient id="g" x1="0" x2="1"><stop stop-color="#1e293b"/><stop offset="1" stop-color="#334155"/></linearGradient></defs><rect width="800" height="400" fill="url(#g)"/><circle cx="160" cy="130" r="64" fill="#22d3ee" opacity="0.65"/><circle cx="620" cy="220" r="90" fill="#6366f1" opacity="0.55"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#f8fafc" font-family="Segoe UI, Arial, sans-serif" font-size="26">LocalVibe</text></svg>'
)}`;

function getImageUrl(value) {
  if (typeof value !== 'string' || !/^https?:\/\//i.test(value.trim())) {
    return FALLBACK_IMAGE;
  }

  return value;
}

function formatDate(dateStr) {
  const date = new Date(dateStr);

  return date.toLocaleString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

function getDistanceKm(from, to) {
  if (!from || !to || !Array.isArray(to) || to.length < 2) return null;

  const [lng, lat] = to;
  const radiusEarthKm = 6371;
  const dLat = ((lat - from.lat) * Math.PI) / 180;
  const dLng = ((lng - from.lng) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((from.lat * Math.PI) / 180) *
      Math.cos((lat * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);

  return 2 * radiusEarthKm * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export default function EventList({
  events,
  selectedEvent,
  onSelect,
  loading,
  error,
  userLocation,
  nearbyNotice,
}) {
  if (loading) {
    return <div className="loading">Loading events...</div>;
  }

  if (error) {
    return (
      <div className="empty" style={{ color: 'var(--danger)' }}>
        ⚠️ {error}
      </div>
    );
  }

  if (!events.length) {
    return (
      <div className="empty">
        No events found nearby. Try increasing the radius or clearing filters.
      </div>
    );
  }

  return (
    <div className="event-list">
      {nearbyNotice && <div className="recommendations-banner">{nearbyNotice}</div>}
      {events.map((event) => {
        const distanceKm = userLocation && event.location?.coordinates?.coordinates
          ? getDistanceKm(userLocation, event.location.coordinates.coordinates)
          : null;
        const imageSrc = getImageUrl(event.image);

        return (
          <div
            key={event._id}
            className={`event-card ${
              event.isFeatured ? 'featured' : ''
            } ${
              selectedEvent?._id === event._id ? 'selected' : ''
            }`}
            onClick={() => onSelect(event)}
          >
            {imageSrc ? (
              <img
                src={imageSrc}
                alt={event.title}
                loading="lazy"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = FALLBACK_IMAGE;
                }}
              />
            ) : null}

            <h3>{event.title}</h3>

            <p
              style={{
                fontSize: '0.85rem',
                color: 'var(--text-muted)',
              }}
            >
              {event.description?.slice(0, 100)}
              {event.description?.length > 100 ? '...' : ''}
            </p>

            <div className="event-meta">
              <span className="badge category">
                {event.category}
              </span>

              {event.isFeatured && (
                <span className="badge featured">
                  Featured
                </span>
              )}

              {event.price === 0 ? (
                <span className="badge free">
                  Free
                </span>
              ) : (
                <span>${event.price}</span>
              )}

              <span>{formatDate(event.startDate)}</span>

              {distanceKm !== null && (
                <span>{distanceKm.toFixed(1)} km away</span>
              )}

              {event.going?.length > 0 && (
                <span>{event.going.length} going</span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}