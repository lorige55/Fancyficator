const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const port = 8001;

app.listen(port);

app.post("/fancyficate", async (req, res) => {
  //code
  res.status(200).json({ result: "test test" });
});