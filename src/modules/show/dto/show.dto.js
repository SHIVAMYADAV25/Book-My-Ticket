import Joi from "joi";
import BaseDto from "../../../common/dto/base.dto";

export class createShowDto extends BaseDto{
    static schema = Joi.object({
        showTime : Joi.date().iso().greater("now").required(),
        hall : Joi.string().trim().max(100).required(),
        totalSeats : Joi.number().integer().min(10).max(500).default(100),
        price: Joi.number().integer().min(1).required()
    })
}