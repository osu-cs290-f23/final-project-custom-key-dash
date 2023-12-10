const express = require('express')
const exphbs = require('express-handlebars')
const randomWords = require("./randomWords.json")
const fs = require('fs')
const path = require('path')


const app = express()
const port = 3000

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

app.use(express.json())

app.use(express.static('public'))

app.get('/leaderboard', (req, res) => {
  try {
    var leaderboardData = getLeaderboardData()
    res.json(leaderboardData)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
})

app.post('/leaderboard', (req, res) => {
  try {
    var newEntry = req.body
    var leaderboardData = getLeaderboardData()
    leaderboardData.push(newEntry)
    saveLeaderboardData(leaderboardData);
    console.log('leaderboard updated successfully')
    res.json({ success: true })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
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

app.listen(port, () => {
  console.log(`Server running on localhost:${port}`)
});
