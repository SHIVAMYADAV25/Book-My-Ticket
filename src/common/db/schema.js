import { pgTable, varchar, boolean, timestamp, uuid, integer, unique, pgEnum } from "drizzle-orm/pg-core";

const roleEnum = pgEnum("role", ["user", "admin"]);
const bookingStatusEnum = pgEnum("booking_status", [
  "confirmed",
  "cancelled",
]);

const userTable = pgTable('users', {
    id: uuid("id").primaryKey().defaultRandom(),

    name: varchar("name", { length: 255 }).notNull(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    
    password: varchar("password", { length: 255 }).notNull(), 

    role: roleEnum("role").default("user"),
    isVerified: boolean("is_verified").default(false),

    verificationToken: varchar("verification_token", { length: 255 }),
    refreshToken: varchar("refresh_token", { length: 255 }),
    resetPasswordToken: varchar("reset_password_token", { length: 255 }),
    resetPasswordExpires: timestamp("reset_password_expires"),

    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").$onUpdate(() => new Date())
});


const movieTable = pgTable("movies",{
  id : uuid("id").primaryKey().defaultRandom(),

  title : varchar("title",{length : 255}).notNull(),
  description : varchar("description",{length : 1000}),
  genre : varchar("genre",{length:100}),
  language : varchar("language" , {length : 50}).default("English"),
  durationMinutes : integer("duration_minutes").notNull(),
  releaseDate : timestamp("release_date"),
  posterUrl : varchar("poster_url",{length : 500}),

  isActive : boolean("is_active").default(true),

  createdAt : timestamp("created_at").defaultNow().notNull(),
  updatedAt : timestamp("updated_at").$onUpdate(() => new Date())
})

const showTable = pgTable("shows",{
  id : uuid("id").primaryKey().defaultRandom(),

  movieId : uuid("movie_id").notNull().references(() => movieTable.id , {onDelete : "cascade"}),


  showTime : timestamp("show_time").notNull(),
  hall : varchar("hall" , {length : 100}).notNull(),
  totalSeats : integer("total_seat").notNull().default(100),
  availableSeats : integer("available_seat").notNull().default(100),
  price : integer("price").notNull(),

  isActive : boolean("is_active").default(true),

  createdAt : timestamp("created_at").defaultNow().notNull(),
  updatedAt : timestamp("updated_at").$onUpdate(() => new Date())
})


const seatTable = pgTable("seats" , {

  id : uuid("id").primaryKey().defaultRandom(),

  showId : uuid("show_id").notNull().references(() => showTable.id , {onDelete : "cascade"}),

  seatNumber : varchar("seat_number",{length : 10}).notNull(),  // e.g. "A1", "B12"
  isBooked : boolean("is_booked").default(false),

  createdAt : timestamp("created_at").defaultNow().notNull(),
},
(table) =>({
  // Prevent duplicate seat numbers within the same show
  uniqueShowSeat : unique().on(table.showId , table.seatNumber)
})
)


const bookingTable = pgTable("bookings" , {
  id : uuid("id").primaryKey().defaultRandom(),

  userId : uuid("user_id")
  .notNull()
  .references(() => userTable.id , {onDelete : "cascade"}),

  movieId : uuid("movie_id").notNull().references(() => movieTable.id , {onDelete : "cascade"}),

  showId : uuid("show_id").notNull().references(() => showTable.id , {onDelete : "cascade"}),

  seatId : uuid("seat_id").notNull().references(() => seatTable.id , {onDelete :"cascade"}),

  status: bookingStatusEnum("status").default("confirmed"),
  totalAmount : integer("total_amount").notNull(),

  createdAt : timestamp("created_at").defaultNow().notNull(),
  updatedAt : timestamp("updated_at").$onUpdate(() => new Date())

})



export {
   userTable ,
   roleEnum,
   bookingStatusEnum,
   bookingTable,
   movieTable,
   seatTable,
   showTable
}