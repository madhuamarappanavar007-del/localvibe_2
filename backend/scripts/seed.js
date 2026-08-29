import 'dotenv/config';
import mongoose from 'mongoose';
import { connectDB } from '../config/db.js';
import User from '../models/User.js';
import Event from '../models/Event.js';

const users = [
  { name: 'Alex Rivera', email: 'alex@localvibe.test', avatar: 'https://i.pravatar.cc/150?u=alex' },
  { name: 'Jordan Lee', email: 'jordan@localvibe.test', avatar: 'https://i.pravatar.cc/150?u=jordan' },
  { name: 'Sam Patel', email: 'sam@localvibe.test', avatar: 'https://i.pravatar.cc/150?u=sam' },
  { name: 'Taylor Kim', email: 'taylor@localvibe.test', avatar: 'https://i.pravatar.cc/150?u=taylor' },
  { name: 'Morgan Chen', email: 'morgan@localvibe.test', avatar: 'https://i.pravatar.cc/150?u=morgan' },
];

function makeLocalImage(category, title) {
  const palette = {
    Music: '#8b5cf6',
    Food: '#f97316',
    Arts: '#ec4899',
    Sports: '#22c55e',
    Community: '#38bdf8',
    Nightlife: '#f59e0b',
    Markets: '#84cc16',
    Technology: '#06b6d4',
    Other: '#a78bfa',
  };

  const color = palette[category] || '#6366f1';
  const text = title.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="800" height="400" viewBox="0 0 800 400">
      <defs>
        <linearGradient id="bg" x1="0" x2="1">
          <stop offset="0%" stop-color="#0f172a"/>
          <stop offset="100%" stop-color="${color}"/>
        </linearGradient>
      </defs>
      <rect width="800" height="400" fill="url(#bg)"/>
      <circle cx="135" cy="120" r="70" fill="rgba(255,255,255,0.18)"/>
      <circle cx="660" cy="250" r="110" fill="rgba(255,255,255,0.12)"/>
      <text x="50%" y="38%" text-anchor="middle" fill="#f8fafc" font-family="Segoe UI, Arial, sans-serif" font-size="26" font-weight="700">${category}</text>
      <text x="50%" y="58%" text-anchor="middle" fill="#f8fafc" font-family="Segoe UI, Arial, sans-serif" font-size="30" font-weight="700">${text}</text>
    </svg>
  `;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

const seedEvents = [
  {
    title: 'Brooklyn Flea Market',
    description: 'Vintage finds, local artisans, and street food in DUMBO.',
    city: 'New York',
    address: '80 Pearl St, Brooklyn, NY 11201',
    lat: 40.7033,
    lng: -73.9883,
    category: 'Markets',
    price: 0,
    daysFromNow: 2,
    durationHours: 6,
    isFeatured: true,
    image: makeLocalImage('Markets', 'Brooklyn Flea Market'),
  },
  {
    title: 'Jazz in the Park',
    description: 'Live jazz ensemble under the stars at Central Park.',
    city: 'New York',
    address: 'Central Park, New York, NY 10024',
    lat: 40.7829,
    lng: -73.9654,
    category: 'Music',
    price: 15,
    daysFromNow: 3,
    durationHours: 3,
    isFeatured: false,
    image: makeLocalImage('Music', 'Jazz in the Park'),
  },
  {
    title: 'Open Mic Night',
    description: 'Poets, comedians, and musicians welcome. Sign up at 7pm.',
    city: 'New York',
    address: '2 Avenue A, New York, NY 10009',
    lat: 40.7264,
    lng: -73.9818,
    category: 'Nightlife',
    price: 5,
    daysFromNow: 1,
    durationHours: 4,
    isFeatured: false,
    image: makeLocalImage('Nightlife', 'Open Mic Night'),
  },
  {
    title: 'Community Yoga in the Square',
    description: 'Free outdoor yoga session for all levels.',
    city: 'New York',
    address: 'Washington Square Park, New York, NY',
    lat: 40.7308,
    lng: -73.9973,
    category: 'Community',
    price: 0,
    daysFromNow: 4,
    durationHours: 1,
    isFeatured: false,
    image: makeLocalImage('Community', 'Community Yoga in the Square'),
  },
  {
    title: 'Brick Lane Food Festival',
    description: 'Street food from around the world on Brick Lane.',
    city: 'London',
    address: 'Brick Lane, London E1 6RL, UK',
    lat: 51.5215,
    lng: -0.0719,
    category: 'Food',
    price: 0,
    daysFromNow: 2,
    durationHours: 8,
    isFeatured: true,
    image: makeLocalImage('Food', 'Brick Lane Food Festival'),
  },
  {
    title: 'Southbank Open Air Cinema',
    description: 'Classic films on the Thames. Bring a blanket.',
    city: 'London',
    address: 'Southbank Centre, London SE1 8XX, UK',
    lat: 51.5055,
    lng: -0.1164,
    category: 'Arts',
    price: 12,
    daysFromNow: 5,
    durationHours: 3,
    isFeatured: false,
    image: makeLocalImage('Arts', 'Southbank Open Air Cinema'),
  },
  {
    title: 'Camden Garage Sale Trail',
    description: 'Neighborhood-wide garage sales. Map available on arrival.',
    city: 'London',
    address: 'Camden High St, London NW1 7JE, UK',
    lat: 51.539,
    lng: -0.1426,
    category: 'Community',
    price: 0,
    daysFromNow: 6,
    durationHours: 5,
    isFeatured: false,
    image: makeLocalImage('Community', 'Camden Garage Sale Trail'),
  },
  {
    title: 'Hyderabad Literary Meetup',
    description: 'Local authors read from new works. Chai and snacks included.',
    city: 'Hyderabad',
    address: 'HITEC City, Hyderabad, Telangana 500081',
    lat: 17.4435,
    lng: 78.3772,
    category: 'Arts',
    price: 0,
    daysFromNow: 3,
    durationHours: 2,
    isFeatured: false,
    image: makeLocalImage('Arts', 'Hyderabad Literary Meetup'),
  },
  {
    title: 'Sunday Farmers Market',
    description: 'Organic produce, homemade pickles, and live folk music.',
    city: 'Hyderabad',
    address: 'Banjara Hills, Hyderabad, Telangana 500034',
    lat: 17.4126,
    lng: 78.4477,
    category: 'Markets',
    price: 0,
    daysFromNow: 7,
    durationHours: 4,
    isFeatured: true,
    image: makeLocalImage('Markets', 'Sunday Farmers Market'),
  },
  {
    title: 'Cricket Watch Party',
    description: 'Big screen IPL viewing with food stalls.',
    city: 'Hyderabad',
    address: 'Gachibowli Stadium Rd, Hyderabad, Telangana',
    lat: 17.4401,
    lng: 78.3489,
    category: 'Sports',
    price: 10,
    daysFromNow: 2,
    durationHours: 4,
    isFeatured: false,
    image: makeLocalImage('Sports', 'Cricket Watch Party'),
  },
  {
    title: 'Indie Band Showcase',
    description: 'Three local bands, one unforgettable night.',
    city: 'San Francisco',
    address: 'The Independent, 628 Divisadero St, San Francisco, CA',
    lat: 37.7749,
    lng: -122.4376,
    category: 'Music',
    price: 20,
    daysFromNow: 4,
    durationHours: 3,
    isFeatured: true,
    image: makeLocalImage('Music', 'Indie Band Showcase'),
  },
  {
    title: 'Mission District Taco Crawl',
    description: 'Self-guided taco tour with discount punch card.',
    city: 'San Francisco',
    address: 'Mission Dolores Park, San Francisco, CA',
    lat: 37.7596,
    lng: -122.4269,
    category: 'Food',
    price: 8,
    daysFromNow: 1,
    durationHours: 3,
    isFeatured: false,
    image: makeLocalImage('Food', 'Mission District Taco Crawl'),
  },
  {
    title: 'Indiranagar Street Music Festival',
    description: 'Local indie bands play across three venues on 100 Feet Road.',
    city: 'Bengaluru',
    address: '100 Feet Road, Indiranagar, Bengaluru, Karnataka 560038',
    lat: 12.9719,
    lng: 77.6412,
    category: 'Music',
    price: 0,
    daysFromNow: 2,
    durationHours: 5,
    isFeatured: true,
    image: makeLocalImage('Music', 'Indiranagar Street Music Festival'),
  },
  {
    title: 'Cubbon Park Sunday Run & Yoga',
    description: 'Free community run followed by a group yoga session under the trees.',
    city: 'Bengaluru',
    address: 'Cubbon Park, Bengaluru, Karnataka 560001',
    lat: 12.9763,
    lng: 77.5929,
    category: 'Community',
    price: 0,
    daysFromNow: 4,
    durationHours: 2,
    isFeatured: false,
    image: makeLocalImage('Community', 'Cubbon Park Sunday Run & Yoga'),
  },
  {
    title: 'HSR Layout Farmers Market',
    description: 'Organic vegetables, cold-pressed oils, and local millet snacks.',
    city: 'Bengaluru',
    address: '27th Main Road, HSR Layout, Bengaluru, Karnataka 560102',
    lat: 12.9121,
    lng: 77.6446,
    category: 'Markets',
    price: 0,
    daysFromNow: 6,
    durationHours: 4,
    isFeatured: true,
    image: makeLocalImage('Markets', 'HSR Layout Farmers Market'),
  },
  {
    title: 'Koramangala Craft Beer Tasting',
    description: 'Sample brews from five Bengaluru microbreweries in one evening.',
    city: 'Bengaluru',
    address: '5th Block, Koramangala, Bengaluru, Karnataka 560095',
    lat: 12.9352,
    lng: 77.6245,
    category: 'Nightlife',
    price: 25,
    daysFromNow: 3,
    durationHours: 3,
    isFeatured: false,
    image: makeLocalImage('Nightlife', 'Koramangala Craft Beer Tasting'),
  },
  {
    title: 'Lalbagh Botanical Garden Art Walk',
    description: 'Guided walk through Lalbagh with local sketch artists and a plein-air session.',
    city: 'Bengaluru',
    address: 'Lalbagh Botanical Garden, Mavalli, Bengaluru, Karnataka 560004',
    lat: 12.9507,
    lng: 77.5848,
    category: 'Arts',
    price: 5,
    daysFromNow: 5,
    durationHours: 3,
    isFeatured: false,
    image: makeLocalImage('Arts', 'Lalbagh Botanical Garden Art Walk'),
  },
  {
    title: 'Whitefield Weekend Cricket League',
    description: 'Amateur box-cricket tournament open to walk-in teams.',
    city: 'Bengaluru',
    address: 'ITPL Main Road, Whitefield, Bengaluru, Karnataka 560066',
    lat: 12.9698,
    lng: 77.7500,
    category: 'Sports',
    price: 10,
    daysFromNow: 7,
    durationHours: 4,
    isFeatured: false,
    image: makeLocalImage('Sports', 'Whitefield Weekend Cricket League'),
  },
  {
    title: 'Jayanagar Food Street Night',
    description: 'South Indian street food stalls line 4th Block into the night.',
    city: 'Bengaluru',
    address: '4th Block, Jayanagar, Bengaluru, Karnataka 560011',
    lat: 12.9250,
    lng: 77.5938,
    category: 'Food',
    price: 0,
    daysFromNow: 1,
    durationHours: 5,
    isFeatured: true,
    image: makeLocalImage('Food', 'Jayanagar Food Street Night'),
  },
];

function addDays(days) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  d.setHours(18, 0, 0, 0);
  return d;
}

async function seed() {
  await connectDB();

  console.log('Clearing existing data...');
  await Promise.all([Event.deleteMany({}), User.deleteMany({})]);

  console.log('Creating users...');
  const createdUsers = await User.insertMany(users);

  createdUsers[0].following = [createdUsers[1]._id, createdUsers[2]._id];
  createdUsers[0].attendedCategories = ['Music', 'Markets'];
  createdUsers[1].following = [createdUsers[0]._id, createdUsers[3]._id];
  createdUsers[1].attendedCategories = ['Food', 'Nightlife'];
  await Promise.all(createdUsers.map((u) => u.save()));

  console.log('Creating events...');
  const events = seedEvents.map((e, i) => {
    const startDate = addDays(e.daysFromNow);
    const endDate = new Date(startDate);
    endDate.setHours(endDate.getHours() + e.durationHours);

    return {
      title: e.title,
      description: e.description,
      startDate,
      endDate,
      location: {
        address: e.address,
        coordinates: {
          type: 'Point',
          coordinates: [e.lng, e.lat],
        },
      },
      category: e.category,
      price: e.price,
      image: e.image,
      organizer: createdUsers[i % createdUsers.length]._id,
      isFeatured: e.isFeatured,
      going: i % 3 === 0 ? [createdUsers[0]._id, createdUsers[1]._id] : [createdUsers[2]._id],
      interested: [createdUsers[3]._id],
    };
  });

  await Event.insertMany(events);

  console.log(`Seeded ${createdUsers.length} users and ${events.length} events.`);
  console.log('Demo login user: alex@localvibe.test (select Alex in the app)');
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
