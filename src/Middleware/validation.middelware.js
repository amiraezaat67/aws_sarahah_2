

export const validationMiddleware = (schema) => {
    return (req, res, next) => {
        const schemaKeys = Object.keys(schema)

        let valdiationError = []
        for(const key of schemaKeys){            
            const {error} = schema[key].validate(req[key],{abortEarly:false})
            if(error){
                valdiationError.push(...error.details)
            }
        }
        if(valdiationError.length) return res.status(400).json({ message: 'Validation Error', error:valdiationError })
        next()
    }

}