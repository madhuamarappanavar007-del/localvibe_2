function formatDate(dateStr) {
  return new Date(dateStr).toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

function EventMini({ event, onSelect }) {
  return (
    <div className="event-card" onClick={() => onSelect?.(event)} style={{ marginBottom: '0.5rem' }}>
      <h3 style={{ fontSize: '0.9rem' }}>{event.title}</h3>
      <div className="event-meta">
        <span className="badge category">{event.category}</span>
        <span>{formatDate(event.startDate)}</span>
      </div>
    </div>
  );
}

export default function UserProfile({ user, userEvents, recommendations, onSelectEvent }) {
  if (!user) {
    return <div className="empty">Select a user to view profile and RSVPs.</div>;
  }

  return (
    <div className="user-profile">
      <div style={{ marginBottom: '1rem' }}>
        <h2 style={{ fontSize: '1.1rem' }}>{user.name}</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{user.email}</p>
        {user.following?.length > 0 && (
          <p style={{ fontSize: '0.8rem', marginTop: '0.35rem' }}>
            Following {user.following.length} friend{user.following.length !== 1 ? 's' : ''}
          </p>
        )}
      </div>

      {recommendations && (
        <div className="recommendations-banner">
          <strong>Recommended for you</strong>
          <p style={{ marginTop: '0.35rem' }}>{recommendations.reason}</p>
        </div>
      )}

      {recommendations?.events?.length > 0 && (
        <div className="profile-section">
          {recommendations.events.slice(0, 3).map((e) => (
            <EventMini key={e._id} event={e} onSelect={onSelectEvent} />
          ))}
        </div>
      )}

      <div className="profile-section">
        <h3>Events I&apos;m Going To ({userEvents?.going?.length ?? 0})</h3>
        {userEvents?.going?.length ? (
          userEvents.going.map((e) => <EventMini key={e._id} event={e} onSelect={onSelectEvent} />)
        ) : (
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>No RSVPs yet</p>
        )}
      </div>

      <div className="profile-section">
        <h3>Interested ({userEvents?.interested?.length ?? 0})</h3>
        {userEvents?.interested?.length ? (
          userEvents.interested.map((e) => (
            <EventMini key={e._id} event={e} onSelect={onSelectEvent} />
          ))
        ) : (
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>None yet</p>
        )}
      </div>

      <div className="profile-section">
        <h3>Events I Organized ({userEvents?.organized?.length ?? 0})</h3>
        {userEvents?.organized?.length ? (
          userEvents.organized.map((e) => (
            <EventMini key={e._id} event={e} onSelect={onSelectEvent} />
          ))
        ) : (
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>None yet</p>
        )}
      </div>
    </div>
  );
}
