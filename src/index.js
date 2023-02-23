const express = require('express')
const app = express()
const bodyParser = require("body-parser");
const port = 8080

// Parse JSON bodies (as sent by API clients)
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const con = require('./connector')

app.listen(port, () => console.log(`App listening on port ${port}!`))

// GET all events
app.get('/api/events', (req, res) => {
  con.query('SELECT * FROM events', (err, result) => {
    if (err) return res.status(500).json({ error: err.message })
    res.status(200).json({ result })
  })
})

// GET events by date
app.get('/api/events/:date', (req, res) => {
  const date = req.params.date
  con.query(`SELECT * FROM events WHERE date = '${date}'`, (err, result) => {
    if (err) return res.status(500).json({ error: err.message })
    res.status(200).json({ result })
  })
})

// POST a new or update an existing event
app.post('/api/events/:date', (req, res) => {
  const date = req.params.date
  const slots = JSON.stringify(req.body.slots)
  con.query(`INSERT INTO events (date, slots) VALUES ('${date}', '${slots}') ON DUPLICATE KEY UPDATE slots='${slots}'`, (err, result) => {
    if (err) return res.status(500).json({ error: err.message })
    res.status(200).json({ msg: "Slot Added" })
  })
})

// GET all users
app.get('/api/names', (req, res) => {
  con.query('SELECT * FROM users', (err, result) => {
    if (err) return res.status(500).json({ error: err.message })
    res.status(200).json({ result })
  })
})

// POST a new user
app.post('/api/names', (req, res) => {
  const name = req.body.name
  con.query(`INSERT INTO users (name) VALUES ('${name}')`, (err, result) => {
    if (err) return res.status(500).json({ error: err.message })
    res.status(200).json({ msg: "Name Added" })
  })
})

module.exports = app;
