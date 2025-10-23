import { nanoid } from "nanoid";

export const createTrackingID = () => nanoid(10);

export const compareObjectIds = (first: MongoId, second: MongoId) => {
    return first.toString() === second.toString()
}