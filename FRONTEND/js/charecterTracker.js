//this file is responsible for limiting and tracking the charecters in the text area
const contactPageObserver = new MutationObserver((mutationList, observer)=>{//make an observer from an observer object and set call back for mutation
    const textArea = document.querySelector("textArea");
    const charCountDisplay =  document.getElementById("charecterCounter");

    textArea.addEventListener("input",(event)=>{//attach an input change event on the text area
        let length = textArea.value.length;
        if(length > 255){//if the text area has more than 255 
            textArea.value = textArea.value.substring(0,255);
            length = 255;//manual update for bug
        }
        charCountDisplay.innerText = `${length}/255`;
    });
});
contactPageObserver.observe(document.querySelector("div#main"),{childList:true});//set it to observe
