import { useCallback, useEffect, useState } from 'react';
import { api } from './services/api.js';
import EventMap from './components/EventMap.jsx';
import EventList from './components/EventList.jsx';
import EventForm from './components/EventForm.jsx';
import UserProfile from './components/UserProfile.jsx';
import Filters from './components/Filters.jsx';

const TABS = ['discover', 'create', 'profile'];

function formatDateTime(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Unknown date';

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

function formatInputDateTime(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';

  const offset = date.getTimezoneOffset();
  const local = new Date(date.getTime() - offset * 60000);
  return local.toISOString().slice(0, 16);
}

function getDistanceKm(from, coordinates) {
  if (!from || !Array.isArray(coordinates) || coordinates.length < 2) return null;

  const [lng, lat] = coordinates;
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

export default function App() {
  const [tab, setTab] = useState('discover');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [categories, setCategories] = useState([]);
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [eventDraft, setEventDraft] = useState(null);

  const [userLocation, setUserLocation] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [nearbyNotice, setNearbyNotice] = useState('');

  const [rsvpLoading, setRsvpLoading] = useState({});
  const [userEvents, setUserEvents] = useState(null);
  const [recommendations, setRecommendations] = useState(null);
  const [friendsGoingMap, setFriendsGoingMap] = useState({});

  const [filters, setFilters] = useState({
    category: '',
    q: '',
    startDate: '',
    endDate: '',
    featured: '',
    minPrice: '',
    maxPrice: '',
    // An empty radius keeps Discover in all-events mode until the user enters one.
    radius: '',
  });

  /*
   * ============================================================
   * LOAD EVENTS
   * ============================================================
   *
   * IMPORTANT:
   * We intentionally use getEvents() here instead of
   * getNearbyEvents().
   *
   * This prevents the complete event list from disappearing
   * when browser location is detected.
   *
   * The user's location is still passed to EventMap and is
   * still used for recommendations.
   */
  const loadEvents = useCallback(async () => {
    setLoading(true);
    setError(null);
    setNearbyNotice('');

    try {
      const params = {};

      if (filters.q && filters.q.trim()) {
        params.q = filters.q.trim();
      }

      if (filters.category) {
        params.category = filters.category;
      }

      if (filters.startDate) {
        params.startDate = filters.startDate;
      }

      if (filters.endDate) {
        params.endDate = filters.endDate;
      }

      if (filters.featured) {
        params.featured = filters.featured;
      }

      if (filters.minPrice !== '' && filters.minPrice !== undefined) {
        params.minPrice = filters.minPrice;
      }

      if (filters.maxPrice !== '' && filters.maxPrice !== undefined) {
        params.maxPrice = filters.maxPrice;
      }

      const radius = Number(filters.radius);
      const useNearby = Boolean(userLocation) && Number.isFinite(radius) && radius > 0;

      let eventList = [];

      if (useNearby) {
        const nearby = await api.getNearbyEvents(userLocation.lat, userLocation.lng, {
          ...params,
          radius: String(radius),
        });

        eventList = Array.isArray(nearby) ? nearby : [];

        if (eventList.length === 0) {
          const fallback = await api.getEvents(params);
          eventList = Array.isArray(fallback) ? fallback : [];
          setNearbyNotice(
            `No events within ${radius} km of your location. Showing all upcoming events instead.`
          );
        }
      } else {
        const fallback = await api.getEvents(params);
        eventList = Array.isArray(fallback) ? fallback : [];
      }

      setEvents(eventList);

      setSelectedEvent((previous) => {
        if (!previous) return null;

        const updatedSelected = eventList.find(
          (event) => event._id === previous._id
        );

        return updatedSelected || previous;
      });
    } catch (err) {
      console.error('Failed to load events:', err);

      setError(
        err?.message ||
          'Failed to load events. Please check that the backend is running.'
      );

      setEvents([]);
    } finally {
      setLoading(false);
    }
  }, [filters, userLocation]);

  /*
   * ============================================================
   * INITIAL DATA
   * ============================================================
   */
  useEffect(() => {
    let cancelled = false;

    async function init() {
      try {
        const [cats, usrs] = await Promise.all([
          api.getCategories(),
          api.getUsers(),
        ]);

        if (cancelled) return;

        setCategories(Array.isArray(cats) ? cats : []);
        setUsers(Array.isArray(usrs) ? usrs : []);

        /*
         * The first available user is used as the demo/current user.
         */
        if (Array.isArray(usrs) && usrs.length > 0) {
          setCurrentUser(usrs[0]);
        }
      } catch (err) {
        console.error('Init failed:', err);

        if (!cancelled) {
          setError(
            'Failed to load initial data. Please check that the backend is running.'
          );
        }
      }
    }

    init();

    return () => {
      cancelled = true;
    };
  }, []);

  /*
   * ============================================================
   * LOAD EVENTS WHEN FILTERS CHANGE
   * ============================================================
   */
  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  /*
   * ============================================================
   * LOAD USER PROFILE DATA
   * ============================================================
   */
  useEffect(() => {
    if (!currentUser?._id) return;

    let cancelled = false;

    async function loadProfile() {
      try {
        const recommendationLat = userLocation?.lat ?? 16.1588;
        const recommendationLng = userLocation?.lng ?? 74.5083;

        const [eventsData, recs] = await Promise.all([
          api.getUserEvents(currentUser._id),
          api.getRecommendations(
            currentUser._id,
            recommendationLat,
            recommendationLng
          ),
        ]);

        if (cancelled) return;

        setUserEvents(eventsData);
        setRecommendations(recs);
      } catch (err) {
        console.error('Failed to load profile/recommendations:', err);

        /*
         * Profile/recommendation failure should not break
         * the Discover page.
         */
      }
    }

    loadProfile();

    return () => {
      cancelled = true;
    };
  }, [currentUser, userLocation]);

  /*
   * ============================================================
   * LOAD FRIENDS GOING INFORMATION
   * ============================================================
   */
  useEffect(() => {
    if (!currentUser?._id || events.length === 0) {
      setFriendsGoingMap({});
      return;
    }

    let cancelled = false;

    async function loadFriendsGoing() {
      const map = {};

      /*
       * Limit to first 20 events so we don't create too many
       * API requests at once.
       */
      await Promise.all(
        events.slice(0, 20).map(async (event) => {
          try {
            const info = await api.friendsGoing(
              event._id,
              currentUser._id
            );

            if (info?.count > 0) {
              map[event._id] = info;
            }
          } catch (err) {
            /*
             * Friends-going information is optional.
             * Ignore failures so the event page continues working.
             */
          }
        })
      );

      if (!cancelled) {
        setFriendsGoingMap(map);
      }
    }

    loadFriendsGoing();

    return () => {
      cancelled = true;
    };
  }, [events, currentUser]);

  /*
   * ============================================================
   * LOCATION DETECTION
   * ============================================================
   *
   * IMPORTANT:
   * Detecting location NO LONGER changes the event query.
   *
   * It only updates userLocation.
   */
  const detectLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');

      setTimeout(() => {
        setError(null);
      }, 3000);

      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };

        setUserLocation(location);

        setSuccessMessage('Your location was detected.');

        setTimeout(() => {
          setSuccessMessage(null);
        }, 2500);
      },
      (err) => {
        console.warn(`Could not get location: ${err.message}`);

        /*
         * Location is optional.
         * The application continues to work normally
         * even if permission is denied.
         */
        setError(
          'Could not access your location. Events will still be displayed.'
        );

        setTimeout(() => {
          setError(null);
        }, 3500);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000,
      }
    );
  }, []);

  /*
   * ============================================================
   * AUTOMATIC LOCATION DETECTION
   * ============================================================
   */
  useEffect(() => {
    detectLocation();
  }, [detectLocation]);

  /*
   * ============================================================
   * RSVP HANDLER
   * ============================================================
   *
   * status can be:
   * - going
   * - interested
   * - none
   */
  const handleRsvp = async (eventId, status) => {
    if (!currentUser?._id) {
      setError('Please select a user before updating your RSVP.');

      setTimeout(() => {
        setError(null);
      }, 3000);

      return;
    }

    setRsvpLoading((previous) => ({
      ...previous,
      [eventId]: true,
    }));

    try {
      const updatedEvent = await api.rsvp(
        eventId,
        currentUser._id,
        status
      );

      /*
       * Update the event immediately in the UI.
       */
      setEvents((previousEvents) =>
        previousEvents.map((event) =>
          event._id === eventId ? updatedEvent : event
        )
      );

      /*
       * Also update the selected event if it is the same event.
       */
      setSelectedEvent((previous) => {
        if (!previous || previous._id !== eventId) {
          return previous;
        }

        return updatedEvent;
      });

      /*
       * Refresh user's RSVP/event information.
       */
      try {
        const updatedUserEvents = await api.getUserEvents(
          currentUser._id
        );

        setUserEvents(updatedUserEvents);
      } catch (profileError) {
        console.warn(
          'Could not refresh user events:',
          profileError
        );
      }

      /*
       * Success messages.
       */
      if (status === 'going') {
        setSuccessMessage('RSVP confirmed: You are going!');
      } else if (status === 'interested') {
        setSuccessMessage(
          'RSVP confirmed: You are interested!'
        );
      } else {
        setSuccessMessage('RSVP removed.');
      }

      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (err) {
      console.error('RSVP failed:', err);

      setError(
        err?.message ||
          'Failed to update RSVP. Please try again.'
      );

      setTimeout(() => {
        setError(null);
      }, 3000);
    } finally {
      setRsvpLoading((previous) => ({
        ...previous,
        [eventId]: false,
      }));
    }
  };

  /*
   * ============================================================
   * EVENT CREATED
   * ============================================================
   */
  const handleEventCreated = async (createdEvent) => {
    /*
     * Immediately display the newly created event.
     */
    if (createdEvent) {
      setEvents((previousEvents) => {
        /*
         * Prevent duplicate events if the event was already
         * returned by the API.
         */
        const exists = previousEvents.some(
          (event) => event._id === createdEvent._id
        );

        if (exists) {
          return previousEvents.map((event) =>
            event._id === createdEvent._id
              ? createdEvent
              : event
          );
        }

        return [createdEvent, ...previousEvents];
      });

      setSelectedEvent(createdEvent);
    }

    /*
     * Return to Discover.
     */
    setTab('discover');

    /*
     * Close mobile sidebar.
     */
    setSidebarOpen(false);

    /*
     * Show success message.
     */
    setSuccessMessage('Event created successfully!');

    setTimeout(() => {
      setSuccessMessage(null);
    }, 3000);

    /*
     * Reload events from MongoDB after creation.
     *
     * This confirms that the event really exists in the
     * database and keeps the frontend synchronized.
     */
    try {
      await loadEvents();
    } catch (err) {
      console.error(
        'Could not refresh events after creation:',
        err
      );
    }
  };

  /*
   * ============================================================
   * EVENT SELECTION
   * ============================================================
   */
  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
    setEventDraft(null);
  };

  const openEventEditor = () => {
    if (!selectedEvent) return;

    const coords = selectedEvent.location?.coordinates?.coordinates || [];

    setEventDraft({
      title: selectedEvent.title || '',
      description: selectedEvent.description || '',
      startDate: formatInputDateTime(selectedEvent.startDate),
      endDate: formatInputDateTime(selectedEvent.endDate),
      address: selectedEvent.location?.address || '',
      lat: coords[1] ?? '',
      lng: coords[0] ?? '',
      category: selectedEvent.category || '',
      price: selectedEvent.price ?? 0,
      image: selectedEvent.image || '',
      isFeatured: Boolean(selectedEvent.isFeatured),
    });
  };

  const handleUpdateEvent = async (event) => {
    event.preventDefault();
    if (!selectedEvent?._id) return;

    const organizerId = selectedEvent.organizer?._id || selectedEvent.organizer;
    const isOwner = currentUser && organizerId && currentUser._id === organizerId;

    if (!isOwner) {
      setError('You can only edit events you organize.');
      return;
    }

    if (!eventDraft.title.trim() || !eventDraft.startDate || !eventDraft.endDate || !eventDraft.address.trim()) {
      setError('Please complete the required event details before saving.');
      return;
    }

    const start = new Date(eventDraft.startDate);
    const end = new Date(eventDraft.endDate);
    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
      setError('Please use valid start and end dates.');
      return;
    }

    if (end <= start) {
      setError('End date must be after the start date.');
      return;
    }

    if (eventDraft.lat === '' || eventDraft.lng === '') {
      setError('Please choose a valid address to keep the event location.');
      return;
    }

    try {
      const updated = await api.updateEvent(selectedEvent._id, {
        ...eventDraft,
        price: Number(eventDraft.price || 0),
        organizerId: organizerId,
      });

      setEvents((previous) => previous.map((item) => (item._id === selectedEvent._id ? updated : item)));
      setSelectedEvent(updated);
      setEventDraft(null);
      setSuccessMessage('Event updated successfully.');
      setTimeout(() => setSuccessMessage(null), 2500);
    } catch (err) {
      console.error('Failed to update event:', err);
      setError(err?.message || 'Could not update this event.');
    }
  };

  const handleDeleteEvent = async () => {
    if (!selectedEvent?._id) return;

    const organizerId = selectedEvent.organizer?._id || selectedEvent.organizer;
    const isOwner = currentUser && organizerId && currentUser._id === organizerId;

    if (!isOwner) {
      setError('You can only delete events you organize.');
      return;
    }

    if (!window.confirm('Delete this event? This action cannot be undone.')) {
      return;
    }

    try {
      await api.deleteEvent(selectedEvent._id);
      setEvents((previous) => previous.filter((event) => event._id !== selectedEvent._id));
      setSelectedEvent(null);
      setEventDraft(null);
      setSuccessMessage('Event deleted successfully.');
      setTimeout(() => setSuccessMessage(null), 2500);
    } catch (err) {
      console.error('Failed to delete event:', err);
      setError(err?.message || 'Could not delete this event.');
    }
  };

  /*
   * ============================================================
   * USER CHANGE
   * ============================================================
   */
  const handleUserChange = (event) => {
    const userId = event.target.value;

    const user = users.find((item) => item._id === userId);

    setCurrentUser(user || null);
  };

  /*
   * ============================================================
   * RENDER
   * ============================================================
   */
  return (
    <div className="app">
      {/* ======================================================
          HEADER
      ====================================================== */}
      <header className="header">
        <div className="logo">
          LocalVibe <span>hyperlocal events</span>
        </div>

        {successMessage && (
          <div
            className="success-banner"
            style={{
              background: 'var(--success)',
              color: 'white',
              padding: '0.5rem 1rem',
              borderRadius: '8px',
              fontSize: '0.85rem',
              animation: 'fadeIn 0.3s ease',
            }}
          >
            ✓ {successMessage}
          </div>
        )}

        {error && (
          <div
            className="error-banner"
            style={{
              background: '#dc2626',
              color: 'white',
              padding: '0.5rem 1rem',
              borderRadius: '8px',
              fontSize: '0.85rem',
              animation: 'fadeIn 0.3s ease',
              maxWidth: '420px',
            }}
          >
            {error}
          </div>
        )}

        <div className="header-actions">
          <select
            className="user-select"
            value={currentUser?._id ?? ''}
            onChange={handleUserChange}
          >
            <option value="">Select user</option>

            {users.map((user) => (
              <option key={user._id} value={user._id}>
                {user.name}
              </option>
            ))}
          </select>

          <button
            className="secondary"
            onClick={detectLocation}
            title="Center on my location"
          >
            📍 Locate
          </button>
        </div>
      </header>

      {/* ======================================================
          MAIN LAYOUT
      ====================================================== */}
      <div className="main-layout">
        {/* ====================================================
            SIDEBAR
        ==================================================== */}
        <aside
          className={`sidebar ${
            sidebarOpen ? 'open' : ''
          }`}
        >
          <div
            className="sidebar-handle"
            onClick={() =>
              setSidebarOpen((open) => !open)
            }
            role="button"
            tabIndex={0}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                setSidebarOpen((open) => !open);
              }
            }}
          />

          {/* ==================================================
              TABS
          ================================================== */}
          <div className="sidebar-tabs">
            {TABS.map((tabName) => (
              <button
                key={tabName}
                className={
                  tab === tabName ? 'active' : ''
                }
                onClick={() => {
                  setTab(tabName);
                  setSidebarOpen(true);
                }}
              >
                {tabName === 'discover'
                  ? 'Discover'
                  : tabName === 'create'
                  ? 'Add Event'
                  : 'My Profile'}
              </button>
            ))}
          </div>

          {/* ==================================================
              SIDEBAR CONTENT
          ================================================== */}
          <div className="sidebar-content">
            {/* =================================================
                DISCOVER
            ================================================= */}
            {tab === 'discover' && (
              <>
                <Filters
                  filters={filters}
                  categories={categories}
                  onChange={setFilters}
                />

                {recommendations && (
                  <div
                    className="recommendations-banner"
                    style={{
                      marginBottom: '1rem',
                    }}
                  >
                    💡 {recommendations.reason}
                  </div>
                )}

                <EventList
                  events={events}
                  selectedEvent={selectedEvent}
                  onSelect={(event) => {
                    handleSelectEvent(event);
                    setSidebarOpen(false);
                  }}
                  loading={loading}
                  error={error}
                  userLocation={userLocation}
                  nearbyNotice={nearbyNotice}
                />
              </>
            )}

            {/* =================================================
                CREATE EVENT
            ================================================= */}
            {tab === 'create' && (
              <EventForm
                categories={categories}
                currentUser={currentUser}
                onCreated={handleEventCreated}
              />
            )}

            {/* =================================================
                PROFILE
            ================================================= */}
            {tab === 'profile' && (
              <UserProfile
                user={currentUser}
                userEvents={userEvents}
                recommendations={recommendations}
                onSelectEvent={(event) => {
                  setSelectedEvent(event);
                  setTab('discover');
                  setSidebarOpen(false);
                }}
              />
            )}
          </div>
        </aside>

        {/* ====================================================
            MAP
        ==================================================== */}
        <div className="map-container">
          <EventMap
            events={events}
            userLocation={userLocation}
            selectedEvent={selectedEvent}
            onSelectEvent={setSelectedEvent}
            onRsvp={handleRsvp}
            currentUser={currentUser}
            friendsGoingMap={friendsGoingMap}
            rsvpLoading={rsvpLoading}
          />

          {selectedEvent && (
            <div className="detail-panel">
              {eventDraft ? (
                <form onSubmit={handleUpdateEvent} className="detail-editor">
                  <div className="detail-header-row">
                    <h3>Edit event</h3>
                    <button type="button" className="ghost" onClick={() => setEventDraft(null)}>
                      Close
                    </button>
                  </div>

                  <div className="form-group">
                    <label>Title</label>
                    <input
                      value={eventDraft.title}
                      onChange={(e) => setEventDraft({ ...eventDraft, title: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label>Description</label>
                    <textarea
                      rows={4}
                      value={eventDraft.description}
                      onChange={(e) => setEventDraft({ ...eventDraft, description: e.target.value })}
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Start</label>
                      <input
                        type="datetime-local"
                        value={eventDraft.startDate}
                        onChange={(e) => setEventDraft({ ...eventDraft, startDate: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label>End</label>
                      <input
                        type="datetime-local"
                        value={eventDraft.endDate}
                        onChange={(e) => setEventDraft({ ...eventDraft, endDate: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Address</label>
                    <input
                      value={eventDraft.address}
                      onChange={(e) => setEventDraft({ ...eventDraft, address: e.target.value, lat: '', lng: '' })}
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Category</label>
                      <select
                        value={eventDraft.category}
                        onChange={(e) => setEventDraft({ ...eventDraft, category: e.target.value })}
                      >
                        {categories.map((category) => (
                          <option key={category} value={category}>
                            {category}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Price</label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={eventDraft.price}
                        onChange={(e) => setEventDraft({ ...eventDraft, price: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="form-group checkbox-row">
                    <input
                      type="checkbox"
                      checked={eventDraft.isFeatured}
                      onChange={(e) => setEventDraft({ ...eventDraft, isFeatured: e.target.checked })}
                    />
                    <label>Featured listing</label>
                  </div>

                  <div className="form-group">
                    <label>Image URL</label>
                    <input
                      value={eventDraft.image}
                      onChange={(e) => setEventDraft({ ...eventDraft, image: e.target.value })}
                    />
                  </div>

                  <div className="detail-actions">
                    <button type="submit" className="success">Save changes</button>
                    <button type="button" className="secondary" onClick={() => setEventDraft(null)}>Cancel</button>
                  </div>
                </form>
              ) : (
                <div className="detail-card">
                  <div className="detail-header-row">
                    <h3>{selectedEvent.title}</h3>
                    <button type="button" className="ghost" onClick={() => setSelectedEvent(null)}>
                      Close
                    </button>
                  </div>

                  {selectedEvent.image && (
                    <img
                      src={selectedEvent.image}
                      alt={selectedEvent.title}
                      className="detail-image"
                      onError={(event) => {
                        event.target.style.display = 'none';
                      }}
                    />
                  )}

                  <div className="detail-badges">
                    <span className="badge category">{selectedEvent.category}</span>
                    {selectedEvent.isFeatured && <span className="badge featured">Featured</span>}
                    <span className="badge free">{selectedEvent.price === 0 ? 'Free' : `$${selectedEvent.price}`}</span>
                  </div>

                  <p className="detail-description">{selectedEvent.description || 'No description provided yet.'}</p>

                  <div className="detail-grid">
                    <div><span className="detail-label">Date</span><strong>{formatDateTime(selectedEvent.startDate)}</strong></div>
                    <div><span className="detail-label">Ends</span><strong>{formatDateTime(selectedEvent.endDate)}</strong></div>
                    <div><span className="detail-label">Organizer</span><strong>{selectedEvent.organizer?.name || 'Organizer'}</strong></div>
                    <div><span className="detail-label">Address</span><strong>{selectedEvent.location?.address || 'Unknown address'}</strong></div>
                    <div><span className="detail-label">RSVPs</span><strong>{selectedEvent.going?.length || 0} going · {selectedEvent.interested?.length || 0} interested</strong></div>
                    <div>
                      <span className="detail-label">Distance</span>
                      <strong>
                        {userLocation && selectedEvent.location?.coordinates?.coordinates
                          ? `${getDistanceKm(userLocation, selectedEvent.location.coordinates.coordinates)?.toFixed(1) ?? '—'} km away`
                          : 'Location not available'}
                      </strong>
                    </div>
                  </div>

                  {currentUser && (
                    <div className="rsvp-group">
                      <button
                        type="button"
                        className={selectedEvent.going?.some((user) => user._id === currentUser._id) ? 'success' : 'secondary'}
                        onClick={() => handleRsvp(selectedEvent._id, selectedEvent.going?.some((user) => user._id === currentUser._id) ? 'none' : 'going')}
                        disabled={rsvpLoading[selectedEvent._id]}
                      >
                        {rsvpLoading[selectedEvent._id] ? '...' : selectedEvent.going?.some((user) => user._id === currentUser._id) ? '✓ Going' : 'Going'}
                      </button>

                      <button
                        type="button"
                        className={selectedEvent.interested?.some((user) => user._id === currentUser._id) ? 'secondary' : 'secondary'}
                        onClick={() => handleRsvp(selectedEvent._id, selectedEvent.interested?.some((user) => user._id === currentUser._id) ? 'none' : 'interested')}
                        disabled={rsvpLoading[selectedEvent._id]}
                      >
                        {rsvpLoading[selectedEvent._id] ? '...' : selectedEvent.interested?.some((user) => user._id === currentUser._id) ? '★ Interested' : 'Interested'}
                      </button>

                      <button
                        type="button"
                        className="ghost"
                        onClick={() => handleRsvp(selectedEvent._id, 'none')}
                        disabled={rsvpLoading[selectedEvent._id] || (!selectedEvent.going?.some((user) => user._id === currentUser._id) && !selectedEvent.interested?.some((user) => user._id === currentUser._id))}
                      >
                        Cancel
                      </button>
                    </div>
                  )}

                  {friendsGoingMap[selectedEvent._id]?.message && (
                    <div className="friends-going-banner">{friendsGoingMap[selectedEvent._id].message}</div>
                  )}

                  <div className="detail-actions">
                    <button
                      type="button"
                      className="secondary"
                      onClick={openEventEditor}
                      disabled={
                        !currentUser ||
                        (selectedEvent.organizer?._id || selectedEvent.organizer) !== currentUser._id
                      }
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="danger"
                      onClick={handleDeleteEvent}
                      disabled={
                        !currentUser ||
                        (selectedEvent.organizer?._id || selectedEvent.organizer) !== currentUser._id
                      }
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
