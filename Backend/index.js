const ConnectToMongo = require("./db");
ConnectToMongo();

const express = require('express');
const cors = require('cors'); // Ensure this is imported correctly
const app = express();
const PORT = 5000 || process.env.PORT;
const cookieParser = require("cookie-parser")

app.use(cors({
  origin: 'http://localhost:3000', // Adjust to your frontend URL
  credentials: true,
}));

app.use(cookieParser()); // Corrected spelling
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello welcome to my site");
});

// Route setup
app.use(require("./routes/auth"));

app.listen(PORT, () => {
  console.log(`Listening on localhost:${PORT}`);
});


