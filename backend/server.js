import express from "express";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import noteRoutes from "./routes/noteRoutes.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT=5000;

app.use(express.json());
app.use(cookieParser());
app.set('trust proxy', 1);
app.use(cors({
    origin:["https://ai-notes-workspace-flax.vercel.app","http://localhost:5173"],
    credentials:true
}));

connectDB();

app.use("/api/auth",authRoutes);
app.use("/api",noteRoutes);

app.get('/actuator/health', (req, res) => res.status(200).json({ status: "UP" }));

app.get('/actuator/mappings', (req, res) => {
    const routes = [
        { path: "/api/auth/login", methods: ["POST"] },
        { path: "/api/auth/register", methods: ["POST"] },
        { path: "/api/auth/logout", methods: ["POST"] },
        { path: "/api/add-note", methods: ["POST"] },
        { path: "/api/get-notes", methods: ["GET"] },
        { path: "/api/update-note/{noteId}", methods: ["PUT"] },
        { path: "/api/suggestion", methods: ["POST"] },
        { path: "/actuator/health", methods: ["GET"] },
        { path: "/actuator/mappings", methods: ["GET"] }
    ];

    const dispatcherServlet = [];
    routes.forEach(route => {
        route.methods.forEach(method => {
            dispatcherServlet.push({
                predicate: `{ [${route.path}], methods=[${method}] }`,
                handler: `ExpressController#${route.path}`,
                details: {
                    handlerMethod: {
                        className: "ExpressController",
                        name: route.path
                    }
                }
            });
        });
    });

    res.json({
        contexts: {
            application: {
                mappings: {
                    dispatcherServlets: {
                        dispatcherServlet
                    }
                }
            }
        }
    });
});

app.listen(PORT,()=>{
    console.log("server started on PORT:",PORT)
})