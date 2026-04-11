import  express from  'express'
import aiRoutes from './routes/ai.routes.js'
import cors from 'cors'
const app = express()

// Production-level CORS setup
const corsOptions = {
    origin: process.env.FRONTEND_URL || '*', // Specify frontend URL in production for security
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true, // Allow cookies if needed
    optionsSuccessStatus: 200 // For legacy browser compatibility
};

app.use(cors(corsOptions));
app.use(express.json());

// Basic health check route for Render
app.get('/', (req, res) => {
    res.status(200).json({ status: 'active', message: 'Code Reviewer API is running!' })
})

app.use('/ai',aiRoutes)

export default app