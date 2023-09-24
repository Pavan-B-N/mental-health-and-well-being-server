const express = require('express')
const app = express();
const port = process.env.PORT || 3030;
const cors = require('cors');
const dotenv = require('dotenv');
const axios = require('axios');
// const apiKey = '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';
const apiKey = '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';
const apiUrl = 'https://api.openai.com/v1/engines/davinci/completions';

dotenv.config()

app.use(cors({ origin: ["http://localhost:3000","https://mental-helath-and-well-being.netlify.app/"] }))
app.use(express.json())

const http = require("http");
const httpServer = http.createServer(app);

// const { ExpressPeerServer } = require("peer");
// const peerServer = ExpressPeerServer(httpServer);
// app.use("/peerjs", peerServer);

const chatbotResponses = {
    greeting: 'Hello! How can I assist you today?',
    options: [
        {
            title: 'Depression',
            response: 'Hello depression',
        },
        {
            title: 'Frustration',
            response: 'Hello frustration',
        },
        {
            title: 'Online Frustration',
            response: 'Hello Online',
        },
    ],
};
app.post('/api/option', (req, res) => {
    const selectedOption = req.body.option;
    const selectedOptionResponse = chatbotResponses.options.find(
        option => option.title === selectedOption
    );
    console.log(selectedOption)

    if (selectedOptionResponse) {
        res.json({ message: selectedOptionResponse.response });
    } else {
        res.json({ message: 'Invalid option selected.' });
    }
});

app.post('/chatgpt', async (req, res) => {
    const prompt = req.body.prompt;

    const requestBody = {
        prompt,
        max_tokens: 500,
    };

    await axios.post(apiUrl, requestBody, {
        headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
        },
    })
        .then(response => {
            const generatedText = response.data.choices[0].text.trim();
            console.log(generatedText)
            res.json({ generatedText });
        })
        .catch(error => {
            console.log(error)
            res.status(500).json({ error: error.response.data });
        });
        
});


const { Server } = require("socket.io");
const io = new Server(httpServer, {
    cors: {
        origin:[ "http://localhost:3000","https://mental-helath-and-well-being.netlify.app/"]
    }
});

let activeTherapists = [];
function isExists(sid) {
    activeTherapists.forEach(obj => {
        if (obj.socketId == sid) {
            return true
        }
    })
    return false;
}
function removeUser(sid) {
    activeTherapists = activeTherapists.filter(obj => {
        if (obj.socketId != sid) {
            return obj;
        }
    })
}
io.on("connection", (socket) => {
    socket.emit("id", socket.id);

    socket.on("join", (data) => {
        if (!isExists(socket.id)) {
            console.log("data", { socketId: socket.id, ...data })
            activeTherapists.push({ socketId: socket.id, ...data });
            socket.broadcast.emit("actives", activeTherapists)
        }
    });
    socket.emit("actives", activeTherapists)

    socket.on("disconnect", () => {
        removeUser(socket.id);
        socket.broadcast.emit("actives", activeTherapists)
    })
});


const mongoose = require('mongoose');
// const mongoURL = "mongodb://0.0.0.0:27017/mental-health-and-well-being"
const mongoURL = "mongodb+srv://nitheeshwarBR:Nitheesh3533@nitheeshwar-servers.iuwa7mc.mongodb.net/mental-health-and-well-being"
let isDatabaseConnected = false;

(
    async () => {
        try {
            await mongoose.connect(mongoURL)
            console.log("database connected successfully")
            isDatabaseConnected = true;
        } catch (err) {
            console.log("cannot connect to database: " + err.message)
        }
    }
)();

app.use((req, res, next) => {
    if (isDatabaseConnected) {
        next();
    } else {
        res.status(500).send({ message: "Database not conneted" })
    }
});
const therpistSchema = new mongoose.Schema({
    Therapist: {
        type: String,
        required: true,
    },
    Location: {
        type: String,
        required: true,
    },
    contact: {
        type: Number,
        unique: true,
        required: true,
    },
    domain: {
        type: String,
        required: true,
    },
})

const TherapistModel = mongoose.model("therapist", therpistSchema)
app.get("/therapists", async (req, res) => {
    try {
        const therapists = await TherapistModel.find();
        res.json(therapists);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
})


app.get("/", (req, res) => {
    res.send("Codefurry server")
})

const authRoute = require("./routes/authRoutes")
const usersRoute = require("./routes/usersRoute")
const harassmentsRoute = require("./routes/harassmentRoute")

app.use("/auth", authRoute)
app.use("/harassments", harassmentsRoute)
app.use("/users", usersRoute)

httpServer.listen(port, () => console.log(`server is running on http://localhost:${port}`))