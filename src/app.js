import express from 'express'
import aiRoutes from './routes/ai.routes.js'
import dashboardRoutes from './routes/dashboard.routes.js'
import cors from 'cors'
const app = express()

const allowedOrigins = [
    process.env.FRONTEND_URL,
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:3000'
].filter(Boolean);

// Production-level CORS setup
const corsOptions = {
    origin: function (origin, callback) {
        // allow requests with no origin (like mobile apps or curl requests)
        if (!origin || allowedOrigins.includes(origin) || process.env.FRONTEND_URL === '*') {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true, // Allow cookies if needed
    optionsSuccessStatus: 200 // For legacy browser compatibility
};

app.use(cors(corsOptions));
app.use(express.json());

app.use((req, res, next) => {
    console.log("Incoming request:", req.method, req.url);
    next();
});
// Basic health check route for Render
app.get('/', (req, res) => {
    res.status(200).json({ status: 'active', message: 'Code Reviewer API is running!' })
})

app.use('/ai', aiRoutes)
app.use('/api', dashboardRoutes)

export default app