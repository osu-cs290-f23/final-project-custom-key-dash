const express = require('express')
const exphbs = require('express-handlebars')
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
    for(var i = 0; i < 100; i++)
    {
        var index = getRandomIntInclusive(0, len - 1)
        if(i != 0)
            outputString += " "
        outputString += commonWords[index]

    }
    return outputString
}

app.use(express.static('public'))

app.get('/new-string', function(req, res, next){
  output = {prompt: generatePrompt()}
  res.status(200).send(output)
})

app.get('/leaderboard', function(req, res){
    //This will get converted to the leaderboard handlebars when its configured
    res.send('Leaderboard')
})

app.get('/', function(req, res) {
    //This will get converted to the main page handlebars when its configured
    res.send('Hello, world')
})

app.listen(port, function() {
  console.log(`Example app listening on port ${port}`)
})
