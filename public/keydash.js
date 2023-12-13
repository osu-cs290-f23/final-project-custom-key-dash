var unattemptedSpan = document.getElementById("unattempted")
var correctSpan = document.getElementById("correct")
var incorrectSpan = document.getElementById("incorrect")

var testResults = document.getElementById("test-results")
var wpmResult = document.getElementById("wpm-result")
var wpm = 0

var testString = ""

var unattempted = testString
var correct = ""
var incorrect = ""
var keyIncorrect = false
var numIncorrectKeys = 0
var testFinished = false

function generateDefaultTest(){
    fetch("/new-string")
        .then(res => res.json())
        .then(data => {testString = data.prompt})
        .then(function(){
            unattemptedSpan.textContent = testString
            resetTestElements()
        })
        .catch(function (err){
            alert("Error loading prompt")
        })
}

function resetTestElements(){
    unattempted = testString
    correct = ""
    incorrect = ""
    unattemptedSpan.textContent = testString
    correctSpan.textContent = ""
    incorrectSpan.textContent = ""
    keyIncorrect = false
    numIncorrectKeys = 0
    testFinished = false
    wpm = 0
    wpmResult.textContent = ""
    testResults.classList.add("hidden")
    unattemptedSpan.classList.remove("hidden")
    correctSpan.classList.remove("hidden")
    incorrectSpan.classList.remove("hidden")
}

function replayDefaultTest(){
    generateDefaultTest()
    resetTestElements()
}

function displayResults(wpm){
    testResults.classList.remove("hidden")
    unattemptedSpan.classList.add("hidden")
    correctSpan.classList.add("hidden")
    incorrectSpan.classList.add("hidden")
    wpmResult.textContent = "WPM: " + wpm
}

function handleTestSubmit(){
    var username = document.getElementById("name-input").value
    if(username){
        uploadTestResults(username,wpm)
    } else {
        alert("Missing name input")
    }
}

function uploadTestResults(username,wpm){
    fetch('/leaderboard',{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            name: username,
            score: wpm,
            date: getDateTime()
        })
    }).then(function(){
        replayDefaultTest()
    })
    .catch(function (err){
        alert("Error posting results")
    })
}

function checkTestFinish(){
    if(correct === testString){
        testFinished = true
        totalTime = new Date() - startTime
        wpm = Math.floor((testString.replace(" ","").length/5)/(totalTime/1000)*60)
        console.log("wpm:",wpm)
        console.log("errors:",numIncorrectKeys) 
        displayResults(wpm)
    }
}

var startTime = 0
var totalTime = 0

function testUpdate(event){
    if(!testFinished){
        if(correct === "" && incorrect === ""){
            startTime = new Date()
        }

        var keyCode = event.keyCode
        var key = event.key

        if(incorrect[0] || unattempted[0]){
            var currentTestKey = ""
            if (keyIncorrect){
                currentTestKey = incorrect[0]
            } else {
                currentTestKey = unattempted[0]
            }
            
            if(keyCode >= 65 && keyCode <= 90 || keyCode == 32 || keyCode == 222){
                if(key == currentTestKey){

                    correct = correct + key
                    if(keyIncorrect){
                        incorrect = ""
                        incorrectSpan.textContent = ""
                        keyIncorrect = false
                    } else {
                        unattempted = unattempted.slice(1)
                        unattemptedSpan.textContent = unattempted
                    }
                    correctSpan.textContent = correct
                    
                } else if (key != currentTestKey && !keyIncorrect){
                    incorrect = incorrect + currentTestKey
                    unattempted = unattempted.slice(1)
                    unattemptedSpan.textContent = unattempted
                    incorrectSpan.textContent = incorrect
                    keyIncorrect = true
                    numIncorrectKeys++
                }
            }
        }
        
        checkTestFinish()
    }  
}

window.addEventListener("keydown",testUpdate)

var defaultTestButton = document.getElementById("default-test-button")
defaultTestButton.addEventListener("click",replayDefaultTest)

var uploadResultButton = document.getElementById("upload-result-button")
uploadResultButton.addEventListener("click",handleTestSubmit)

document.addEventListener("DOMContentLoaded", (event) => {
    console.log("DOM fully loaded and parsed")
    generateDefaultTest()
})
    



function getDateTime() {
    var date = new Date()
    var datetime = date.getDate() + "-"
                + (date.getMonth()+1)  + "-" 
                + date.getFullYear() + " "  
                + date.getHours() + ":"  
                + date.getMinutes() + ":" 
                + date.getSeconds();
    return datetime
}