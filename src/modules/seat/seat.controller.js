import ApiResponse from "../../common/utils/api-response.js";
import * as seatServices from "./seat.service.js"

const getAvailableSeats = async(req,res) =>{
    const seats = await seatServices.getAvailableSeat(req.params.showId);
    ApiResponse.ok(res,"Available seats fetched successfully",seats)
}

const getALlseats = async(req,res)=>{
    const seats = await seatServices.getAllseat(req.params.showId);
    ApiResponse.ok(res,"All seats fetched properly ",seats);
}

export{
    getALlseats,
    getAvailableSeats
}