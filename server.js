const express = require('express')
const exphbs = require('express-handlebars')
const fs = require('fs')
const path = require('path')
const bodyParser = require('body-parser');
const randomWords = require("./randomWords.json")
const commonWords = require("./commonWords.json")
const leaderboard = require("./leaderboard.json")



const app = express()
const port = 3000

app.engine("handlebars", exphbs.engine({defaultLayout: null}))
app.set("view engine", "handlebars")

app.use(express.json())
app.use(express.static('public'))


app.get('/', function(req, res, next){
  res.status(200).render("main")
})

app.get('/leaderboard', (req, res) => {
  res.status(200).render("leaderboard")
})

app.get('/leaderboardData', (req, res) => {
  try {
    var leaderboardData = getLeaderboardData()
    res.json(leaderboardData)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Internal Server Error' })
  }})

//POST to leaderboard won't work without this for some reason
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.get('/new-string', function(req, res, next){
  output = {prompt: generatePrompt()}
  res.status(200).send(output)
})


app.post('/leaderboardData', (req, res) => {
  try {
    var newEntry = req.body
    var leaderboardData = getLeaderboardData()
    leaderboardData.push(newEntry)
    saveLeaderboardData(leaderboardData);
    console.log('leaderboard updated successfully')
    res.status(200).json({ success: true })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
})

app.get('/custom-tests', (req, res) =>{
  try {
    var customTestData = getCustomTestData()
    res.status(200).json(customTestData)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
})

app.post('/custom-tests', (req, res) =>{
  try {
    var newEntry = req.body
    var customTestData = getCustomTestData()
    customTestData.push(newEntry)
    saveCustomTestData(customTestData);
    res.status(200).json({ success: true })
    console.log('custom tests updated successfully')
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
})

app.get('*', function(req, res, next){
  res.status(404).render("404")
})

var leaderboardFilePath = path.join(__dirname, 'leaderboard.json')

function getLeaderboardData() {
  try {
    var data = fs.readFileSync(leaderboardFilePath, 'utf8')

    if (!data.trim()) {
      return []
    }

    return JSON.parse(data)
  } catch (error) {
    console.error(error)
    return []
  }
}

function saveLeaderboardData(data) {
  try {
    fs.writeFileSync(leaderboardFilePath, JSON.stringify(data, null, 2), 'utf8')
  } catch (error) {
    console.error(error)
  }
}

function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min); // The maximum is inclusive and the minimum is inclusive
}


function generatePrompt()
{
  var len = randomWords.length
  var outputString = ""
  for(var i = 0; i < 100; i++)
  {
      var index = getRandomIntInclusive(0, len - 1)
      if(i != 0)
          outputString += " "
      outputString += randomWords[index]

  }
  return outputString
}

var customTestsFilePath = path.join(__dirname, 'customTests.json')

function getCustomTestData() {
  try {
    var data = fs.readFileSync(customTestsFilePath, 'utf8')

    if (!data.trim()) {
      return []
    }

    return JSON.parse(data)
  } catch (error) {
    console.error(error)
    return []
  }
}

function saveCustomTestData(data) {
  try {
    fs.writeFileSync(customTestsFilePath, JSON.stringify(data, null, 2), 'utf8')
  } catch (error) {
    console.error(error)
  }
}

app.listen(port, () => {
  console.log(`Server running on localhost:${port}`)
})
