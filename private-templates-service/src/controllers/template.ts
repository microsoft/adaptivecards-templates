import passport from '../config/passport';
import express from 'express';

const templateRouter = express.Router();

templateRouter.all('/', passport.authenticate('oauth-bearer', {
	session: false
	}), function(req: any, res: any, next: Function){
	next();
});

// create a GET route
templateRouter.get('/', (req : any, res : any) => {
	res.send({
		express: "YOUR EXPRESS BACKEND IS CONNECTED TO REACT. CONFIRMED"
	});
});

export default templateRouter;