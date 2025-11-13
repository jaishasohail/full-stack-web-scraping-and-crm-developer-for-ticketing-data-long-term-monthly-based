const express = require("express");
const path = require("path");
const morgan = require("morgan");

const app = express();
const PORT = process.env.PORT || 3000;

// Basic request logging
app.use(morgan("dev"));

// Serve static assets
const publicDir = path.join(__dirname, "public");
const mediaDir = path.join(__dirname, "media");

app.use(express.static(publicDir));
app.use("/media", express.static(mediaDir));

// Fallback for unknown routes
app.use((req, res, next) => {
 const err = new Error("Not Found");
 err.status = 404;
 next(err);
});

// Centralized error handler
app.use((err, req, res, next) => {
 // eslint-disable-line no-unused-vars
 const status = err.status || 500;
 const isProd = process.env.NODE_ENV === "production";

 console.error(
 `[${new Date().toISOString()}] ${status} ${err.message}\n${err.stack || ""}`
 );

 if (req.accepts("html")) {
 res.status(status).send(`

 Error ${status}

 body { font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; background:#0b1220; color:#e5e7eb; display:flex; align-items:center; justify-content:center; min-height:100vh; margin:0; }
 .error-card { background:#020617; padding:2.5rem 3rem; border-radius:1rem; box-shadow:0 25px 50px -12px rgba(15,23,42,0.8); max-width:480px; width:100%; }
 h1 { margin:0 0 0.5rem; font-size:1.5rem; }
 p { margin:0 0 1.5rem; color:#9ca3af; }
 code { font-size:0.85rem; background:#020617; padding:0.5rem 0.75rem; border-radius:0.5rem; display:block; overflow:auto; max-height:10rem; }
 a { color:#38bdf8; text-decoration:none; }
 a:hover { text-decoration:underline; }

 Error ${status}

 ${status === 404 ? "The page you are looking for does not exist." : "Something went wrong on the server."}

 ${
 isProd
 ? `Request ID: ${Date.now().toString(36)}
`
 : `${(err.stack || err.message || "Unknown error")
 .toString()
 .replace(//g, ">")}
`
 }

 Back to home

 `);
 } else {
 res.status(status).json({
 error: {
 message: err.message || "Internal Server Error",
 status
 }
 });
 }
});

app.listen(PORT, () => {
 console.log(`Server running on http://localhost:${PORT}`);
});