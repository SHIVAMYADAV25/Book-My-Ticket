import ApiResponse from "../../common/utils/api-response"
import * as BookingServices from "./booking.service.js"


const bookseat = async(req,res) =>{
    const result = await BookingServices.bookSeats(req.user.id,{
        showId : req.body.showId,
        seatIds : req.body.seatIds,
    })

    ApiResponse.created(res,"Seats booked successfully",result)
}

const getMyBooking = async(req,res)=>{
    const result = await BookingServices.getMyBooking(req.user.id);
    ApiResponse.ok(res,"Seat Booked successfully",result)
}

const getBookingById = async(req,res)=>{
    const Booking = await BookingServices.getBookingById(
        req.params.id,
        req.user.id
    )

    ApiResponse.ok(res,"Booking fetched successfully",Booking);
}

const cancelBooking = async(req,res)=>{
    const result = await BookingServices.cancleBooking(
        req.params.id,
        req.user.id
    )
    ApiResponse.ok(res, result.message);
}

const getAllBooking = async(req,res)=>{
    const {page = 1,limit = 20} = req.query;
    const bookings = await BookingServices.getAllBooking({
        page: Number(page),
        limit:Number(limit)
    });
    ApiResponse.ok(res,"All Booking fetched successfully",bookings);
}

export {bookseat,getAllBooking,getBookingById,getMyBooking,cancelBooking};