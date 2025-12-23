if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]


const url = `mongodb+srv://martin_fso:${password}@cluster0.w2u41d0.mongodb.net/phoneBookApp?retryWrites=true&w=majority&appName=Cluster0`

const mongoose = require('mongoose')

mongoose.set('strictQuery',false)

mongoose.connect(url)

// //Schema, es la forma de decirle a la bdd la estructura del objeto a guardar
const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

// // Model: es una función constructora que crea un nuevo objeto javascript basado en los parámetros proporcionados
const Person = mongoose.model('Person', personSchema)

if( process.argv[3] ){
  const person = new Person({
    name: process.argv[3],
    number: process.argv[4],
  })

  // //Así guardamos en la bdd un objeto
  person.save().then(result => {
    console.log(`Added ${result.name} number: ${result.number} to phonebook`);
    mongoose.connection.close()
  })
} else {
  Person.find({ }).then(result => {
    result.forEach(person => {
      console.log(`${person.name}  ${person.number}`);
    })
    mongoose.connection.close()
  })
}

