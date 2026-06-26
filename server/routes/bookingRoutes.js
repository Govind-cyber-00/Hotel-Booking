import express from "express";
import { checkAvailablityAPI, createBooking, getHotelBookings, getUserBookings } from "../controllers/bookingController.js";
import { protect } from "../middleware/authMiddleware.js";

const bookingRouter = express.Router();

bookingRouter.post('/check-availability',checkAvailablityAPI);
bookingRouter.post('/book',protect,createBooking);
bookingRouter.post('/user',protect,getUserBookings);
bookingRouter.post('/book',protect,getHotelBookings);

export default bookingRouter;