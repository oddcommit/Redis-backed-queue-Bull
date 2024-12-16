import Bull from 'bull';

interface JobData {
  id: number;
}

const queue = new Bull<JobData>('id-processor', {
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: Number(process.env.REDIS_PORT) || 6379,
  }
});

export default queue;
