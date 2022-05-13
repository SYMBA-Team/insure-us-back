import "dotenv/config";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import mongoose from "mongoose";

import { loggedIn, checkLogs } from "./middlewares/auth.js";
import { GetLoggedInUserInfos } from "./handlers/user.js";
import { Client, Admin } from "./models/user.js";

import authRoutes from "./routes/auth.js";
import clientRoutes from "./routes/client.js";

const app = express();
const port = process.env.BACK_PORT || 3001;

app.use(cookieParser());
app.use(express.json());

app.use(
    cors({
        origin: (origin, callback) => {
            const accepted_origins = [origin];
            const origin_accepted = accepted_origins.includes(origin);
            callback(
                !origin_accepted && new Error("Request origin not accepted."),
                origin_accepted && origin
            );
        },
        credentials: true,
    })
);
/* app.use(function (req, res, next) {
    const t = Date.now();
    next();
    console.log(
        req.method + "/ " + res.statusCode + " " + (Date.now() - t) + "ms"
    );
}); */
app.route("/").get(checkLogs(Admin), loggedIn, GetLoggedInUserInfos);
app.use("/", authRoutes(Admin));
app.use("/cAuth", authRoutes(Client));
app.use("/clients", clientRoutes);

// error middleware
app.use((err, req, res, next) => {
    //log.error(err);
    const error =
        err.message && err.name
            ? {
                  name: err.name,
                  message: err.message,
              }
            : {
                  name: "unhandled_error",
                  message: "Encountered unhandled error please try again.",
              };
    res.status(err.status || 422).send(error);
});

app.use("*", (req, res, next) => {
    res.status(404).json({
        err: "resource_not_found",
        message: "Resource not found.",
    });
});
// Mongodb connection
//mongoose.set("debug", true);
mongoose.connect(process.env.BACK_MONGODB_URI, { dbName: "hackit" }, () => {
    console.log("Connected to db");
    app.listen(port, () => console.log(`Server running on port: ${port}`));
});
