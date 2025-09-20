import {Request, Response, Router} from 'express';
import { login, register } from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

router.post("/register", register);
router.post("/login", login);

router.get("/me", authenticate, (req: Request, res: Response) => {
    const user = (req as any).user;
    res.json({user});
})

export default router;