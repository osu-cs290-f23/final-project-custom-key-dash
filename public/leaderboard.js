var serverUrl = 'http://localhost:3000/leaderboard'

function getRandScore() {
    var randScore = Math.floor(Math.random() * 220) + 1
    document.getElementById('score').value = randScore
}

function updateLeaderboard() {
    var name = document.getElementById('name').value
    var score = parseInt(document.getElementById('score').value)

    if (name && !isNaN(score)) {
        var entry = { name, score, date: getDateTime() }

        fetch(serverUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(entry),
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                fetchLeaderboard()
            } else {
                alert('Failed to update leaderboard.')
            }
        })
        .catch(error => {
            console.error('Error:', error)
            alert('Failed to update leaderboard. Please try again.')
        });
    } else {
        alert('Please fill in all fields.')
    }
}

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

function fetchLeaderboard() {
    fetch(serverUrl)
        .then(response => response.json())
        .then(data => {
            displayLeaderboard(data)
        })
        .catch(error => {
            console.error('Error:', error)
            alert('Failed to fetch leaderboard data. Please try again.')
        });
}

function displayLeaderboard(leaderboardData) {
    var tbody = document.querySelector('#leaderboard tbody')
    tbody.innerHTML = '';
    leaderboardData.sort((a, b) => b.score - a.score)

    leaderboardData.forEach((entry, index) => {
        var row = tbody.insertRow(index)
        var cells = [index + 1, entry.name, entry.score, entry.date]

        cells.forEach(cellData => {
            var cell = row.insertCell()
            cell.textContent = cellData
        })
    })
}

fetchLeaderboard()