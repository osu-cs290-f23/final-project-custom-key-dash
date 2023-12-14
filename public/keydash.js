var unattemptedSpan = document.getElementById("unattempted")
var correctSpan = document.getElementById("correct")
var incorrectSpan = document.getElementById("incorrect")

var testResults = document.getElementById("test-results")
var wpmResult = document.getElementById("wpm-result")
var wpm = 0

var testTitle = document.getElementById("test-title")
var testString = ""
var defaultTest = true

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
    document.getElementById("name-input").value = ""
}

function replayDefaultTest(){
    defaultTest = true
    testTitle.textContent = "Default Test"
    generateDefaultTest()
    resetTestElements()
}

function changeCustomTest(element){
    defaultTest = false
    console.log(element.nextElementSibling)
    testTitle.textContent = element.textContent.trim()
    testString = element.nextElementSibling.textContent.trim()
    resetTestElements()
}

function replayTest(){
    if(defaultTest){
        replayDefaultTest()
    } else {
        resetTestElements()
    }
}

function displayResults(wpm){
    testResults.classList.remove("hidden")
    unattemptedSpan.classList.add("hidden")
    correctSpan.classList.add("hidden")
    incorrectSpan.classList.add("hidden")
    wpmResult.textContent = "WPM: " + wpm
}

function handleTestSubmit(){
    var nameInput = document.getElementById("name-input")
    var username = nameInput.value
    if(username.trim()){
        uploadTestResults(username,wpm)
        nameInput.value = ""
    } else {
        alert("Missing name input")
    }
}

function uploadTestResults(username,wpm){
    fetch('/leaderboardData',{
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
        replayTest()
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
var allowedChars = " abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ,./;:\"'[]{}\\|?~!@#$%^&*()_`1234567890-"

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
            
            if(allowedChars.includes(key)){
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

window.addEventListener("keydown",function (event){
    if (event.code === 'Space') {
        event.preventDefault();
    }
    if(isMouseTestHover){
        testUpdate(event)
    }
})

//checking if mouse is over test box to prevent unwanted typing
var isMouseTestHover = false
var testBox = document.getElementById("test-box")
testBox.addEventListener("mouseleave", function (event) {
    isMouseTestHover = false
})
testBox.addEventListener("mouseover", function (event) {
    isMouseTestHover = true
})

var replayTestButton = document.getElementById("replay-test-button")
replayTestButton.addEventListener("click",replayTest)

var defaultTestButton = document.getElementById("default-test-button")
defaultTestButton.addEventListener("click",replayDefaultTest)

var uploadResultButton = document.getElementById("upload-result-button")
uploadResultButton.addEventListener("click",handleTestSubmit)

document.addEventListener("DOMContentLoaded", (event) => {
    console.log("DOM fully loaded and parsed")
    generateDefaultTest()
    displayCustomTests()
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





// CUSTOM TESTS

var modalBackdrop = document.getElementById("modal-backdrop")
var customTestModal = document.getElementById("custom-test-modal")
var titleInput = document.getElementById("title-input")
var customTestBody = document.getElementById("custom-test-body")

function displayCustomTests(){
    var customTestData = []
    fetch('/custom-tests')
        .then(res => res.json())
        .then(data => {
            customTestData = data
            customTestData.forEach(elem =>{
                addCustomTest(elem.title,elem.content)
            })
        })
}

function addCustomTest(title,content){
    var customTestPreview = Handlebars.templates.customTest({
        title: title,
        content: content
      })
    var customTestsDiv = document.getElementById("custom-tests")
    customTestsDiv.insertAdjacentHTML("beforeend",customTestPreview)
}

function openCustomTestModal(){
    modalBackdrop.classList.remove("hidden")
    customTestModal.classList.remove("hidden")
}

function handleModalAccept(){
    var title = titleInput.value.trim()
    var content = customTestBody.value.trim()
    if(title && content){
        fetch('/custom-tests',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                title: title,
                content: content
            })
        }).then(function(){
            addCustomTest(title,content)
        }).then(function(){
            closeCustomTestModal()
        })
        .catch(err =>{
            alert("Error submitting test")
        })
    }else{
        alert("Missing input(s)")
    }
}

function closeCustomTestModal(){
    modalBackdrop.classList.add("hidden")
    customTestModal.classList.add("hidden")
    titleInput.value = ""
    customTestBody.value = ""
}

var addCustomTestButton = document.getElementById("add-custom-test-button")
addCustomTestButton.addEventListener("click",openCustomTestModal)

var modalCancelButton = document.getElementById("modal-cancel")
var modalCloseButton = document.getElementById("modal-close")

modalCancelButton.addEventListener("click",closeCustomTestModal)
modalCloseButton.addEventListener("click",closeCustomTestModal)

var modalAcceptButton = document.getElementById("modal-accept")

modalAcceptButton.addEventListener("click",handleModalAccept)