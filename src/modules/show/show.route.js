import { Router } from "express";
import {createShowDto} from "./dto/show.dto.js"
import * as showController from "./show.controller.js"
import { authenticate, authorize } from "../auth/auth.middleware.js";
import validate from "../../common/middleware/validate.middleware.js";

const router = Router();


router.get("/:movieId/shows",showController.getShowByMovie);


// Admin-Only

router.post(
    "/:movieId/shows",
    authenticate,
    authorize("admin"),
    validate(createShowDto),
    showController.createShow
)

export default router;
