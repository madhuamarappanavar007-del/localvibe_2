import { useState, useEffect, useRef } from 'react';
import { api } from '../services/api.js';

const emptyForm = {
  title: '',
  description: '',
  startDate: '',
  endDate: '',
  address: '',
  lat: '',
  lng: '',
  category: 'Music',
  price: 0,
  image: '',
  isFeatured: false,
};

export default function EventForm({ categories, currentUser, onCreated }) {
  const [form, setForm] = useState(emptyForm);
  const [suggestions, setSuggestions] = useState([]);
  const [geocodeLoading, setGeocodeLoading] = useState(false);
  const [geocodeNoResults, setGeocodeNoResults] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const debounceRef = useRef(null);

  useEffect(() => {
    if (form.address.length < 3) {
      setSuggestions([]);
      setGeocodeLoading(false);
      setGeocodeNoResults(false);
      return;
    }

    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setGeocodeLoading(true);
      setGeocodeNoResults(false);

      try {
        const results = await api.geocode(form.address);
        setSuggestions(results);
        setGeocodeNoResults(Array.isArray(results) && results.length === 0);
      } catch {
        setSuggestions([]);
        setGeocodeNoResults(false);
      } finally {
        setGeocodeLoading(false);
      }
    }, 400);

    return () => clearTimeout(debounceRef.current);
  }, [form.address]);

  const selectSuggestion = (s) => {
    setForm((f) => ({
      ...f,
      address: s.address,
      lat: s.lat,
      lng: s.lng,
    }));
    setSuggestions([]);
    setGeocodeNoResults(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      setError('Please select a user first');
      return;
    }

    // Validate dates
    const start = new Date(form.startDate);
    const end = new Date(form.endDate);
    if (end <= start) {
      setError('End date must be after start date');
      return;
    }

    // Validate coordinates
    if (!form.lat || !form.lng) {
      setError('Please select a valid address from the suggestions');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const event = await api.createEvent({
        ...form,
        price: Number(form.price),
        organizerId: currentUser._id,
      });
      setSuccess(true);
      setTimeout(() => {
        setForm(emptyForm);
        setSuccess(false);
        onCreated?.(event);
      }, 1500);
    } catch (err) {
      setError(err.message || 'Failed to create event. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <p style={{ color: 'var(--danger)', marginBottom: '0.75rem' }}>{error}</p>}
      {success && (
        <p style={{ color: 'var(--success)', marginBottom: '0.75rem', fontWeight: '600' }}>
          ✓ Event created successfully! Redirecting...
        </p>
      )}

      <div className="form-group">
        <label>Event title *</label>
        <input
          required
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          placeholder="Brooklyn Open Mic Night"
        />
      </div>

      <div className="form-group">
        <label>Description</label>
        <textarea
          rows={3}
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          placeholder="Tell people what to expect..."
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Start *</label>
          <input
            required
            type="datetime-local"
            value={form.startDate}
            onChange={(e) => setForm({ ...form, startDate: e.target.value })}
            min={new Date().toISOString().slice(0, 16)}
          />
        </div>
        <div className="form-group">
          <label>End *</label>
          <input
            required
            type="datetime-local"
            value={form.endDate}
            onChange={(e) => setForm({ ...form, endDate: e.target.value })}
            min={form.startDate || new Date().toISOString().slice(0, 16)}
          />
        </div>
      </div>

      <div className="form-group">
        <label>Location (address autocomplete) *</label>
        <input
          required
          value={form.address}
          onChange={(e) => setForm({ ...form, address: e.target.value, lat: '', lng: '' })}
          placeholder="Start typing an address..."
          autoComplete="off"
          style={{ borderColor: form.address && !form.lat ? 'var(--danger)' : undefined }}
        />
        {suggestions.length > 0 && (
          <ul className="suggestions">
            {suggestions.map((s, i) => (
              <li key={i} onClick={() => selectSuggestion(s)}>
                {s.displayName}
              </li>
            ))}
          </ul>
        )}
        {!geocodeLoading && form.address.length >= 3 && !form.lat && !suggestions.length && geocodeNoResults && (
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
            No matching locations found.
          </p>
        )}
        {form.lat ? (
          <p style={{ fontSize: '0.75rem', color: 'var(--success)', marginTop: '0.35rem' }}>
            ✓ Coordinates: {form.lat.toFixed?.(4) ?? form.lat}, {form.lng.toFixed?.(4) ?? form.lng}
          </p>
        ) : form.address.length > 3 && !geocodeNoResults ? (
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
            Select an address from the suggestions
          </p>
        ) : null}
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Category *</label>
          <select
            required
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            style={{ maxHeight: '200px', overflowY: 'auto' }}
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Price ($)</label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            placeholder="0 for free events"
          />
        </div>
      </div>

      <div className="form-group">
        <label>Image URL</label>
        <input
          value={form.image}
          onChange={(e) => setForm({ ...form, image: e.target.value })}
          placeholder="https://images.unsplash.com/..."
        />
      </div>

      <div className="form-group checkbox-row">
        <input
          type="checkbox"
          id="featured"
          checked={form.isFeatured}
          onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })}
        />
        <label htmlFor="featured">Premium featured listing (larger gold pin)</label>
      </div>

      <button
        type="submit"
        disabled={
          loading ||
          !form.title.trim() ||
          !form.startDate ||
          !form.endDate ||
          !form.address.trim() ||
          !form.lat ||
          !form.lng ||
          !form.category
        }
      >
        {loading ? 'Creating...' : 'Create Event'}
      </button>
    </form>
  );
}
