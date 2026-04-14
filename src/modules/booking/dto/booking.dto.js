import Joi from "joi"
import BaseDto from "../../../common/dto/base.dto.js"

export class BookseatsDto extends BaseDto{
    static  schema = Joi.object({
        showId : Joi.string().uuid().required(),
        seatIds : Joi.array()
        .items(Joi.string().uuid())
        .min(1)
        .max(10)
        .required()
        .message({
            "array.min" : "please select at least one seat",
            "arrat:max" : "cannot book more than 10 seats at once",
        })
    });
}