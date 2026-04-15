import { Router } from "express";
import * as seatController from "./seat.controller.js"

const router = Router();

router.get("/:showId/seats",seatController.getALlseats);
router.get("/:showId/seats/available",seatController.getAvailableSeats);

export default router;