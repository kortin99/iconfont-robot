import express, { Express, Request, Response } from 'express';
import { getLink } from './src';

const DEFAUL_PORT = 8080;

export function startServer(port = DEFAUL_PORT) {
  const app: Express = express();

  app.get('/getLink', (req: Request, res: Response) => {
    try {
      const link = getLink();
      res.status(200).send(link);
    } catch (error) {
      
    }
  })

  app.listen(port, () => {
    console.log(`[express] Server is running on port ${port}`);
  });
}
