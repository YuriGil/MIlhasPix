import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

let offers = [];
let currentId = 1;

app.get("/offers", (req, res) => {
  res.json(offers);
});


app.post("/offers", (req, res) => {
  const { title, description } = req.body;
  const newOffer = { id: currentId++, title, description };
  offers.push(newOffer);
  res.status(201).json(newOffer);
});

app.get("/ranking", (req, res) => {
  const ranking = offers.map((offer, index) => ({
    position: index + 1,
    ...offer,
  }));
  res.json(ranking);
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Backend rodando em http://localhost:${PORT}`);
});