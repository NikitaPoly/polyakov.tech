const xhr = new XMLHttpRequest();
xhr.onreadystatechange = ()=>{
    console.log("got data for the leader board :" + xhr.responseText)
}
xhr.open("GET","/home/scoreBoard");
xhr.send();