import express, { Request, Response } from 'express';
import queue from './queue';
import { setupWorker } from './worker';

const app = express();
app.use(express.json());

interface RequestBody {
  ids: number[];
}

app.post('/process-ids', async(req: Request<{}, {}, RequestBody>, res: Response) => {
  
  const { ids } = req.body;

  if (!Array.isArray(ids)) {
    res.status(400).send({ error: 'Invalid input, expected an array of IDs.' });
  }

  try {
    for (const id of ids) {
      await queue.add({ id });
    }
    res.send({ message: 'IDs enqueued successfully.' });
  } catch (error) {
    res.status(500).send({ error: 'Failed to process IDs' });
  }
});

setupWorker(queue);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
