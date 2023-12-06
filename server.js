const express = require('express')
const app = express()
const port = 8080



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