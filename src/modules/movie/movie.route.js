import { Router } from "express";
import {
    createMovieDto,
    updateMovieDto
}from "./dto/movie.dto.js"
import * as movieController from "./movie.controller.js"
import { authenticate, authorize } from "../auth/auth.middleware.js";
import validate from "../../common/middleware/validate.middleware.js";

const router = Router();

router.get("/",movieController.getAllmovies);
router.get("/:id",movieController.getMoviesById);


// Admin
router.post(
    "/",
    authenticate,
    authorize("admin"),
    validate(createMovieDto),
    movieController.createMovie
)

router.put(
    "/:id",
    authenticate,
    authorize("admin"),
    validate(updateMovieDto),
    movieController.updateMovie
)

router.delete(
    "/:id",
    authenticate,
    authorize("admin"),
    movieController.deleteMovie
)