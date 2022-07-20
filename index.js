const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const { Configuration, OpenAIApi } = require("openai");
const { response } = require("express");

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
require("dotenv").config();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);
const API_URL = process.env.API_URL;

app.get("/", (req, res) => {
  res.render(path.join(__dirname, "index.ejs"), { API_URL: API_URL });
});

app.get("/wakeup", (req, res) => {
  res.send("Wake up");
});

app.post("/api/nlttopython", async (req, res) => {
  try {
    const response = await openai.createCompletion({
      model: "code-davinci-002",
      prompt: `"""\n  ${req.body.text} \n"""`,
      temperature: 0,
      max_tokens: 300,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });
    var code = response.data.choices[0].text;
    res.send(code);
  } catch (error) {
    console.log(error);
    res.send("Something went wrong");
  }
});

app.listen(process.env.PORT, () => {
  console.log("Server is running");
});

const link = {
  hostname: process.env.HOSTNAME,
  port: 443,
  path: "/wakeup",
  method: "GET",
  headers: {
    "Content-Type": "application/json",
  },
};

function wakeUpFunc() {
  const req = https.request(link, (res) => {
    res.on("data", (d) => {
      console.log("WAKE UP SCALAR");
    });
  });
  req.on("error", (error) => {
    console.error(error);
  });
  req.end();
}

setInterval(wakeUpFunc, 900 * 1000);
