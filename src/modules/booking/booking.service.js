import { and, eq, inArray } from "drizzle-orm";
import { db } from "../../common/db";
import { bookingTable, movieTable, seatTable, showTable, userTable } from "../../common/db/schema";
import ApiError from "../../common/utils/api-error"

const bookSeats = async(userId,{showId , seatIds})=>{
    if(!Array.isArray(seatIds) || seatIds.length == 0){
        throw ApiError.badRequest("Please select at least one seat");
    }

    if(seatIds.length > 10){
        throw ApiError.badRequest("Cannot book more than 10 seats at once");
    }

    const result = await db.transaction(async (tx) => {

        const shows = await tx.select()
        .from(showTable)
        .where(and(eq(showTable.id,showId),eq(showTable.isActive,true)))

        if(shows.length == 0) throw ApiError.notfound("show can not found");

        const show = shows[0];

        if(new Date(show.showTime) < new Date()){
            throw ApiError.badRequest("Cannot book seats for a past show")
        }

        const seats = await tx
        .select()
        .from(seatTable)
        .where(
            and(eq(seatTable.showId,showId),inArray(seatTable.id,seatIds))
        )

        // Validate all seatIds belong to this show
        if(seats.length !== seatIds.length){
            throw ApiError.badRequest("One or More seats IDs are invalid for this shoq")
        }

        const alreadyBooked = seats.filter((s) => s.isBooked);

        if(alreadyBooked.length > 0){
            const bookedNums = alreadyBooked.map((s) => s.seatNumber).join(", ");
            throw ApiError.conflict(
                `seat(s) ${bookedNums} are already booked. please choose differnet seats`
            )
        }

        if(show.availableSeats < seatIds.length){
            throw ApiError.conflict("Not enuogh avaiable seats for this show");
        }

        await tx
        .update(seatTable)
        .set({isBooked : true})
        .where(inArray(seatTable.id,seatIds));

        await tx
        .update(show)
        .set({availableSeats: show.availableSeats - seatIds.length})
        .where(eq(showTable.id,showId));

        const bookingRecords = seatIds.map((seatId) => ({
            userId,
            showId,
            seatId,
            status : "confirmed",
            totalAmount : show.price,
        }));

        const booking = await tx
        .insert(bookingTable)
        .values(bookingRecords)
        .returning();

        return {
         booking,
         totalAmount : show.price * seatIds.length,
         seatsBooked : seats.map((s) => s.seatNumber), 
        }
    })

    return result
}


const getMyBooking = async (userId) =>{

    const booking = await db.
    select({
        bookingId : bookingTable.id,
        status : bookingTable.status,
        totalAmount : bookingTable.totalAmount,
        createdAt : bookingTable.createdAt,
        seatNumber : seatTable.seatNumber,
        showTime : showTable.showTime,
        hall : showTable.hall,
        movieTitle : movieTable.title,
        movieGenre : movieTable.genre,
        movieLanguage : movieTable.language
    })
    .from(bookingTable)
    .innerJoin(seatTable,eq(bookingTable.seatId,seatTable.id))
    .innerJoin(showTable,eq(bookingTable.showId,showTable.id))
    .innerJoin(movieTable,eq(bookingTable.movieId,movieTable.id))
    .where(eq(bookingTable.userId,userId))
    .orderBy(bookingTable.createdAt)

    return booking
}

const getBookingById = async (bookingId,userId) =>{

    const booking = await db.
    select({
        bookingId : bookingTable.id,
        status : bookingTable.status,
        totalAmount : bookingTable.totalAmount,
        createdAt : bookingTable.createdAt,
        seatNumber : seatTable.seatNumber,
        showTime : showTable.showTime,
        hall : showTable.hall,
        movieTitle : movieTable.title,
        movieGenre : movieTable.genre,
        movieLanguage : movieTable.language
    })
    .from(bookingTable)
    .innerJoin(seatTable,eq(bookingTable.seatId,seatTable.id))
    .innerJoin(showTable,eq(bookingTable.showId,showTable.id))
    .innerJoin(movieTable,eq(bookingTable.movieId,movieTable.id))
    .where(and(eq(bookingTable.id,bookingId),eq(bookingTable.userId,userId)))
    
    if(booking.length == 0){
        throw ApiError.notfound("Booking can not be found");
    }

    return booking[0]
}



const cancleBooking = async(bookingId , userId) => {
    // start a transaction using db.transaction
    // Fetch booking — ensure it belongs to this user
    // id not found give error
    // check the status isBooked
    // verify show hasn't started yet
    // Allow cancellation only if show is more than 1 hour away
    // is the time has been passed give error
    // mark booking as cancelled
    // free up the seat in seat table
    // Increment available seats on show in show table
    // return {booking has been cancelled}

    await db.transaction( async(tx) => {
        const bookings = await tx.select().from(bookingTable).where(eq(bookingTable.id,bookingId));

        if(bookings.length == 0) {
            throw ApiError.notfound("Booking not found");
        }

        const booking = bookings[0];

        if(booking.status == "cancelled"){
            throw ApiError.badRequest("Booking already cancelled");
        }

        const shows = await tx.select().from(showTable).where(eq(showTable.id,booking.showId));

        const show = shows[0];

        const oneHoursBeforeNow = new Date(Date.now() * 60 * 60 * 1000);

        if(new Date(show.showTime) > oneHoursBeforeNow){
            throw ApiError.badRequest("Cannot cancel booking less than 1 hour before show time");
        }

        await tx.update(bookingTable).set({status : "cancelled"}).where(eq(bookingTable.id,bookingId))

        await tx.update(seatTable).set({isBooked : false}).where(eq(seatTable.id,booking.seatId))

        await tx.update(showTable).set({availableSeats : show.availableSeats + 1}).where(eq(showTable.id,booking.showId));

    })

    return { message:"booking has been cancelled"}

}

const getAllBooking = async({page = 1,limit = 20} = {}) =>{
    const offset = (page - 1) * limit;

    const bookings = await db.select({
        bookingId : bookingTable.id,
        userId : bookingTable.userId,
        status : bookingTable.status,
        totalAmount : bookingTable.totalAmount,
        createdAt : bookingTable.createdAt,
        seatNumber : seatTable.seatNumber,
        showTime : showTable.showTime,
        hall : showTable.hall,
        movieTitle : movieTable.title,
        userName : userTable.name,
        userEmail : userTable.email
    }).from(bookingTable)
    .innerJoin(seatTable,eq(bookingTable.seatId,seatTable.id))
    .innerJoin(showTable,eq(bookingTable.showId,showTable.id))
    .innerJoin(movieTable,eq(bookingTable.movieId,movieTable.id))
    .innerJoin(userTable,eq(bookingTable.userId,userTable.id))
    .orderBy(bookingTable.createdAt)
    .limit(limit)
    .offset(offset)

    return bookings;
}


export {
    cancleBooking,
    getBookingById,
    getMyBooking,
    getAllBooking
}