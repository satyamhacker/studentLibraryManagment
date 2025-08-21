import { StatusCodes } from "http-status-codes";
import constants from "../../Constants/index.constants.js";
const { MESSAGE } = constants;

export const validator = (schema, property = null) => {
    return (req, res, next) => {
        try {
            let payload;

            if (property === "params") {
                // Validate URL parameters
                payload = req.params;
            } else if (property) {
                // Validate specific body property
                payload = JSON.parse(req.body[property]);
            } else {
                // Validate entire request body
                payload = req.body;
            }
            const { error } = schema.validate(payload);
            if (error) {
                throw error;
            }
            next();
        } catch (err) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                err,
                message: MESSAGE.custom("Invalid payload"),
            });
        }
    };
};

export default validator;