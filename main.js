import "dotenv/config"
import app from "./src/app.js"

const PORT = process.env.PORT || 5000

const start = app.listen(PORT, () => {
        console.log(`Server is running at ${PORT} in ${process.env.NODE_ENV} mode`)
        console.log(`Health: http://localhost:${PORT}/health`);
    })


const shutdown = (signal) =>{
    console.log(`\n${signal} received — shutting down gracefully...`);
    start.close(() => {
        console.log("Server closed.");
        process.exit(0);        
    })
}


process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT" , () => shutdown("SIGINT"));


process.on("unhandledRejection" , (reason,promise) => {
    console.error("Unhandled Rejection at:", promise, "reason:", reason);
    server.close(() => process.exit(1));
})