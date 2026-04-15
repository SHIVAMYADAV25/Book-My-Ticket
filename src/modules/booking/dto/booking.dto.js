import Joi from "joi";
import BaseDto from "../../../common/dto/base.dto.js";

export class BookseatsDto extends BaseDto {
  static schema = Joi.object({
    showId: Joi.string().uuid().required(),

    seatIds: Joi.array()
      .items(Joi.string().uuid())
      .min(1)
      .max(10)
      .required()
      .messages({
        "array.min": "please select at least one seat",
        "array.max": "cannot book more than 10 seats at once",
        "any.required": "seatIds is required",
      }),
  });
}