import { Router } from "express";
import {BookseatsDto } from "./dto/booking.dto.js"
import * as bookingController from "./booking.controller.js"
import { authenticate, authorize } from "../auth/auth.middleware.js";
import validate from "../../common/middleware/validate.middleware.js";

const router = Router();


// All booking routes require authentication
router.use(authenticate);


// use Routes

router.post("/",validate(BookseatsDto),bookingController.bookseat);
router.get("/my",bookingController.getMyBooking);
router.get("/:id",bookingController.getBookingById);
router.patch("/:id/cancel",bookingController.cancelBooking);

//admin routes
router.get("/",authorize("admin"),bookingController.getAllBooking);


export default router;

