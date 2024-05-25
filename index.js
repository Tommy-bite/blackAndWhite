import express from "express";
import { engine } from "express-handlebars";
import Jimp from "jimp";

import path from "path";
import { fileURLToPath } from "url";
import { nanoid } from "nanoid";

const app = express();
const port = process.env.PORT || 3000;

// Obtener __dirname usando import.meta.url
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// public directory
app.use(express.static(path.join(__dirname, "/public")));
app.use(
  "/css",
  express.static(path.join(__dirname, "/node_modules/bootstrap/dist/css"))
);
app.use(
  "/js",
  express.static(path.join(__dirname, "/node_modules/bootstrap/dist/js"))
);
app.use(
  "/js",
  express.static(path.join(__dirname, "/node_modules/jquery/dist"))
);

// Middlewares body
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// handlebars
app.engine(".hbs", engine({ extname: ".hbs" }));
app.set("view engine", ".hbs");
app.set("views", path.join(__dirname, "/views"));

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/desafio", (req, res) => {
  res.render("desafio");
});

app.post("/image", async (req, res) => {
  const image = await Jimp.read("https://picsum.photos/1000");
  const buffer = await image
    .quality(60)
    .resize(500, 500)
    .grayscale()
    .getBufferAsync(Jimp.MIME_JPEG);

  const dirname = __dirname + `/public/img/image-${nanoid()}.jpeg`;
  await image.writeAsync(dirname);

  res.set("Content-Type", "image/jpeg");
  return res.send(buffer);
});

app.listen(port, () => {
  console.log(`Servidor ejecutandose en http://localhost:${port}`);
});