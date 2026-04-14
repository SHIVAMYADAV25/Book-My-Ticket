import ApiResponse from "../../common/utils/api-response";
import * as showServices from "./show.service.js" 


const getShowByMovie = async(req,res) =>{
    const shows = await showServices.getShowByMovie(req.params.movieId);
    ApiResponse.ok(res,"Show fetched successfully",shows);
}

const createShow = async(req,res)=>{
    const show = await showServices.createShow({
        ...req.body,
        movieId : req.params.movieId
    })

    ApiResponse.created(res,"Show created Successfully",show)
};

const getShowById = async(req,res)=>{
    const show = await showServices.getShowById(req.params.showId);
    ApiResponse.ok(res,"Show fetched successfully",show);

}

export {
    getShowById,
    getShowByMovie,
    createShow
}

