"use strict"
const http = require("http");
const fs = require("fs");
const MongoClient = require('mongodb').MongoClient;

let port = process.env.PORT
if (port == null || port == "") {
    port = 8080
}
const validWebPath = ["home", "contact", "projects", "resume"];

const PolyakovDOTtech = http.createServer();

function getRequestRoadMap(requestURL) {//will give back and array of sopping points /home/home.css = home home.css
    let arrOfStoppingPoints = requestURL.split("/");
    arrOfStoppingPoints.shift();//get rid of first /
    return arrOfStoppingPoints;
}
function getFileLocation(endPointsArr) {//gets the file to be returned
    if (endPointsArr[0] === "favicon.ico") {
        return "FRONTEND/graphics/favicon.ico";
    }
    else if(endPointsArr[0] === "PolyakovResume.pdf"){
        console.log("pdf");
        return "FRONTEND/documents/PolyakovResume.pdf";
    }
    else if (endPointsArr[0] === "") {// map the / path to home
        return "FRONTEND/home.html";
    }
    else if (endPointsArr.length === 1 && validWebPath.includes(endPointsArr[0])) {//if request is on web point basis
        //console.log("basis path is : " + endPointsArr);//debug
        return `FRONTEND/${endPointsArr[0]}.html`;
    }
    else if (endPointsArr[0] === "FRONTEND" && endPointsArr.length > 1) {
        return endPointsArr.join("/");
    }
}
function sendWebResource(filePath, res) {//send the web file requested and finishes response
    if (filePath === undefined) {
        //console.log("file does not exist");
        res.writeHead("404");
        fs.readFile("FRONTEND/lost.html", "utf8", (err, data) => {
            res.write(data);
            res.end();
        })
    }
    else {
        fs.readFile(filePath, "utf8", (err, data) => {
            if (err) {
                console.log("ERROR, THE ERROR IS : " + err);//debug
                res.writeHead(500);
                res.write("Server error in finding the file");
                res.end();
            } else {
                //console.log(`${filePath} was sent SUCCESSFULLY`);//debug
                if(filePath === "FRONTEND/documents/PolyakovResume.pdf"){
                    res.writeHead(200,{"Content-Type" : "application/pdf"})
                    console.log(data)
                    res.write(data);
                    res.end();
                    return
                }
                filePath.includes(".svg") ? res.writeHead(200, { "Content-Type": "image/svg+xml" }) : res.writeHead(200);//add content type if svg is being sent
                res.write(data);
                res.end();
            }
        });
    }
}
async function saveToDB(page, lineToSave) {//save the file to the db
    const uri = "mongodb+srv://PolyakovDOTTech:123abc@polyakovtechdb.n6fvv.mongodb.net/PolyakovTechDB?retryWrites=true&w=majority";
    const client = new MongoClient(uri);
    try {
        if (page == "/contact") {
            await client.connect();
            const db = await client.db("WebsiteData");
            await db.collection("contactSubmission").insertOne({ Content: `${lineToSave}` }, (err) => {
                if (err) console.log(err)
            });
            await client.close();
        } else if (page == "/home") {
            await client.connect();
            const db = await client.db("WebsiteData");

            await db.collection("clickGameData").insertOne({ Content: `${lineToSave}` }, (err) => {
                if (err) console.log(err);
            });
        }
    } catch {
        console.log("error: did not save to DB", err); 
    }
}
async function getFromDB(reason){
    switch(reason){
        case "SCORE":
            
    }
}
function proccesRequest(req, res) {
    switch (req.method) {
        case "GET":
            console.log("get request");
            if (req.url == "/home/scoreBoard") {
                console.log("worked from the home leader board");
                res.writeHead(200);
                res.write("This is the test for the leader board");
                res.end();
                return;
            }
            const roadMap = getRequestRoadMap(req.url);
            //console.log(url.parse(req.url));//debug
            //console.log(roadMap);//debug

            const fileLocation = getFileLocation(roadMap);

            //console.log(fileLocation);//debug

            sendWebResource(fileLocation, res);
            break;
        case "POST"://just that a post happend. no data  handling here
            console.log("post request with : " + req.url);//debug
            if (req.url === "/contact" || req.url === "/home") {
                sendWebResource(`FRONTEND${req.url}.html`, res);
            } else {
                res.writeHead(403);
                res.end();
            }
            break;
        default:
            res.writeHead(405);
            res.write(`${req.method} is not a support HTTP verb. Only GET and POST are accepted`);
            res.end()
    }

    req.on("data", data => {//data handling for the posts from contact and home
        console.log("got data at : " + req.url + "\nThe data is : " + data);//debug
        if (req.url === "/contact" || req.url === "/home") {
            saveToDB(`${req.url}`, data);
            convertData(req.url);
        }
    })
}

PolyakovDOTtech.on("request", proccesRequest).listen(port);