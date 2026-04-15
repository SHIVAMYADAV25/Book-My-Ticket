import { and, eq } from "drizzle-orm"
import {db} from "../../common/db/index.js"
import {seatTable, showTable} from "../../common/db/schema.js"
import ApiError from "../../common/utils/api-error.js"
import { getMoviesById } from "../movie/movie.service.js"


const generateSeat = async(showId,totalSeat) =>{
    const rows = 'ABCDEFGHIJ'
    const seatPerRow = Math.ceil(totalSeat/rows.length);
    const seats=[];

    let count = 0;
    for(const row of rows){
        for(let i = 1 ; i <= seatPerRow && count < totalSeat ;i++){
            seats.push({
                showId,
                seatNumber : `${row}${i}`,
                isBooked : false,
            })

            count++
        }
    }
    return seats
}


const getShowById = async(showId) => {
    const show = await db.select().from(showTable).where(and(eq(showTable.id,showId),eq(showTable.isActive,true)))

    if(show.length == 0) throw ApiError.notfound("Show not found");

    return show[0];
}

const getShowByMovie = async(movieId) => {
    await getMoviesById(movieId)

    const showByMovie = await db.select().from(showTable).where(and(eq(showTable.movieId,movieId),eq(showTable.isActive,true)));

    if(showByMovie.length == 0 )throw ApiError.notfound("show not found");

    return showByMovie;
}

const createShow = async(data) =>{
    const {movieId,showTime , hall , totalSeats = 100 , price} = data;

    const insertedShow = await db.insert(showTable).values({
        movieId,
        hall,
        showTime : new Date(showTime),
        totalSeats,
        availableSeats : totalSeats,
        price
    }).returning()


    if(insertedShow.length == 0) throw ApiError.notfound("");

    const show = insertedShow[0];

    const seat = await generateSeat(show.id,totalSeats);
    // console.log(seat)
    await db.insert(seatTable).values(seat);

    return show
}


export{
    createShow,
    getShowById,
    getShowByMovie,
}