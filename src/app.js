import cookieParser from "cookie-parser";
import express from "express";
import cors from "cors";
import authRoute from "./modules/auth/auth.routes.js";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

import bookingRoute from "./modules/booking/booking.routes.js"
import movieRoute from "./modules/movie/movie.route.js"
import seatRoute from "./modules/seat/seat.route.js";
import showRoute from "./modules/show/show.route.js"

const app = express();

const allowedOrigin = (process.env.CORS_ORIGIN || "http://localhost:5500,http://127.0.0.1:5500,http://localhost:5173,null").split(",");

app.use(cors({
  origin:(origin,cb)=>{
    if(!origin || allowedOrigin.includes(origin)) cb(null,true);
    else cb(new Error("CORS: origin " + origin + " not allowed"));
  },
  credentials : true,
  methods:["GET","POST","PUT","PATCH","DELETE","OPTIONS"],
  allowedHeaders:["Content-Type","Authorization"],
}));

app.use(helmet({crossOriginResourcePolicy : {policy : "cross-origin"}}))

app.use(rateLimit({windowMs : 15*60*1000,max:200,standardHeaders:true,legacyHeaders:false,
  message : {success : false,message : "Too many request"}
}))

const authLimit = rateLimit({windowMs : 15*60*1000,max:20,
  message: {success : false,message : "Too many auth attempts"}
})

app.use(express.json({limit : "10kb"}));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/v1/auth", authLimit);

app.get("/health",(req,res) => res.json({
  success :true,
  message : "Running",
  ts : new Date().toISOString()
}))


app.use("/api/v1/auth", authRoute);
app.use("/api/v1/bookings",bookingRoute);
app.use("/api/v1/movies",movieRoute);
app.use("/api/v1/shows",showRoute);
app.use("/api/v1/movies/shows",seatRoute);

// Catch-all for undefined routes
app.all("*", (req, res) => {
  res.status(404).json({success : false,message : `Route ${req.originalUrl} not found`})
});

// app.js (LAST middleware)
app.use((err, req, res, next) => {
  console.error(err);

  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }

  return res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
});

export default app;
