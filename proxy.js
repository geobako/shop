import express from 'express'
import cors from 'cors'
import fetch from "node-fetch";

const app = express();
app.use(cors()); 

app.use(express.json());

app.post("/proxy/carts", async (req, res) => {
    const backendUrl = "http://localhost:8080/carts"; // Your backend API

    try {
        const response = await fetch(backendUrl, { method: "POST" });
        const locationHeader = response.headers.get("Location");
        const splitted = locationHeader.split('/')
        res.json({ cartId: splitted[splitted.length-1] });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(3001, () => console.log("Proxy running on port 3001"));