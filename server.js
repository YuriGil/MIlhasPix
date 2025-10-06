// server.js - VERSÃO JAVASCRIPT
import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// Banco fake em memória
let offers = [];
let currentId = 1;

// Listar todas as ofertas
app.get("/offers", (req, res) => {
  res.json(offers);
});

// Criar nova oferta
app.post("/offers", (req, res) => {
  const { title, description } = req.body;
  const newOffer = { id: currentId++, title, description };
  offers.push(newOffer);
  res.status(201).json(newOffer);
});

// Ranking fake
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