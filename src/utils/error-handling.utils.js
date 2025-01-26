


export const errorHandler = (api) => {
    return(req,res,next)=>{
        api(req,res,next).catch((error)=>{
            console.log(`Error in ${req.url} from errorHandler middleware`, error);
            next( new Error(error,{cause:500}))
        })
    }
}


