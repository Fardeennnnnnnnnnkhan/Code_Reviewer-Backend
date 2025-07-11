import 'dotenv/config'; // cleaner way to load env
import app from "./src/app.js"; // make sure file extension is included

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}/`);
});
