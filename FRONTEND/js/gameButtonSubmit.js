const gameButton = document.getElementById("gameSendButton");
const nameInput = document.getElementById("playerNameInput");
const clickerButton = document.getElementById("gameButton");
const userName = document.getElementById("playerNameInput");
let counter = 0;

clickerButton.onclick = () => {//keep track of the clicks
    clickerButton.innerText = `${++counter}`
}

gameButton.onclick = () => {//send info to server
    if (nameInput.value === "") {//check if input has a name
        alert("Please enter a name first");
    } else {
        const xhr = new XMLHttpRequest();
        const dataToSend = `Name:${nameInput.value},Score:${clickerButton.innerText}`;
        xhr.open("POST", "http://polyakov.tech/home");
        xhr.onload = () => {
            if (xhr.status == 200) {
                alert("Thank you " + nameInput.value + " for clicking. You sent the score of " + clickerButton.innerText);
            }
        }
        xhr.send(dataToSend);
    }
}