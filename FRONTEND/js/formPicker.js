//this file is responsible for showing the right html form for the contact page
const formOptionsArr = document.querySelectorAll("#listOfForms input");
const mainDiv = document.getElementById("main");
const banner = document.getElementsByTagName("header")[0];

formOptionsArr.forEach(option=>{//give each option of forms a onclick event function
    option.onclick = function(){
        mainDiv.innerHTML = "";//clear the main div

        const templatePicked = document.getElementById(`${option.id}Template`);//pick the correct template

        const clone = templatePicked.content.cloneNode(true);//copy and insert the form from the template into the main div
        mainDiv.appendChild(clone);
        document.body.style.backgroundColor = "var(--mainWhite--)";//change the color of the body instead of slide up animation
    }
});

