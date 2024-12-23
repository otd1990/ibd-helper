import "dotenv/config";
import express from "express";
import cors from "cors";
import { OpenAI } from "openai";

const app = express();
const port = process.env.PORT || 3010;

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type"],
  })
);

app.use(express.json());

app.post("/api/ask", async (req, res) => {
  try {
    const { prompt } = req.body;

    const systemMessage = {
      role: "system",
      content:
        "You are a helpful assistant specializing in cooking and dietary information for people with inflammatory bowel diseases (IBD). Only respond to questions related to IBD, cooking, recipes, and dietary advice. Your responses should consider the person's gut health, avoiding suggestions that could be harmful. Always remind users that you're not an expert and recommend they consult a nutritionist, dietitian, or doctor for personalized advice. If asked about unrelated topics, politely decline with: 'Sorry, I'm only here to help with cooking and dietary information.",
    };

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [systemMessage, { role: "user", content: prompt }],
    });

    res.json({ reply: response.choices[0].message.content });
  } catch (error) {
    console.error(error);
    res.status(500).send("Something went wrong");
  }
});

app.get("/api/blog-posts", async (req, res) => {
  const currentYear = new Date().getFullYear();

  try {
    const response = await fetch(
      "https://api.search.brave.com/res/v1/web/search?q=blog+posts+related+to+living+with+'ibd'+'gut+health'&count=10",
      {
        headers: {
          "Content-Type": "application/json",
          "X-Subscription-Token": process.env.BRAVE_API_KEY,
        },
      }
    );

    const data = await response.json();

    const final = data.web.results
      .filter((item) => new Date(item.age).getFullYear() >= currentYear - 2)
      .map((item) => {
        return {
          title: item.title,
          url: item.url,
          desc: item.description,
          image: item.thumbnail.original,
        };
      });

    res.json([...final]);
  } catch (error) {
    console.error(error);
    res.status(500).send("blogs: Something went wrong");
  }
});

app.get("/api/useful-resources", async (req, res) => {
  const currentYear = new Date().getFullYear();

  try {
    const response = await fetch(
      "https://api.search.brave.com/res/v1/web/search?q=living+with+'ibd'+'gut+health'+useful+resources",
      {
        headers: {
          "Content-Type": "application/json",
          "X-Subscription-Token": process.env.BRAVE_API_KEY,
        },
      }
    );

    const data = await response.json();

    const final = data.web.results
      .filter((item) => new Date(item.age).getFullYear() >= currentYear - 2)
      .map((item) => {
        return {
          title: item.title,
          url: item.url,
          desc: item.description,
          image: item.thumbnail.src,
        };
      });

    res.json([...final]);
  } catch (error) {
    console.error(error);
    res.status(500).send("Something went wrong useful resources");
  }
});

app.listen(port, () => {});
