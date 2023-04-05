const express = require("express");
const router = require("./routes/enroll");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
app.use(express.json());

const uri = `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@cluster0.w2lg8.mongodb.net/?retryWrites=true&w=majority`;
mongoose
  .connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Database connected!"))
  .catch((err) => console.log(err));

app.use(router);

app.listen(8080, () => {
  console.log("Server Started on 8080");
});
