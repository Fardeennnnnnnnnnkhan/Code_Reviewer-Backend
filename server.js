import 'dotenv/config'; // cleaner way to load env
import app from "./src/app.js"; // make sure file extension is included
import connectDB from "./src/config/db.js";

const PORT = process.env.PORT || 3000;

// Connect to MongoDB
if (process.env.MONGO_URL) connectDB();

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}/`);
});
