import express from 'express';

import {protect , admin} from '../middleware/auth.js';
import {getAllEvents , getEventById , createEvent , updateEvent , deleteEvent} from '../controller/eventcontroller.js';
const router = express.Router();

//Get all events
router.get('/' , getAllEvents);
router.get('/:id' , getEventById);
router.post('/' , protect , admin , createEvent);
router.put('/:id' , protect , admin , updateEvent);
router.delete('/:id' , protect , admin , deleteEvent);

export default router;
