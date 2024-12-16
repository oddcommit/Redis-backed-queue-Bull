import Queue from 'bull';
import cache from './cache';
import Redis from 'ioredis';

const publisher = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: Number(process.env.REDIS_PORT) || 6379,
});

export function setupWorker(queue: Queue.Queue) {
  queue.process(async (job) => {
    const { id } = job.data;

    if (cache.has(id)) {
      console.log(`Handled from cache ${id}`);
    } else {
      console.log(`Handled ${id}`);
      await cache.set(id);
    }

    await publisher.publish('id-processed', JSON.stringify({ id }));
  });
}

const subscriber = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: Number(process.env.REDIS_PORT) || 6379,
});

subscriber.subscribe('id-processed', (err) => {
  if (err) console.error('Failed to subscribe:', err);
});

subscriber.on('message', (channel, message) => {
  const { id } = JSON.parse(message);
  console.log(`Received notification: ID ${id} was processed`);
});
