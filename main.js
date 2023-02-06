//VARS
let trackAttempt = fetchData("attemptNum");
let trackFace = fetchData("faceNum");
let trackPhase = fetchData("phaseNum");
let phaseUpdate = fetchData("phaseUpdate");
let start = 0;

let afraidTime = fetchTime("afraidTime");
let angerTime = fetchTime("angerTime");
let disgustTime = fetchTime("disgustTime");
let happyTime = fetchTime("happyTime");
let neutralTime = fetchTime("neutralTime");
let sadnessTime = fetchTime("sadnessTime");
let surprisedTime = fetchTime("surprisedTime");

let afraidIncorrect = fetchCorrect("afraidIncorrect");
let angerIncorrect = fetchCorrect("angerIncorrect");
let disgustIncorrect = fetchCorrect("disgustIncorrect");
let happyIncorrect = fetchCorrect("happyIncorrect");
let neutralIncorrect = fetchCorrect("neutralIncorrect");
let sadnessIncorrect = fetchCorrect("sadnessIncorrect");
let surprisedIncorrect = fetchCorrect("surprisedIncorrect");

let afraidCorrect = fetchCorrect("afraidCorrect");
let angerCorrect = fetchCorrect("angerCorrect");
let disgustCorrect = fetchCorrect("disgustCorrect");
let happyCorrect = fetchCorrect("happyCorrect");
let neutralCorrect = fetchCorrect("neutralCorrect");
let sadnessCorrect = fetchCorrect("sadnessCorrect");
let surprisedCorrect = fetchCorrect("surprisedCorrect");


const pageId = document.body.id;

// MAIN
handlePage(pageId); // All page dependent script
handlePageListener(pageId); // User input dependent on pagea

// FUNCTIONS
function handlePage(pageId) {

    if (pageId == 'phase') {
        phaseNum.innerHTML = "Phase " + trackPhase + " of 2";   
        trackPhase++;
        setData("phaseNum", trackPhase);

        if(trackAttempt > 15){
            document.getElementById("phaseType").innerHTML = "Emotional Recognition<br>Time Testing";
        }

    }

    else if (pageId == 'delay') {
        const timeInMiliseconds = (Math.random() * 3000) + 2500; // time between 2.5s-5.5s
        sleep(timeInMiliseconds).then(() => { window.location.href = 'react.html'; });
    }

    else if (pageId == 'attempt') {

        if(trackAttempt < 6) {
            attemptNum.innerHTML = trackAttempt + " / 5";
            trackAttempt++;
            setData("attemptNum", trackAttempt);
        }
        else {
            attemptNum.innerHTML = trackAttempt - 5 + " / 10";
            document.getElementById("practice").innerHTML = "Attempt";
            trackAttempt++;
            setData("attemptNum", trackAttempt);
        }

        if (trackAttempt > 16 && phaseUpdate <= 1){
            phaseUpdate++;
            setData("phaseUpdate", phaseUpdate);
            window.location.href = 'phase.html';
        }
        if(trackAttempt > 16){
            attemptNum.innerHTML = trackFace - 1 + " / 70"
            trackFace++;
            setData("faceNum", trackFace);
        }

    }

    else if (pageId == 'react') {
        start = new Date();
    }

    else if (pageId == 'face') {

        if(trackFace < 73){

            let faceAfraid = fetchArray("afraid");
            let faceAnger = fetchArray("anger");
            let faceDisgust = fetchArray("disgust");
            let faceHappy = fetchArray("happy");
            let faceNeutral = fetchArray("neutral");
            let faceSadness = fetchArray("sadness");
            let faceSurprised = fetchArray("surprised");
            let allEmotionsArrays = [faceAfraid, faceAnger, faceDisgust, faceHappy, faceNeutral, faceSadness, faceSurprised];
            
            let emotions = ["afraid","anger","disgust","happy","neutral","sadness","surprised"];
            let randomEmotionNumber = Math.floor(Math.random()*emotions.length);
            let randomEmotion = emotions[randomEmotionNumber];
            localStorage.setItem("lastShownEmotion", randomEmotion); 

            let emotionsArray = getRandomEmotionsArray(allEmotionsArrays, randomEmotion);
            while(emotionsArray.length == 0){ // to catch when an emotions array runs out of images to show
                randomEmotionNumber = Math.floor(Math.random()*emotions.length);
                randomEmotion = emotions[randomEmotionNumber];
                localStorage.setItem("lastShownEmotion", randomEmotion);
                emotionsArray = getRandomEmotionsArray(allEmotionsArrays, randomEmotion);
            } 

            let randomImageNumber = Math.floor(Math.random()*emotionsArray.length);
            let randomImage = emotionsArray[randomImageNumber];
            localStorage.setItem("randomImage", randomImage);

            document.getElementById("faceImg").innerHTML = "<img src = './" + randomImage +"' class='emotionImg' alt='face'></img>";
            sleepEmotion(randomEmotion, emotionsArray, randomImageNumber);

        }
        else {
            window.location.href = 'blank.html';
        }
    }

    else if (pageId == 'blank') {
        toString();
    }

}

// Space bar event listener used each time user interacts with the space bar
function handlePageListener(pageId) {
    document.addEventListener('keydown', event => {

        if(event.code === 'Space'){

            if (pageId == 'phase') { // Event for phase.html to continue to attempt.html
                window.location.href = 'attempt.html'; 
            }

            else if (pageId == 'attempt') { // Event for attempt.html to continue to delay.html on reaction time testing
                window.location.href = 'delay.html';

                if (phaseUpdate > 1){ // Event for attempt.html to continue to face.html on emotional recognition testing
                    window.location.href = 'face.html';
                }

            }
            else if (pageId == 'react') {
                if(trackAttempt >= 7 && trackAttempt < 18) { // Actual attempt logs elapsed time then continues to attempt.html
                    const elapsed = new Date() - start;
                    addElapsed(elapsed);
                    window.location.href = 'attempt.html';
                } 
                else { // Practice attempt only continues to attempt.html
                    window.location.href = 'attempt.html';
                }
            }
        }
    });

    if(pageId == 'buttons'){

        document.getElementById("afraid").addEventListener("click", event => { clickEvent(event) });
        document.getElementById("anger").addEventListener("click", event => { clickEvent(event) });
        document.getElementById("disgust").addEventListener("click", event => { clickEvent(event) });
        document.getElementById("happy").addEventListener("click", event => { clickEvent(event) });
        document.getElementById("neutral").addEventListener("click", event => { clickEvent(event) });
        document.getElementById("sadness").addEventListener("click", event => { clickEvent(event) });
        document.getElementById("surprised").addEventListener("click", event => { clickEvent(event) });
        document.getElementById("unsure").addEventListener("click", event => { clickEvent(event) });
    }
}

//Elapsed time is added to end of JSON Array
function addElapsed(elapsed) {
    let times = getElapsedTimes();
    times[times.length] = elapsed;
    saveTimes(times);
}

//Saves the JSON Array to localStorage
function saveTimes(times) {
    localStorage.setItem("elapsedTimes", JSON.stringify(times));
}

//Returns existing JSON Array or returns empty array
function getElapsedTimes() {
    if (localStorage.getItem("elapsedTimes") != null) {
        return JSON.parse(localStorage.getItem("elapsedTimes"));
    } 
    else {
        saveTimes([]);
        return [];
    }
}

//Fetches local storage data with key
function fetchData(key) {
    let data = 1;
    if (localStorage.getItem(key) != null){
        data = parseInt(localStorage.getItem(key),10);
    }
    else {
        localStorage.setItem(key, data);
    }
    return data;
}

//Sets local storage data with key
function setData(key, value) {
    localStorage.setItem(key, value);
}

//Delay in script
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

//Fisher-Yates Shuffle for script array
function shuffle(array) {
    let currentIndex = array.length,  randomIndex;
  
    // While there remain elements to shuffle.
    while (currentIndex != 0) {
  
      // Pick a remaining element.
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
  
    return array;
}

// sleeps the javascript for set amount of time based on emotion shown
function sleepEmotion(randomEmotion, emotionsArray, randomImageNumber){

    if (randomEmotion.includes("afraid")){
        sleep(afraidTime).then(() => {
            document.getElementById("faceImg").innerHTML = "";
            sleep(500).then(() => {
                emotionsArray.splice(randomImageNumber, 1);
                setArray(randomEmotion, emotionsArray);
                window.location.href = 'buttons.html';
            });
        });
    }

    else if (randomEmotion.includes("anger")){
        sleep(angerTime).then(() => {
            document.getElementById("faceImg").innerHTML = "";
            sleep(500).then(() => {
                emotionsArray.splice(randomImageNumber, 1);
                setArray(randomEmotion, emotionsArray);
                window.location.href = 'buttons.html';
            });
        });
    }

    else if (randomEmotion.includes("disgust")){
        sleep(disgustTime).then(() => {
            document.getElementById("faceImg").innerHTML = "";
            sleep(500).then(() => {
                emotionsArray.splice(randomImageNumber, 1);
                setArray(randomEmotion, emotionsArray);
                window.location.href = 'buttons.html';
            });
        });
    }

    else if (randomEmotion.includes("happy")){
        sleep(happyTime).then(() => {
            document.getElementById("faceImg").innerHTML = "";
            sleep(500).then(() => {
                emotionsArray.splice(randomImageNumber, 1);
                setArray(randomEmotion, emotionsArray);
                window.location.href = 'buttons.html';
            });
        });
    }

    else if (randomEmotion.includes("neutral")){
        sleep(neutralTime).then(() => {
            document.getElementById("faceImg").innerHTML = "";
            sleep(500).then(() => {
                emotionsArray.splice(randomImageNumber, 1);
                setArray(randomEmotion, emotionsArray);
                window.location.href = 'buttons.html';
            });
        });
    }

    else if (randomEmotion.includes("sadness")){
        sleep(sadnessTime).then(() => {
            document.getElementById("faceImg").innerHTML = "";
            sleep(500).then(() => {
                emotionsArray.splice(randomImageNumber, 1);
                setArray(randomEmotion, emotionsArray);
                window.location.href = 'buttons.html';
            });
        });
    }

    else if (randomEmotion.includes("surprised")){
        sleep(surprisedTime).then(() => {
            document.getElementById("faceImg").innerHTML = "";
            sleep(500).then(() => {
                emotionsArray.splice(randomImageNumber, 1);
                setArray(randomEmotion, emotionsArray);
                window.location.href = 'buttons.html';
            });
        });
    }
}

//chooses emotion array based on random emotion number generated
function getRandomEmotionsArray(allEmotionsArrays, randomEmotion) {

    if (randomEmotion == "afraid") {
        return allEmotionsArrays[0];
    }

    else if (randomEmotion == "anger"){
        return allEmotionsArrays[1];
    }

    else if (randomEmotion == "disgust"){
        return allEmotionsArrays[2];
    }

    else if (randomEmotion == "happy"){
        return allEmotionsArrays[3];
    }

    else if (randomEmotion == "neutral"){
        return allEmotionsArrays[4];
    }

    else if (randomEmotion == "sadness"){
        return allEmotionsArrays[5];
    }

    else if (randomEmotion == "surprised"){
        return allEmotionsArrays[6];
    }
}

// depending on button clicked and if the choice was correct based on last emotion adds or subtracts time to referenced emotion
function clickEvent(event){

    let myButtonId = event.currentTarget.id;


    if (myButtonId == "afraid" && localStorage.getItem("lastShownEmotion") == "afraid"){

        afraidCorrect++;
        setCorrect("afraidCorrect", afraidCorrect);
        setLastEmotionTime("lastAfriadTime", afraidTime);
        afraidTime = calculateCorrect(afraidTime, "afraidDifference", afraidIncorrect);
        setTime("afraidTime", afraidTime);
        setDifference("afraidDifference", afraidTime, "lastAfraidTime");
        window.location.href = "attempt.html";

    }

    else if (myButtonId == "afraid") {

        addIncorrect();
        window.location.href = "attempt.html"; // changes windows

    }

    else if (myButtonId == "anger" && localStorage.getItem("lastShownEmotion") == "anger") {

        angerCorrect++;
        setCorrect("angerCorrect", angerCorrect);
        setLastEmotionTime("lastAngerTime", angerTime);
        angerTime = calculateCorrect(angerTime, "angerDifference", angerIncorrect);
        setTime("angerTime", angerTime);
        setDifference("angerDifference", angerTime, "lastAngerTime");
        window.location.href = "attempt.html";

    }

    else if(myButtonId == "anger") {

        addIncorrect();
        window.location.href = "attempt.html"; // changes windows

    }

    else if (myButtonId == "disgust" && localStorage.getItem("lastShownEmotion") == "disgust") {

        disgustCorrect++;
        setCorrect("disgustCorrect", disgustCorrect);
        setLastEmotionTime("lastDisgustTime", disgustTime);
        disgustTime = calculateCorrect(disgustTime, "disgustDifference", disgustIncorrect);
        setTime("disgustTime", disgustTime);
        setDifference("disgustDifference", disgustTime, "lastDisgustTime");
        window.location.href = "attempt.html";

    }

    else if(myButtonId == "disgust") {

        addIncorrect();
        window.location.href = "attempt.html";

    }

    else if (myButtonId == "happy" && localStorage.getItem("lastShownEmotion") == "happy") {

        happyCorrect++;
        setCorrect("happyCorrect", happyCorrect);
        setLastEmotionTime("lastHappyTime", happyTime);
        happyTime = calculateCorrect(happyTime, "happyDifference", happyIncorrect);
        setTime("happyTime", happyTime);
        setDifference("happyDifference", happyTime, "lastHappyTime");
        window.location.href = "attempt.html";
    }

    else if(myButtonId == "happy") {
        addIncorrect();
        window.location.href = "attempt.html";
    }

    else if (myButtonId == "neutral" && localStorage.getItem("lastShownEmotion") == "neutral") {

        neutralCorrect++;
        setCorrect("neutralCorrect", neutralCorrect);
        setLastEmotionTime("lastNeutralTime", neutralTime);
        neutralTime = calculateCorrect(neutralTime, "neutralDifference", neutralIncorrect);
        setTime("neutralTime", neutralTime);
        setDifference("neutralDifference", neutralTime, "lastNeutralTime");
        window.location.href = "attempt.html";

    }

    else if(myButtonId == "neutral") {

        addIncorrect();
        window.location.href = "attempt.html";

    }

    else if (myButtonId == "sadness" && localStorage.getItem("lastShownEmotion") == "sadness") {

        sadnessCorrect++;
        setCorrect("sadnessCorrect", sadnessCorrect);
        setLastEmotionTime("lastSadnessTime", sadnessTime);
        sadnessTime = calculateCorrect(sadnessTime, "sadnessDifference", sadnessIncorrect);
        setTime("sadnessTime", sadnessTime);
        setDifference("sadnessDifference", sadnessTime, "lastSadnessTime");
        window.location.href = "attempt.html";

    }

    else if(myButtonId == "sadness") {

        addIncorrect();
        window.location.href = "attempt.html";
        
    }

    else if (myButtonId == "surprised" && localStorage.getItem("lastShownEmotion") == "surprised") {

        surprisedCorrect++;
        setCorrect("surprisedCorrect", surprisedCorrect);
        setLastEmotionTime("lastSurprisedTime", surprisedTime);
        surprisedTime = calculateCorrect(surprisedTime, "surprisedDifference", surprisedIncorrect);
        setTime("surprisedTime", surprisedTime);
        setDifference("surprisedDifference", surprisedTime, "lastSurprisedTime");
        window.location.href = "attempt.html";

    }

    else if(myButtonId == "surprised") {

        addIncorrect();
        window.location.href = "attempt.html";

    }

    else if(myButtonId == "unsure"){

        addIncorrect();
        window.location.href = "attempt.html";

    }
}

// fetches the difference in ms between time shown two images ago and current time to be used in calculate function to produce new time
function fetchDifference(keyName){
    let difference = 0;
    difference = parseFloat(localStorage.getItem(keyName));
    return difference;
}

//sets the difference in ms between time shown previously and new calculation for time to be used in next calculate function
function setDifference(keyName, time, lastTimeKey){
    let difference = Math.abs(fetchLastEmotionTime(lastTimeKey) - time);
    localStorage.setItem(keyName, difference);
}

// calculates new value for emotion if correct
function calculateCorrect(time, keyName, incorrectValue){
    let newTime = 0
    if(incorrectValue != 0) {
        newTime = time - (fetchDifference(keyName) / 2);
    }
    else {
        newTime = time - 25;
    }
    return newTime;
}

// calculates new value for emotion time if incorrect
function calculateIncorrect(time, key, correctValue){
    let newTime = 0; 
    if (correctValue != 0) {
        newTime = time + (fetchDifference(key) / 2)
    }
    else {
        newTime = time + 25;
    }
    return newTime;
}

// function to do when option selected is incorrect
function addIncorrect(){

    if (localStorage.getItem("lastShownEmotion") == "afraid"){

        afraidIncorrect++;
        setCorrect("afraidIncorrect", afraidIncorrect);
        setLastEmotionTime("lastAfriadTime", afraidTime);
        afraidTime = calculateIncorrect(afraidTime, "afraidDifference", afraidCorrect);
        setTime("afraidTime", afraidTime);
        setDifference("afraidDifference", afraidTime, "lastAfraidTime");

    }

    else if (localStorage.getItem("lastShownEmotion") == "anger"){

        angerIncorrect++;
        setCorrect("angerIncorrect", angerIncorrect);
        setLastEmotionTime("lastAngerTime", angerTime);
        angerTime = calculateIncorrect(angerTime, "angerDifference", angerCorrect);
        setTime("angerTime", angerTime);
        setDifference("angerDifference", angerTime, "lastAngerTime");

    }

    else if (localStorage.getItem("lastShownEmotion") == "disgust"){

        disgustIncorrect++;
        setCorrect("disgustIncorrect", disgustIncorrect);
        setLastEmotionTime("lastDisgustTime", disgustTime);
        disgustTime = calculateIncorrect(disgustTime, "disgustDifference", disgustCorrect);
        setTime("disgustTime", disgustTime);
        setDifference("disgustDifference", disgustTime, "lastDisgustTime");

    }

    else if (localStorage.getItem("lastShownEmotion") == "happy"){

        happyIncorrect++;
        setCorrect("happyIncorrect", happyIncorrect);
        setLastEmotionTime("lastHappyTime", happyTime);
        happyTime = calculateIncorrect(happyTime, "happyDifference", happyCorrect);
        setTime("happyTime", happyTime);
        setDifference("happyDifference", happyTime, "lastHappyTime");

    }

    else if (localStorage.getItem("lastShownEmotion") == "neutral"){

        neutralIncorrect++;
        setCorrect("neutralIncorrect", neutralIncorrect);
        setLastEmotionTime("lastNeutralTime", neutralTime);
        neutralTime = calculateIncorrect(neutralTime, "neutralDifference", neutralCorrect);
        setTime("neutralTime", neutralTime);
        setDifference("neutralDifference", neutralTime, "lastNeutralTime");

    }

    else if (localStorage.getItem("lastShownEmotion") == "sadness"){

        sadnessIncorrect++;
        setCorrect("sadnessIncorrect", sadnessIncorrect);
        setLastEmotionTime("lastSadnessTime", sadnessTime);
        sadnessTime = calculateIncorrect(sadnessTime, "sadnessDifference", sadnessCorrect);
        setTime("sadnessTime", sadnessTime);
        setDifference("sadnessDifference", sadnessTime, "lastSadnessTime");

    }

    else if (localStorage.getItem("lastShownEmotion") == "surprised"){

        surprisedIncorrect++;
        setCorrect("surprisedIncorrect", surprisedIncorrect);
        setLastEmotionTime("lastSurprisedTime", surprisedTime);
        surprisedTime = calculateIncorrect(surprisedTime, "surprisedDifference", surprisedCorrect);
        setTime("surprisedTime", surprisedTime);
        setDifference("surprisedDifference", surprisedTime, "lastSurprisedTime");

    }
}

//loads file names for each face image
function loadImageArray(category) {
    let list = [];

    for (let i = 1; i <= 10; i++) {
        list[list.length] = "faces/" + category + "/" + i + ".JPG";
    }

    return list;
}

// fetches the last time in ms that a specified emotion was displayed
function fetchLastEmotionTime(key){
    let time = 150;
    if (localStorage.getItem(key) != null){
        time = parseFloat(localStorage.getItem(key));
    }
    else {
        localStorage.setItem(key, time);
    }
    return time;
}

//sets the last emotion displayed time in ms for a specified emotion
function setLastEmotionTime(key, time){
    localStorage.setItem(key, time);
}

// fetches if last emotion respose was correct if it exists, else it assumes it is correct
function fetchCorrect(key){
    let correct = 0;
    if(localStorage.getItem(key) != null){
        correct = parseInt(localStorage.getItem(key), 10);
    }
    else {
        localStorage.setItem(key, correct); 
    }
    return correct;
}

//sets if emotion responded to was correct or incorrect
function setCorrect(key, correctNum){
    localStorage.setItem(key, correctNum);
}

//grabs localStorage array if it exists, else creates face array and saves
function fetchArray(category){
    let data = [];
    if(localStorage.getItem(category) != null){
        data = JSON.parse(localStorage.getItem(category));
    }
    else {
        data = loadImageArray(category);
        localStorage.setItem(category, JSON.stringify(data));
    }
    return data;
}

//saves localStorage face arrays with key
function setArray(key, array) {
    localStorage.setItem(key, JSON.stringify(array));
}

//fetches float number of time for specific emotion
function fetchTime(key){
    let time = 150;
    if(localStorage.getItem(key) != null){
        time = parseFloat(localStorage.getItem(key));
    }
    else {
        setTime(key, time);
    }
    return time;
}

//sets the time for each emotion
function setTime(key, time){
    localStorage.setItem(key, time);
}

function averageReactionTime(reactionTimeArray){
    let sum = 0;
    for (let i=0; i<reactionTimeArray.length; i++){
        sum += reactionTimeArray[i];
    }
    sum /= reactionTimeArray.length;
    return sum;
}

//toString printing all available data
function toString() {

    //console.log("trackPhase: " + trackPhase);
    //console.log("trackAttempt: " + trackAttempt);
    //console.log("trackFace: " + trackFace);
    //console.log("phaseUpdate: " + phaseUpdate);
    //console.log("Last Shown Emotion: " + localStorage.getItem("lastShownEmotion"));
    //console.log(localStorage.getItem("randomImage"));
    //console.log(localStorage.getItem("randomImageNumber"));
    //console.log("----------------------------------------------------------------------------")
    //console.log(" ");

    console.log("Reaction Time Trials:")
    console.log(getElapsedTimes());

    console.log("Average Reaction Time:")
    console.log(averageReactionTime(getElapsedTimes()));
    console.log("----------------------------------------------------------------------------")

    console.log(fetchArray("afraid"));
    //UNFIN console.log(fetchArray("anger"));
    //UNFIN console.log(fetchArray("disgust"));
    //UNFIN console.log(fetchArray("happy"));
    //UNFIN console.log(fetchArray("neutral"));
    //UNFIN console.log(fetchArray("sadness"));
    //UNFIN console.log(fetchArray("surprised"));
    console.log("----------------------------------------------------------------------------")
    //console.log(" ");

    
    //console.log("Last Afraid Time: "+localStorage.getItem("lastAfraidTime"));
    //console.log("Last Anger Time: "+localStorage.getItem("lastAngerTime"));
    //console.log("Last Disgust Time: "+localStorage.getItem("lastDisgustTime"));
    //console.log("Last Happy Time: "+localStorage.getItem("lastHappyTime"));
    //console.log("Last Neutral Time: "+localStorage.getItem("lastNeutralTime"));
    //console.log("Last Sadness Time: "+localStorage.getItem("lastSadnessTime"));
    //console.log("--------------------Split---------------------")
    //console.log(" ");
    
    console.log("Afraid Reaction Time:       " + afraidTime);
    console.log("Anger Reaction Time:        " + angerTime);
    console.log("Disgust Reaction Time:      " + disgustTime);
    console.log("Happy Reaction Time:        " + happyTime);
    console.log("Neutral Reaction Time:      " + neutralTime);
    console.log("Sadness ReactionTime:       " + sadnessTime);
    console.log("Surprised Reaction Time:    " + surprisedTime);
    console.log("----------------------------------------------------------------------------")
    //console.log(" ");

    console.log("Incorrect:    AF-"+afraidIncorrect+" AN-"+angerIncorrect+" DI-"+disgustIncorrect+" HA-"+happyIncorrect+" NE-"+neutralIncorrect+" SA-"+sadnessIncorrect+" SU-"+surprisedIncorrect);
 
    console.log("Correct:      AF-"+afraidCorrect+" AN-"+angerCorrect+" DI-"+disgustCorrect+" HA-"+happyCorrect+" NE-"+neutralCorrect+" SA-"+sadnessCorrect+" SU-"+surprisedCorrect);

}