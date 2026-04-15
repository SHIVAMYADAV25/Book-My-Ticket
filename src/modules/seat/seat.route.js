import { Router } from "express";
import * as seatController from "./seat.controller.js"

const router = Router();

router.get("/shows/:showId/seats",seatController.getALlseats);
router.get("/shows/:showId/seats/available",seatController.getAvailableSeats);

export default router;