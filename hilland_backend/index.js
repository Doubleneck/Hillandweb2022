const express = require("express");
const app = express();

let news = [
  {
    id: 1,
    title: "Demonews #1",
    content: "HTML is easy",
    imgid: "",
  },
  {
    id: 2,
    title: "Demonews #2",
    content: "HTML is easy2",
    imgid: "",
  },
  {
    id: 3,
    title: "Demonews #3",
    content: "HTML is easy3",
    imgid: "",
  },
];

app.get("/", (req, res) => {
  res.send("<h1>Hello Hilland World!</h1>");
});

app.get("/api/news", (req, res) => {
  res.json(news);
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
