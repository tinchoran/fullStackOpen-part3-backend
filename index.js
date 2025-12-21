const express = require("express");
const app = express();

const morgan = require("morgan");
const cors = require("cors");

let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.use(express.json());

morgan.token('body', (req, res) => req.method === "POST" ? JSON.stringify(req.body) : " ")
//app.use(morgan("tiny")); //Ejercicio 3.7
app.use(morgan(":method :url :status :res[content-length] - :response-time ms :body"))
app.use(cors());


app.get("/info", (req, res) => {
    const date = new Date();
    const long = persons.length;
    return res.send(
        `<div>
            <p>Phonebook has info for ${long} people</p>
            <p>${date.toString()}</p>
        </div>`
    )
})


app.get("/api/persons", (req, res) => {
    return res.json(persons);
})


app.get("/api/persons/:id", (req, res) => {
    const id = Number(req.params.id);
    const person = persons.find(person => person.id === id);

    if(person){
        return res.json(person)
    }

    res.statusMessage = "Recurso no encontrado"
    return res.status(404).json({
        error: "Not found"
    })

})

app.delete("/api/persons/:id", (req, res)  => {
    const id = Number(req.params.id);
    persons = persons.filter(person => person.id !== id);
    return res.status(204).end();
})

const generateId = () => {
    const id = Math.floor(Math.random() * 10000);
    return id;
}

app.post("/api/persons", (req, res) => {
    const body = req.body;

    if(!body.name || !body.number){
        return res.status(400).json({
            error: 'Nombre o número no especificado/s'
        })
    }

    const newPerson = {
        name: body.name,
        number: body.number,
        id: generateId(),
    }

    const nameAlreadyExists = persons.some(person => person.name.toLowerCase() === newPerson.name.toLowerCase())
    
    if(nameAlreadyExists){
        return res.status(400).json({
            error: 'El nombre ya está en uso'
        })
    }


    persons = persons.concat(newPerson);

    return res.status(201).json(newPerson);

})

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => console.log(`Servidor corriendo en el puerto: ${PORT}`));