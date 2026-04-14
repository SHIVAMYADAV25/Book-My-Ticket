
import { and, eq } from "drizzle-orm";
import {db} from "../../common/db/index.js"
import { movieTable } from "../../common/db/schema.js";
import ApiError from "../../common/utils/api-error.js";



const getAllMovies = async( {page = 1, limit = 10, genre, language} ) => {
    const offset = (page - 1) * limit;

    let query = await db.select().from(movieTable).where(eq(movieTable.isActive,true));

    const movies = await query.limit(limit).offset(offset);

    return movies
}

const getMoviesById = async (movieId) => {
    const movie = await db.select().from(movieTable).where(and(eq(movieTable.id,movieId),eq(movieTable.isActive,true)))

    if(movie.length == 0) throw ApiError.notfound("Movie not found")
    
    return movie[0];
}

const createMovie = async(data) =>{
    const insertedMovie = await db.insert(movieTable).values(data).returning();

    return insertedMovie[0];
}

const updateMovie = async(movieId,data) => {
    const updatedMovie = db.update(movieTable).set({...data,updatedAt : new Date()}).where(eq(movieTable.id,movieId)).returning();

    if(updateMovie == 0) throw ApiError.notfound("Movie not found");

    return updateMovie[0]
}

const deleteMovie = async (movieId) => {
    // const deletedMovie = db.delete(movieTable).where(eq(movieTable.id,movieId))

    // soft delete

    await db.update(movieTable).set({isActive : false}).where(eq(movieTable.id , movieId));
}

export {
    getAllMovies,
    getMoviesById,
    deleteMovie,
    updateMovie,
    createMovie
}