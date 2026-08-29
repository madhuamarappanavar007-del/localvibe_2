import { useEffect, useMemo, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const defaultIcon = new L.Icon({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const featuredIcon = new L.Icon({
  iconUrl:
    'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-gold.png',
  shadowUrl: markerShadow,
  iconSize: [30, 49],
  iconAnchor: [15, 49],
  popupAnchor: [1, -40],
  shadowSize: [41, 41],
});

function MapController({ center, zoom }) {
  const map = useMap();

  useEffect(() => {
    if (center) {
      map.flyTo(center, zoom ?? map.getZoom(), { duration: 0.8 });
    }
  }, [center, zoom, map]);

  return null;
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

export default function EventMap({
  events,
  userLocation,
  selectedEvent,
  onSelectEvent,
  onRsvp,
  currentUser,
  friendsGoingMap,
  rsvpLoading = {},
}) {
  const [tileLoadError, setTileLoadError] = useState(false);

  const center = useMemo(() => {
    if (userLocation) return [userLocation.lat, userLocation.lng];
    if (events.length > 0) {
      const [lng, lat] = events[0].location.coordinates.coordinates;
      return [lat, lng];
    }
    return [40.7128, -74.006];
  }, [userLocation, events]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <MapContainer center={center} zoom={13} scrollWheelZoom className="leaflet-container">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          eventHandlers={{
            tileerror: () => {
              setTileLoadError(true);
            },
          }}
        />

        {userLocation && (
          <Marker
            position={[userLocation.lat, userLocation.lng]}
            icon={
              new L.DivIcon({
                className: 'user-location-marker',
                html: '<div style="width:16px;height:16px;background:#22d3ee;border:3px solid white;border-radius:50%;box-shadow:0 0 8px rgba(34,211,238,0.8)"></div>',
                iconSize: [16, 16],
                iconAnchor: [8, 8],
              })
            }
          >
            <Popup>You are here</Popup>
          </Marker>
        )}

      {events.map((event) => {
        const [lng, lat] = event.location.coordinates.coordinates;
        const isGoing = currentUser && event.going?.some((u) => u._id === currentUser._id);
        const isInterested =
          currentUser && event.interested?.some((u) => u._id === currentUser._id);
        const friendsInfo = friendsGoingMap?.[event._id];

        return (
          <Marker
            key={event._id}
            position={[lat, lng]}
            icon={event.isFeatured ? featuredIcon : defaultIcon}
            eventHandlers={{
              click: () => onSelectEvent(event),
            }}
          >
            <Popup>
              <div className="popup-content">
                {event.image ? (
                  <img
                    src={event.image}
                    alt={event.title}
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                ) : null}
                <h3>{event.title}</h3>
                <p style={{ fontSize: '0.85rem', color: '#64748b' }}>
                  {event.location.address}
                </p>
                <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '0.25rem' }}>
                  {formatDate(event.startDate)}
                </p>
                <div className="event-meta">
                  <span className="badge category">{event.category}</span>
                  {event.isFeatured && <span className="badge featured">Featured</span>}
                  <span>{event.price === 0 ? 'Free' : `$${event.price}`}</span>
                </div>
                {friendsInfo?.message && (
                  <p className="friends-going">{friendsInfo.message}</p>
                )}
                {currentUser && (
                  <div className="popup-actions">
                    <button
                      className={isGoing ? 'success' : 'secondary'}
                      onClick={() => onRsvp(event._id, isGoing ? 'none' : 'going')}
                      disabled={rsvpLoading[event._id]}
                    >
                      {rsvpLoading[event._id] ? '...' : isGoing ? '✓ Going' : 'Going'}
                    </button>
                    <button
                      className={isInterested ? '' : 'secondary'}
                      onClick={() =>
                        onRsvp(event._id, isInterested ? 'none' : 'interested')
                      }
                      disabled={rsvpLoading[event._id]}
                    >
                      {rsvpLoading[event._id] ? '...' : isInterested ? '★ Interested' : 'Interested'}
                    </button>
                  </div>
                )}
              </div>
            </Popup>
          </Marker>
        );
      })}

        {selectedEvent && (
          <MapController
            center={[
              selectedEvent.location.coordinates.coordinates[1],
              selectedEvent.location.coordinates.coordinates[0],
            ]}
            zoom={15}
          />
        )}

        {userLocation && !selectedEvent && (
          <MapController center={[userLocation.lat, userLocation.lng]} zoom={13} />
        )}
      </MapContainer>

      {tileLoadError && (
        <div
          style={{
            position: 'absolute',
            right: '12px',
            bottom: '12px',
            zIndex: 500,
            padding: '0.5rem 0.75rem',
            borderRadius: '8px',
            background: 'rgba(15, 23, 42, 0.8)',
            color: '#f8fafc',
            fontSize: '0.72rem',
            lineHeight: 1.4,
            maxWidth: '220px',
            boxShadow: '0 10px 25px rgba(15, 23, 42, 0.22)',
          }}
        >
          Map tiles could not be loaded in this environment.
        </div>
      )}
    </div>
  );
}
