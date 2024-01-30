const express = require('express');
const fs = require('fs')
const path = require('path');
const PORT = process.env.PORT || 3001;
const app = express();
const uuid = require('./helpers/uuid')

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/api/notes', (req, res) => {

  fs.readFile('./db/db.json', 'utf8', (err, data) => {
    err ? console.log(err) : console.log(data);
    const parsedData = JSON.parse(data)
    res.json(parsedData)
  })

});

app.post('/api/notes', (req, res) => {

  console.log(req.body);

  const { title, text } = req.body;

  if (req.body) {
    const newNote = {
      title,
      text,
      id: uuid()
    }

    fs.readFile('./db/db.json', 'utf8', (err, data) => {
      err ? console.log(err) : console.log(data);
      const parsedData = JSON.parse(data)

      // I need to push new notes to parsedData
      parsedData.push(newNote)
      // I then need to re-stringify data
      const savedData = JSON.stringify(parsedData)
      // Once data is a string it needs to be written back to the db.json file
      fs.writeFile('./db/db.json', savedData, (err) =>
      err ? console.log(err) : console.log('Success'));
      res.json(parsedData)
    })

  }
});

app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/notes.html'))
);

app.get('*', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);


app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT}`)
);