import {Request, Response} from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import supabase from '../utils/supabase';
import prisma from '../prisma/client';

const JWT_SECRET = process.env.JWT_SECRET!;

//register
export const register = async (req: Request, res: Response) => {
    const {email, password} = req.body;

    if(!email || !password) {return res.status(400).json({message: "Email and password requierd"});}

    try {
        //const hashedPassword = await bcrypt.hash(password, 10)

        const {data, error} = await supabase.auth.admin.createUser({
            email,
            password,
        });

        if(!data?.user) return res.status(400).json({message: "User not returned from supabase"})

        await prisma.user.create({
            data: {id: data.user.id, email: data.user.email!}
        });

        if(error) return res.status(400).json({message: error.message});

        //jwt sign
        const token = jwt.sign({id: data.user.id, email: data.user.email}, JWT_SECRET, {expiresIn:"7d"});
        res.status(201).json({user: data.user.id, token});
            
    } catch (error) {
        res.status(500).json({error: `Server error: ${error}`, details: error});
    } 
}

//login
export const login = async(req: Request, res: Response) => {
    const {email, password} = req.body;

    if(!email || !password) return res.status(400).json({message: "Email and password required"});

    try {
        const {data, error} = await supabase.auth.signInWithPassword({email, password});

        if(error) return res.status(400).json({message: error.message});
        res.json({user: data.user, token:data.session.access_token,});
    } catch (error) {
        res.status(500).json({message: "server error", details: error});
    }
}