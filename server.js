const express = require("express");
const path = require("path");
const cors = require("cors");
require("dotenv").config();
const mongoose = require("mongoose");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);

mongoose.Promise = Promise;

app.use(express.static(path.join(__dirname, "/public")));

// Message Model
const Message = mongoose.model("Message", {
  name: String,
  message: String,
});

// function headers(req, res, next) {
//   res.setHeader("Access-Control-Allow-Origin", "*");
//   res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
//   res.setHeader("Access-Control-Allow-Headers", "Content-Type");
//   res.setHeader("Access-Control-Allow-Credentials", true);
//   next();
// }

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/messages", async (req, res) => {
  try {
    const messages = await Message.find({});

    res.send(messages);
  } catch (err) {
    res.sendStatus(500);
  }
});

// This is made for testing purpose with jasmine
app.get("/messages/:name", async (req, res) => {
  const { name } = req.params;
  try {
    const user = await Message.findOne({ name });
    res.send(user);
  } catch (err) {}
});

app.post("/messages", async (req, res) => {
  const { name, message } = req.body;

  try {
    const newMessage = new Message({
      name,
      message,
    });

    const savedMessage = await newMessage.save();
    // just for demonstration purpose we've another request to db otherwise we can stop if before saving message into db.
    const censored = await Message.find({ message: "badword" });

    if (censored) return await Message.remove({ _id: censored.id });
    else io.emit("message", { name, message });

    res.sendStatus(200);
  } catch (err) {
    res.sendStatus(500);
  } finally {
    // logger.log("message post called")
    // Or
    // you may want to close a resource like, a file, db connection or anything
  }
});

io.on("connection", (socket) => {
  console.log("user connected");
});

mongoose.connect(
  process.env.dbUrl,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (err) => {
    console.log("Mongodb connection", err);
  }
);

const server = http.listen(4100, () => {
  console.log(`Server started on port: `, server.address().port);
});
