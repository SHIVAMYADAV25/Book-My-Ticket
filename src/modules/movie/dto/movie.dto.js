import Joi from "joi"
import BaseDto from "../../../common/dto/base.dto.js";


export class createMovieDto extends BaseDto{
    static schema = Joi.object({
        title : Joi.string().trim().min(1).max(255).required(),
        description : Joi.string().trim().max(1000).optional(),
        genre : Joi.string().trim().max(100).optional(),
        language : Joi.string().trim().max(50).default("English"),
        durationMinutes : Joi.number().integer().min(1).required(),
        releaseDate : Joi.date().iso().optional(),
        posterurl : Joi.string().uri().optional()
    });
}

export class updateMovieDto extends BaseDto{
    static schema = Joi.object({
        title : Joi.string().trim().min(1).max(255).required(),
        description : Joi.string().trim().max(1000).optional(),
        genre : Joi.string().trim().max(100).optional(),
        language : Joi.string().trim().max(50).default("English"),
        durationMinutes : Joi.number().integer().min(1).required(),
        releaseDate : Joi.date().iso().optional(),
        posterurl : Joi.string().uri().optional(),
        isActive : Joi.boolean().optional(),
    })
}