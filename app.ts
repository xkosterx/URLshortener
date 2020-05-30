const express = require("express");
const cors = require("cors");
const socket = require("socket.io");

const config = require("config");
const mongoose = require("mongoose");

const app = express();

app.use(express.json({ extended: true }));

app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/link", require("./routes/link.routes"));
app.use("/t", require("./routes/redirect.routes"));
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

const PORT = config.get("port") || 5000;

const http = require("http");

const server = http.createServer(app).listen(4000, function () {
  console.log("Sockets listening on port " + 4000);
});

const io = socket.listen(server);
io.sockets.on("connection", function () {
  console.log("im a hot socket");
});

io.on("connection", (socket:any) => {
  console.log("User online", socket.id);

  socket.on("test", (name:string) => {
    console.log(name);
  });

  setTimeout(() => {
    io.emit("test", "res ok");
  }, 3000);

});

async function start() {
  try {
    await mongoose.connect(config.get("mongoUri"), {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    });

    app.listen(PORT, () => {
      console.log(`server started on port ${PORT}`);
    });
  } catch (e) {
    console.log(`Server error ${e.message}`);
    process.exit();
  }
}

start();
