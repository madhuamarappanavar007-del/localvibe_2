# LocalVibe Demonstration Script

## Overview

This script provides a step-by-step guide for a 5-10 minute live demonstration of the LocalVibe application.

## Prerequisites

- Stable internet connection
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Access to production deployment: https://localvibe-frontend-a2x1.onrender.com
- Access to backend health: https://localvibe-backend-2026.onrender.com/api/health

## Demonstration Script

### Introduction (1 minute)

**Speaker:** "Good morning/afternoon. Today I will be presenting LocalVibe, a hyperlocal event discovery platform. LocalVibe allows users to discover, create, and interact with nearby community events using an interactive map and geospatial search capabilities."

**Slide:** Show title slide with project name and your details.

### Problem and Motivation (1 minute)

**Speaker:** "The problem LocalVibe addresses is the fragmentation of event information across multiple platforms like Facebook Events, Meetup, and local newspapers. Users struggle to find events happening near them, and there's no centralized system for RSVP tracking and event discovery."

**Speaker:** "LocalVibe solves this by providing a unified, map-based platform with location-based search, interactive visualization, and social features for community engagement."

### Technology Stack (30 seconds)

**Speaker:** "The application is built using React for the frontend, Express.js for the backend, and MongoDB Atlas for the database. We use Leaflet for interactive mapping and Nominatim for address geocoding. The application is deployed on Render cloud platform."

### Live Demonstration (5-7 minutes)

#### Step 1: Open Application (30 seconds)

**Action:** Open https://localvibe-frontend-a2x1.onrender.com in browser

**Speaker:** "Let me open the production deployment of LocalVibe. As you can see, the application loads and displays the Discover page with events and an interactive map."

#### Step 2: Show Event Discovery (1 minute)

**Action:** Scroll through event cards, show various events

**Speaker:** "On the Discover page, you can see all available events displayed as cards with event details including title, category, date, location, and price. Each card shows the event category badge and whether it's featured."

**Speaker:** "On the right side, we have an interactive map showing all event locations. Blue markers represent regular events, and gold markers represent featured events."

#### Step 3: Show Category Filtering (1 minute)

**Action:** Click the category dropdown, show all categories, select "Technology"

**Speaker:** "Let me demonstrate the filtering capabilities. I'll click the category dropdown. As you can see, LocalVibe supports 9 categories: Music, Food, Arts, Sports, Community, Nightlife, Markets, Technology, and Other."

**Speaker:** "I'll select 'Technology' to filter for technology-related events. The list now shows only technology events. This is useful for users interested in specific types of events."

#### Step 4: Show Multiple Filters (1 minute)

**Action:** Add a date filter, then clear filters

**Speaker:** "I can also filter by date range. Let me set a start date and end date. The events are now filtered to show only those within the selected date range."

**Speaker:** "Filters can be combined. For example, I could filter by both category and date. To reset all filters, I simply click the 'Clear' button, and all events are displayed again."

#### Step 5: Show Event Details (1 minute)

**Action:** Click on an event card to open details

**Speaker:** "When I click on an event card, the event details are displayed. I can see the full description, exact location, date and time, and RSVP options."

**Speaker:** "The map automatically centers on this event and zooms in for a better view. This helps users understand the event's location visually."

#### Step 6: Show Map and Markers (30 seconds)

**Action:** Click on different map markers, show popups

**Speaker:** "The interactive map allows users to explore events spatially. Each marker represents an event. When I click a marker, a popup opens with event details and RSVP controls."

**Speaker:** "Featured events have gold markers to make them stand out. This helps users quickly identify highlighted events."

#### Step 7: Show Geolocation (30 seconds)

**Action:** Click "Use My Location" button (if permission is granted)

**Speaker:** "LocalVibe also supports geolocation. When I click 'Use My Location', the browser asks for permission. If granted, my location is shown on the map as a cyan circle."

**Speaker:** "With my location detected, I can use the radius filter to find events within a specific distance from my current location."

#### Step 8: Show Event Creation (2 minutes)

**Action:** Click "Create" tab, fill out event form

**Speaker:** "Now let me demonstrate creating a new event. I'll click the 'Create' tab. This opens the event creation form."

**Speaker:** "I need to provide an event title, description, start and end dates, location, category, and price. For the location, I can type an address, and the system provides suggestions via the Nominatim geocoding service."

**Action:** Type "San Francisco" in address field, select suggestion

**Speaker:** "As I type 'San Francisco', the system suggests addresses. When I select a suggestion, the coordinates are automatically populated."

**Speaker:** "I'll select 'Technology' as the category, set the price, and mark it as a featured event. Now I'll submit the form."

**Action:** Submit form, show success message, return to Discover

**Speaker:** "The form validates all required fields, and the event is created. A success message confirms the creation. When I return to the Discover page, the new event appears immediately in the list."

#### Step 9: Show RSVP Functionality (1 minute)

**Action:** Click "Going" button on an event

**Speaker:** "Users can RSVP to events to track their attendance. I'll click the 'Going' button. The button shows a loading state while the request is processed."

**Speaker:** "After a moment, the button updates to show '✓ Going', and a success message confirms the RSVP. The event now shows me as one of the attendees."

**Action:** Change to "Interested", then cancel RSVP

**Speaker:** "I can also mark myself as 'Interested' instead of 'Going'. Or I can cancel my RSVP entirely. The system ensures a user can only be in one state at a time."

#### Step 10: Show User Profile (30 seconds)

**Action:** Click "Profile" tab, show profile information

**Speaker:** "The Profile tab shows user information including name, email, and avatar. It also displays events the user is going to, events they're interested in, and events they've organized."

**Speaker:** "Personalized recommendations are shown based on the categories of events the user has previously attended."

### Architecture and Backend (1 minute)

**Action:** Open https://localvibe-backend-2026.onrender.com/api/health in new tab

**Speaker:** "Let me show you the backend API. This is the health endpoint, which confirms the API is running. The backend is built with Express.js and communicates with MongoDB Atlas."

**Speaker:** "The API provides endpoints for events, users, RSVP, geocoding, and recommendations. All communication between frontend and backend is through RESTful API calls."

### MongoDB Atlas (30 seconds)

**Action:** Show MongoDB Atlas dashboard (if accessible)

**Speaker:** "The data is stored in MongoDB Atlas, a cloud-hosted MongoDB database. We use the 2dsphere index for efficient geospatial queries, which enables the nearby event search functionality."

**Speaker:** "The database contains events with location data stored as GeoJSON Points, enabling location-based discovery."

### GitHub Repository (30 seconds)

**Action:** Show GitHub repository (if accessible)

**Speaker:** "The source code is available on GitHub. The repository contains the frontend, backend, and documentation. The project follows a clean structure with separate folders for frontend and backend."

### Conclusion (30 seconds)

**Speaker:** "In summary, LocalVibe successfully addresses the problem of local event discovery through a unified, map-based platform with geospatial search capabilities, interactive user interface, RSVP management, and personalized recommendations."

**Speaker:** "The application demonstrates the effective use of modern web technologies including React, Express, MongoDB, and Leaflet to create a functional and user-friendly event discovery system."

**Speaker:** "Thank you for your attention. I'm happy to answer any questions."

## Backup Plan

If the production deployment is unavailable during demonstration:

1. **Use Local Development:**
   - Start backend: `cd backend && npm run dev`
   - Start frontend: `cd frontend && npm run dev`
   - Open http://localhost:5173

2. **Use Screenshots:**
   - Show pre-captured screenshots of key features
   - Explain functionality verbally

3. **Focus on Code:**
   - Show source code in IDE
   - Explain implementation details
   - Demonstrate architecture through diagrams

## Common Questions and Answers

**Q: What happens if the geocoding service is down?**
A: The application handles geocoding failures gracefully. If Nominatim is unavailable, users can still create events by manually entering coordinates (not implemented in current version), or the system shows an error message and allows retry.

**Q: How does the system handle concurrent RSVPs?**
A: The current version uses immediate UI updates for responsiveness. The backend processes RSVPs sequentially. For high-traffic scenarios, database-level atomic operations would ensure consistency.

**Q: Can users edit or delete events they didn't create?**
A: The frontend only shows edit/delete buttons to event organizers, but the backend doesn't enforce this restriction. This is acceptable for MVP demonstration but would need proper authorization for production.

**Q: How does the system handle image failures?**
A: Images have an onError handler that replaces broken images with a fallback SVG. This ensures the UI remains clean even if image URLs are invalid.

**Q: What happens if MongoDB connection fails?**
A: The backend implements connection retry logic with up to 4 attempts. If all attempts fail, the application exits with an error message. The frontend shows a connection error to users.

## Tips for Smooth Demonstration

1. **Test beforehand:** Verify all features work in the production environment
2. **Have backup plan:** Know what to do if production is down
3. **Practice timing:** Rehearse the demo to fit within time limits
4. **Prepare data:** Have interesting events already created
5. **Know your talk:** Be ready to explain each feature technically
6. **Handle errors gracefully:** If something fails, explain the issue and continue
7. **Engage audience:** Ask if they have questions between sections
8. **Show enthusiasm:** Demonstrate the value of your work
9. **Be honest:** Acknowledge limitations and future improvements
10. **Stay on time:** Monitor time and adjust pace accordingly

## Equipment Checklist

- [ ] Laptop with internet connection
- [ ] Browser with tabs ready (LocalVibe, backend health, GitHub, MongoDB Atlas)
- [ ] Projector or screen sharing capability
- [ ] Backup screenshots loaded locally
- [ ] Presentation slides ready
- [ ] Notes for technical explanations
- [ ] Timer to track demonstration time

## Post-Demonstration

After the demonstration:

1. **Collect feedback:** Note questions and suggestions
2. **Document issues:** Record any problems encountered
3. **Update documentation:** Note any changes needed
4. **Plan improvements:** Identify areas for future work
5. **Thank evaluators:** Express appreciation for their time
