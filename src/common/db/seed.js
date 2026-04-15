/**
 * RICH SEED SCRIPT
 * Seeds: 3 users (1 admin + 2 regular), 10 movies, 3 shows per movie,
 * auto-generated seats (80-120 per show), pre-booked seats for realism.
 *
 * Run: node drizzle/seed.js
 */
import "dotenv/config";
import { db } from "./index.js";
import { userTable, movieTable, showTable, seatTable, bookingTable } from "./schema.js";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

const USERS = [
  { name:"Admin User",    email:"admin@bookmyticket.com", password:"Admin@1234",  role:"admin", isVerified:true },
  { name:"Rahul Sharma",  email:"rahul@example.com",      password:"Rahul@1234",  role:"user",  isVerified:true },
  { name:"Priya Mehta",   email:"priya@example.com",      password:"Priya@1234",  role:"user",  isVerified:true },
];

const MOVIES = [
  { title:"Kalki 2898 AD",                    description:"Set in a dystopian future, Kalki 2898 AD reimagines ancient Hindu prophecies in a stunning futuristic world. Prabhas stars as Kalki, the 10th avatar of Vishnu, destined to end the tyranny of Supreme Yaskin.",  genre:"Sci-Fi",   language:"Hindi",   durationMinutes:181, releaseDate:new Date("2024-06-27"), posterUrl:"https://image.tmdb.org/t/p/w500/9FFGfMpOcfFNiGFQLjMCKqcGqkR.jpg", isActive:true },
  { title:"Pushpa 2: The Rule",               description:"Pushpa Raj returns with a vengeance. As he tightens his grip on the red sandalwood smuggling empire, a fierce rivalry with the police intensifies into an explosive face-off. Allu Arjun delivers a career-defining performance.",  genre:"Action",   language:"Telugu",  durationMinutes:190, releaseDate:new Date("2024-12-05"), posterUrl:"https://image.tmdb.org/t/p/w500/jQijPCroQxG2FDYsAJEUdKfNXDL.jpg", isActive:true },
  { title:"Stree 2",                          description:"The ghost is back and she brought friends. The town of Chanderi is haunted once again. Rajkummar Rao and Shraddha Kapoor return in this beloved horror-comedy franchise with higher stakes and louder laughs.",                  genre:"Horror",   language:"Hindi",   durationMinutes:135, releaseDate:new Date("2024-08-15"), posterUrl:"https://image.tmdb.org/t/p/w500/pWsD91G2R1Da3AKM3ymr3UoIfRb.jpg", isActive:true },
  { title:"Fighter",                          description:"India's first aerial action franchise. Wing Commander Shamsher Pathania leads an elite Air Force team against a sinister terror plot. Hrithik Roshan and Deepika Padukone deliver stunning performances.",                  genre:"Action",   language:"Hindi",   durationMinutes:166, releaseDate:new Date("2024-01-25"), posterUrl:"https://image.tmdb.org/t/p/w500/sRauSFFSZFVxWK8WJhPIRcOSW4R.jpg", isActive:true },
  { title:"12th Fail",                        description:"Inspired by true events, this Vidhu Vinod Chopra masterpiece follows Manoj Kumar Sharma, a small-town boy who dares to crack the UPSC exam against all odds. A deeply moving tribute to grit and honesty.",                  genre:"Drama",    language:"Hindi",   durationMinutes:147, releaseDate:new Date("2023-10-27"), posterUrl:"https://image.tmdb.org/t/p/w500/6vyONUjtMwlUDFb0aKNBjvDluaw.jpg", isActive:true },
  { title:"Animal",                           description:"A raw father-son saga that pushes boundaries. Ranbir Kapoor plays Ranvijay, a man consumed by rage over his emotionally distant father. Directed by Sandeep Reddy Vanga, this film divided critics but captivated audiences.",  genre:"Thriller", language:"Hindi",   durationMinutes:201, releaseDate:new Date("2023-12-01"), posterUrl:"https://image.tmdb.org/t/p/w500/iIfBmcM0Qhf6IIJLQ2O3KaIXVGD.jpg", isActive:true },
  { title:"Dunki",                            description:"Rajkumar Hirani's heartfelt comedy-drama follows friends attempting illegal immigration through the 'donkey route' to reach the UK. Shah Rukh Khan and Taapsee Pannu lead this emotionally charged, laugh-out-loud journey.",  genre:"Comedy",   language:"Hindi",   durationMinutes:161, releaseDate:new Date("2023-12-21"), posterUrl:"https://image.tmdb.org/t/p/w500/yvDohQBGYzSDNQDcXLqWOl4JFpS.jpg", isActive:true },
  { title:"Rocky Aur Rani Kii Prem Kahaani", description:"Karan Johar's triumphant return to directing. A larger-than-life romance between the boisterous Rocky and cultured Rani unfolds across two families. Ranveer Singh and Alia Bhatt sizzle with irresistible chemistry.",         genre:"Drama",    language:"Hindi",   durationMinutes:168, releaseDate:new Date("2023-07-28"), posterUrl:"https://image.tmdb.org/t/p/w500/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg", isActive:true },
  { title:"Jawan",                            description:"A high-octane action thriller where a man driven by a personal vendetta rectifies wrongs in society while opposing a ruthless villain. Shah Rukh Khan stars in a dual role, directed by Atlee Kumar.",                           genre:"Action",   language:"Hindi",   durationMinutes:169, releaseDate:new Date("2023-09-07"), posterUrl:"https://image.tmdb.org/t/p/w500/oZQVRCFbKXYPOPNXkmwi3LGHWo2.jpg", isActive:true },
  { title:"Sam Bahadur",                      description:"A biographical war film about Field Marshal Sam Manekshaw, India's first field marshal and architect of the decisive 1971 war victory. Vicky Kaushal delivers an award-worthy performance as the legendary soldier.",          genre:"Drama",    language:"Hindi",   durationMinutes:158, releaseDate:new Date("2023-12-01"), posterUrl:"https://image.tmdb.org/t/p/w500/kGYqoYVRXAr6jFLFHSqAHJMwEVP.jpg", isActive:true },
];

function getShows(movieId) {
  const now = new Date();
  const d = (h) => new Date(now.getTime() + h * 3600000);
  return [
    { movieId, showTime:d(3),  hall:"Audi 1 — 4DX",       totalSeats:80,  availableSeats:80,  price:45000, isActive:true },
    { movieId, showTime:d(7),  hall:"Audi 2 — IMAX",      totalSeats:120, availableSeats:120, price:55000, isActive:true },
    { movieId, showTime:d(13), hall:"Audi 3 — Standard",  totalSeats:100, availableSeats:100, price:25000, isActive:true },
  ];
}

function generateSeats(showId, totalSeats) {
  const ROWS = "ABCDEFGHIJ";
  const perRow = Math.ceil(totalSeats / ROWS.length);
  const seats = [];
  let count = 0;
  for (const row of ROWS) {
    for (let i = 1; i <= perRow && count < totalSeats; i++) {
      seats.push({ showId, seatNumber:`${row}${i}`, isBooked:false });
      count++;
    }
  }
  return seats;
}

async function seed() {
  console.log("\n🌱  Starting rich seed...\n");

  // Users
  console.log("👤  Seeding users...");
  const hashed = await Promise.all(USERS.map(async u => ({ ...u, password: await bcrypt.hash(u.password, 10) })));
  const users = await db.insert(userTable).values(hashed).returning();
  console.log(`   ✅ ${users.length} users created`);
  users.forEach(u => console.log(`      → ${u.email} (${u.role})`));

  // Movies
  console.log("\n🎬  Seeding 10 movies...");
  const movies = await db.insert(movieTable).values(MOVIES).returning();
  console.log(`   ✅ ${movies.length} movies created`);

  // Shows + Seats
  console.log("\n🎭  Seeding shows and generating seats...");
  const allInsertedSeats = [];
  const allInsertedShows = [];

  for (const movie of movies) {
    const showDefs = getShows(movie.id);
    const shows = await db.insert(showTable).values(showDefs).returning();
    allInsertedShows.push(...shows);
    for (const show of shows) {
      const seats = generateSeats(show.id, show.totalSeats);
      const inserted = await db.insert(seatTable).values(seats).returning();
      allInsertedSeats.push(...inserted);
      console.log(`   🎫  "${movie.title.slice(0,25).padEnd(25)}" | ${show.hall.padEnd(22)} | ${inserted.length} seats`);
    }
  }

  // Pre-book seats (realism)
  console.log("\n🎟️   Pre-booking seats for realism (~10% occupancy)...");
  const adminUser  = users.find(u => u.role === "admin");
  const rahul      = users.find(u => u.email === "rahul@example.com");
  const priya      = users.find(u => u.email === "priya@example.com");

  // Pre-book first 8 seats in Audi 1 of first 5 movies
  const firstShows = allInsertedShows.filter(s => s.hall === "Audi 1 — 4DX").slice(0, 5);
  for (const show of firstShows) {
    const showSeats = allInsertedSeats.filter(s => s.showId === show.id).slice(0, 8);
    if (!showSeats.length) continue;
    for (const seat of showSeats) {
      await db.update(seatTable).set({ isBooked: true }).where(eq(seatTable.id, seat.id));
    }
    await db.update(showTable).set({ availableSeats: show.totalSeats - showSeats.length }).where(eq(showTable.id, show.id));
    const bookings = showSeats.map((seat, i) => ({
      userId: i < 3 ? adminUser.id : i < 6 ? rahul.id : priya.id,
      movieId: show.movieId,
      showId: show.id,
      seatId: seat.id,
      status: "confirmed",
      totalAmount: show.price,
    }));
    await db.insert(bookingTable).values(bookings);
    console.log(`   📌  Pre-booked ${showSeats.length} seats in show: ${show.hall}`);
  }

  console.log("\n══════════════════════════════════════════════");
  console.log("✅  SEED COMPLETE!");
  console.log("══════════════════════════════════════════════\n");
  console.log("🔑  Test Credentials:");
  console.log("   Admin  →  admin@bookmyticket.com  /  Admin@1234");
  console.log("   User 1 →  rahul@example.com       /  Rahul@1234");
  console.log("   User 2 →  priya@example.com       /  Priya@1234");
  console.log("\n📊  Summary:");
  console.log(`   Movies : ${movies.length}`);
  console.log(`   Shows  : ${allInsertedShows.length} (${movies.length} movies × 3 shows)`);
  console.log(`   Seats  : ${allInsertedSeats.length} total across all shows`);
  console.log(`   Booked : 40 pre-booked seats for realism\n`);
  process.exit(0);
}

seed().catch(err => { console.error("❌  Seed failed:", err); process.exit(1); });