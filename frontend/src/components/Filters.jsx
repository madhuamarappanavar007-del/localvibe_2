export default function Filters({ filters, categories, onChange }) {
  const clearFilters = () => {
    onChange({
      category: '',
      q: '',
      startDate: '',
      endDate: '',
      featured: '',
      minPrice: '',
      maxPrice: '',
      radius: '',
    });
  };

  return (
    <div className="filters">
      <div className="filters-row">
        <input
          type="text"
          value={filters.q || ''}
          onChange={(e) => onChange({ ...filters, q: e.target.value })}
          placeholder="Search events, keywords..."
        />
      </div>

      <div className="filters-row">
        <select
          value={filters.category}
          onChange={(e) => onChange({ ...filters, category: e.target.value })}
        >
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <select
          value={filters.featured}
          onChange={(e) => onChange({ ...filters, featured: e.target.value })}
        >
          <option value="">All events</option>
          <option value="true">Featured only</option>
        </select>
      </div>

      <div className="filters-row">
        <input
          type="date"
          value={filters.startDate}
          onChange={(e) => onChange({ ...filters, startDate: e.target.value })}
          placeholder="From date"
        />
        <input
          type="date"
          value={filters.endDate}
          onChange={(e) => onChange({ ...filters, endDate: e.target.value })}
          placeholder="To date"
        />
      </div>

      <div className="filters-row">
        <input
          type="number"
          min="0"
          step="0.01"
          value={filters.minPrice}
          onChange={(e) => onChange({ ...filters, minPrice: e.target.value })}
          placeholder="Min price"
        />
        <input
          type="number"
          min="0"
          step="0.01"
          value={filters.maxPrice}
          onChange={(e) => onChange({ ...filters, maxPrice: e.target.value })}
          placeholder="Max price"
        />
      </div>

      <div className="filters-row">
        <input
          type="number"
          min="1"
          max="50"
          value={filters.radius}
          onChange={(e) => onChange({ ...filters, radius: e.target.value })}
          placeholder="Radius (km)"
          title="Search radius in km"
        />
        <button
          type="button"
          className="secondary"
          onClick={clearFilters}
          style={{ flex: '0 0 auto', minWidth: '80px' }}
        >
          Clear
        </button>
      </div>
    </div>
  );
}
