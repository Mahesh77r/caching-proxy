import express from "express";
import { proxyHandler } from "./proxy.js";

const app = express();
const router = express.Router();


router.get('/health-check', (req, res) => {
    res.status(200).json({ message: "OK" });
});
app.use('/api', router);
// Catch-all proxy handler for all other routes
app.use(proxyHandler);


// Export startServer function to be called from index.ts after program is initialized
export const startServer = (port: number) => {
    app.listen(port, () => {
        console.log(`Server started on port ${port}`);
    });
};
