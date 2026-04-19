import * as movieService from "./movie.service.js"
import ApiResponse from "../../common/utils/api-response.js"

const getAllmovies = async(req,res) =>{
    const {page = 1,limit = 10,genre,language} = req.query;

    const movies = await movieService.getAllMovies({
        page : Number(page),
        limit : Number(limit),
        genre,
        language
    });

    ApiResponse.ok(res,"Movies fetched Successfully",movies);
}

const getMoviesById = async(req,res) =>{
    const movie = await movieService.getMoviesById(req.params.id);
    ApiResponse.ok(res, "Movie fetched successfully", movie);
}

const createMovie = async (req,res)=>{
    const movie =await movieService.createMovie(req.body);
    ApiResponse.ok(res,"movie created successfully",movie)
}

const deleteMovie = async (req,res) =>{
    const movie = await movieService.deleteMovie(req.params.id,req.body);
    ApiResponse.ok(res,"Movie Updated successfully",movie);
}

const updateMovie = async(req,res) =>{
    const movie = await movieService.updateMovie(req.params.id,req.body);
    ApiResponse.ok(res,"Movie updated Succesffully",movie)
}

export {
    getAllmovies,
    getMoviesById,
    createMovie,
    deleteMovie,
    updateMovie
}