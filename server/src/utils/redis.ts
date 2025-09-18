import Redis from 'ioredis';

const redis = new Redis("rediss://default:AbdnAAIncDE5ZGFlNWQxMjk2YmI0YjM0YmFlMDViZTZhNDYwZjhlY3AxNDY5NTE@true-lionfish-46951.upstash.io:6379");

redis.on('connect', ()=>console.log('redis connected'));
redis.on('errors', ()=> console.log('redis error'));

export default redis;