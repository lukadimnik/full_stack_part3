const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

morgan.token("showContent", function (req, res) {
  return JSON.stringify(req.body);
});
app.use(
  morgan(
    ":method :url :status :res[content-length] - :response-time ms :showContent"
  )
);

let persons = [
  {
    name: "Lydia French",
    number: "234-4232334",
    id: 1,
  },
  {
    name: "Julia Roberts",
    number: "111-1411",
    id: 2,
  },
  {
    name: "Conor McGregor",
    number: "204-430034",
    id: 3,
  },
];

app.get("/", (req, res) => {
  res.send("<h1>Hello World!</h1>");
});

app.get("/info", (req, res) => {
  let info = `<p>Phonebook has info for ${persons.length} people</p>
  ${new Date()}`;
  res.send(info);
});

app.get("/api/persons", (req, res) => {
  res.json(persons);
});

app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find((person) => person.id === id);

  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  persons = persons.filter((person) => person.id !== id);

  response.status(204).end();
});

const generateId = (max) => {
  return Math.floor(Math.random() * Math.floor(max));
};

app.post("/api/persons", (request, response) => {
  const body = request.body;

  let nameAlreadyExists = false;

  persons.map((person) => {
    if (person.name === body.name) {
      return (nameAlreadyExists = true);
    }
  });

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: "content missing",
    });
  }

  if (nameAlreadyExists) {
    return response.status(400).json({
      error: "name must be unique",
    });
  }

  const person = {
    name: body.name,
    number: body.number,
    id: generateId(1000),
  };

  persons = persons.concat(person);

  response.json(person);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
