const express = require('express')
const exphbs = require('express-handlebars')
const fs = require('fs')
const path = require('path')
const bodyParser = require('body-parser');
// const randomWords = require("./randomWords.json")
const commonWords = require("./commonWords.json")
const leaderboard = require("./leaderboard.json")



const app = express()
const port = 8080

function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min); // The maximum is inclusive and the minimum is inclusive
  }
  

function generatePrompt()
{
    var len = commonWords.length
    var outputString = ""
    for(var i = 0; i < 10; i++)
    {
        var index = getRandomIntInclusive(0, len - 1)
        if(i != 0)
            outputString += " "
        outputString += commonWords[index]

    }
    return outputString
}

app.use(express.static('public'))

//POST to leaderboard won't work without this for some reason
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.get('/new-string', function(req, res, next){
  output = {prompt: generatePrompt()}
  res.status(200).send(output)
})

app.get('/leaderboard', function(req, res){
    //This will get converted to the leaderboard handlebars when its configured
    res.send('Leaderboard')
})

app.post('/leaderboard', (req, res) => {
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

app.get('/', function(req, res) {
    //This will get converted to the main page handlebars when its configured
    res.send('Hello, world')
})

app.listen(port, function() {
  console.log(`Example app listening on port ${port}`)
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