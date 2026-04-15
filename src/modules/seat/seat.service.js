import { and, eq } from "drizzle-orm"
import { db } from "../../common/db/index.js"
import { seatTable } from "../../common/db/schema.js"
import ApiError from "../../common/utils/api-error.js"
import { getShowById } from "../show/show.service.js"

const getAvailableSeat = async(showId)=>{

    await getShowById(showId);

    const availableSeat = await db.select().from(seatTable).where(and(eq(seatTable.showId,showId),eq(seatTable.isBooked,false)))

    if(availableSeat.length == 0) throw ApiError.notfound("Seat are not available");

    return availableSeat
}

const getAllseat = async(showId)=>{
    await getShowById(showId);

    const allSeat = await db.select().from(seatTable).where(eq(seatTable.showId,showId));

    if(allSeat.length == 0) throw ApiError.notfound("seat are not Available");

    return allSeat
}

export {
    getAllseat,
    getAvailableSeat
}
