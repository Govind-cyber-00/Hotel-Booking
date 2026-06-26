import express from "express"
import { createRoom, getOwnerRooms, getRooms, toggleRoomAvailbility } from "../controllers/roomController.js";
import {protect} from "../middleware/authMiddleware.js"
import upload from "../middleware/uploadMiddleware.js"


const roomRouter = express.Router();

roomRouter.post('/',upload.array("images",4),protect,createRoom)
roomRouter.get('/',getRooms)
roomRouter.get('/owner',protect,getOwnerRooms)
roomRouter.post('/toggle-availability',protect,toggleRoomAvailbility)


export default roomRouter;