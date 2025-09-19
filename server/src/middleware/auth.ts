import {Request, Response, NextFunction} from 'express';
import supabase from '../utils/supabase';
import { User } from '@supabase/supabase-js';

export interface AuthRequest extends Request{
    user? : any;
}

export const authenticate = async(req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if(!authHeader) return res.status(401).json({message: "Missing authorization header"});

    const token = authHeader.split(' ')[1];
    const {data, error} = await supabase.auth.getUser(token);

    if(error || !data.user) return res.status(401).json({message: "Invalid or expired token"});

    (req as any).user = data.user;
    next();
}