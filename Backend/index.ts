import express, { Request, Response } from 'express';
import connectDB from './config/connectDB';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoute from './routes/authRoute'
import chatRoute from './routes/chatRoute'
import { createServer, Server } from 'http';
import { setupSocketServer } from './socket/socket';


dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

const corsOptions: cors.CorsOptions = {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'], 
    credentials: true,  // Allow cookies/credentials

  };


app.use(cors(corsOptions));
app.use(express.json());
connectDB();

app.use('/auth', authRoute)
app.use('/chat', chatRoute)


app.get('/', (req: Request, res: Response) => {
    res.send('Server is running');
  });

 const server: Server = createServer(app);

 setupSocketServer(server);

 server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});