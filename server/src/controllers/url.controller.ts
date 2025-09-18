import { Request, Response } from "express";
import prisma from "../prisma/client";
import { nanoid } from "nanoid";
import redis from "../utils/redis";

export const createUrl = async (req: Request, res: Response) => {
  try {
    const { original } = req.body;
    const cachedCode = await redis.get(`long:${original}`);

    if(cachedCode) return res.json({original, shortCode: cachedCode});

    if (!original)
      return res.status(400).json({ message: "Original url required" });

    const code = nanoid(7);
    let url;

    try {
      url = await prisma.url.create({data: {original, shortCode: code}});
    } catch (e:any) {
      if(e.code === 'P2002'){
        url = await prisma.url.findUnique({where: {original}});
      } else throw e;
    }
    if(!url) return res.status(404).json({message: "URL not found"});

    //cache both ways, if original is there return shortcode
    await redis.set(url.shortCode, url.original, "EX", 60 * 60);
    await redis.set(`long:${url.original}`, url.shortCode, "EX", 60*60);

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
    if (!url) return res.status(404).json({ message: "Url not found" });

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
