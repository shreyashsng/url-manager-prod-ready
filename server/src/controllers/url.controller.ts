import { Request, Response } from "express";
import prisma from "../prisma/client";
import { nanoid } from "nanoid";
import redis from "../utils/redis";
import { URL } from "url";
import { createUrlSchema } from "../validation/urlSchema";

export interface AuthRequest extends Request {
  user?: any;
}

export const createUrl = async (req: AuthRequest, res: Response) => {
  try {
    console.log('createUrl - User object:', req.user);
    console.log('createUrl - User ID:', req.user?.id);
    
    const original = createUrlSchema.safeParse(req.body);
    if (!original.success) {
      return res.status(400).json({ errors: original.error });
    }

    const originalUrl = original.data.original.trim();

    const normalized = (() => {
      const u = new URL(originalUrl);
      u.hostname =u.hostname.toLowerCase();
      if (u.pathname.endsWith('/') && u.pathname !="/"){
        u.pathname = u.pathname.slice(0,-1);
      } 
      return u.toString();
    })();

    const cachedCode = await redis.get(`long:${normalized}`);

    if (cachedCode) return res.json({ normalized, shortCode: cachedCode });

    const code = nanoid(7);
    let url;

    try {
      console.log('createUrl - Creating URL with userId:', req.user.id);
      url = await prisma.url.create({
        data: { original: normalized, shortCode: code, userId: req.user.id },
      });
      console.log('createUrl - Created URL:', url);
    } catch (e: any) {
      console.log('createUrl - Database error:', e);
      if (e.code === "P2002") {
        url = await prisma.url.findUnique({ 
          where: { original: normalized }
        });

        if (url && url.userId !== req.user.id) {
          const newCode = nanoid(7);
          url = await prisma.url.create({
            data: { original: normalized, shortCode: newCode, userId: req.user.id },
          });
        }
      } else throw e;
    }
    if (!url) return res.status(404).json({ message: "URL not found" });

    //cache both ways, if original is there return shortcode
    await redis.set(url.shortCode, url.original, "EX", 60 * 60);
    await redis.set(`long:${url.original}`, url.shortCode, "EX", 60 * 60);

    res.status(201).json(url);
  } catch (error) {
    res.status(500).json({ error: "server error", details: error });
  }
};

export const getOriginalUrl = async (req: Request, res: Response) => {
  try {
    const { shortCode } = req.params;

    const cached = await redis.get(shortCode);
    const ip = req.ip;
    const userAgent = req.headers["user-agent"] || "unknown";
    const referer = req.headers["referer"] || "unknown";

    //first try redis cache
    if (cached) {
      const url = await prisma.url.findUnique({
        where: { shortCode },
      });
      if (url) {
        await prisma.clickEvent
          .create({
            data: { urlId: url.id, ip, userAgent, referer },
          })
          .catch(console.error);

        await prisma.url
          .update({
            where: { shortCode },
            data: { clicks: { increment: 1 } },
          })
          .catch(console.error);
      }

      return res.redirect(cached);
    }

    //then request database
    const url = await prisma.url.findUnique({
      where: { shortCode },
    });
    if (!url){
      return res.redirect(`${process.env.CORS_ORIGIN_URL}/not-found`);
    }

    prisma.clickEvent
      .create({
        data: { urlId: url.id, ip, userAgent, referer },
      })
      .catch(console.error);

    prisma.url.update({
      where: { shortCode },
      data: { clicks: { increment: 1 } },
    });

    await redis.set(shortCode, url.original, "EX", 60 * 60);

    return res.redirect(url.original);
  } catch (error) {
    res.status(500).json({ error: "server error", details: error });
  }
};

export const getStats = async (req: Request, res: Response) => {
  try {
    const { shortCode } = req.params;
    const url = await prisma.url.findUnique({ where: { shortCode } });

    if (!url) return res.status(404).json({ message: "Not found" });

    res.json({ clicks: url.clicks, createdAt: url.createdAt });
  } catch (error) {
    res.status(500).json({ error: "server error", details: error });
  }
};

export const getAnalytics = async (req: Request, res: Response) => {
  try {
    const { shortCode } = req.params;

    const url = await prisma.url.findUnique({
      where: { shortCode },
      include: { events: true },
    });

    if (!url) return res.status(404).json({ message: "Not found" });

    const totalClicks = url.events.length;
    const uniqueIps = new Set(url.events.map((e) => e.ip)).size;

    const daily = await prisma.clickEvent.groupBy({
      by: ["createdAt"],
      where: { urlId: url.id },
      _count: true,
    });

    res.json({
      totalClicks,
      uniqueVisitors: uniqueIps,
      events: url.events,
      dailyClicks: daily,
    });
  } catch (error) {
    res.status(500).json({ error: "server error", details: error });
  }
};

export const getUserUrls = async(req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    
    const urls = await prisma.url.findMany({
      where: {userId},
      orderBy: {createdAt: 'desc'},
    });

    const stats = {
      totalLinks: urls.length,
      totalClicks: urls.reduce((sum, url) => sum+ url.clicks, 0),
      activeLinks: urls.length, //implement this later
    };

    res.json({stats, urls});
  } catch (error) {
    console.error('getUserUrls error:', error);
    res.status(500).json({message: 'Server error'});
  }
}

export const deleteUrl = async(req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const {shortCode} = req.params;
    const url = await prisma.url.findUnique({where: {shortCode}});

    if(!url){
      return res.status(404).json({message: "URL not found"});
    }

    if(url.userId!==userId){
      return res.status(403).json({message: "Forbidden"});
    }

    await prisma.clickEvent.deleteMany({where: {urlId: url.id}});
    await prisma.url.delete({where: {shortCode}});
    await redis.del(shortCode);
    await redis.del(`long:${url.original}`);
    return res.json({message:"URL deleted!"});
  } catch (error) {
    res.status(500).json({message: "Server error"});
  }
}
