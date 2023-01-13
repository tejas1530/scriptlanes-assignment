import express from 'express';

import { getHospital } from './controllers/user.js';

export const userRouter = express.Router();




userRouter.route("/getHospitals").get(getHospital);