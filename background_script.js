// Put all the javascript code here, that you want to execute in background.
// Show that background_script is working
console.log("background_script.js is running");
//bgLogIntervalId = setInterval(_ => {console.log(timeLeft)}, 250);

// Set default values for each period. Uses var, because let variables will not show up with getBackgroundPage
var timeWork = 25,
timeBreak = 5,
timeRest = 20;
var fps = 5;
var rafId;
var timeLeft;
var timerText;
var timerCycle = ["work1", "break1", "work2", "break2", "work3", "break3", "work4", "break4", "rest"];
// timerCycleIndex starts at 1 so newCssSelector will select "break1" first
var timerCycleIndex = 1;
// Let oldCssSelector be work1 for the first Css change to function without error
var oldCssSelector = "work1", newCssSelector;
var continueLooping = true;

// Main function with logic
function backgroundMain(document) {
    // Add onclick events to all the buttons
    document.querySelector("#saveTimes").addEventListener("click", saveTimes);
    document.querySelector("#startTimer").addEventListener("click", startTimer);
    document.querySelector("#continueLooping").addEventListener("click", setContinueLoop);

    // Test main function, was used for developing
    // async function testMain() {
    //     console.log("Calling timerWork from testMain");
    //     // Wait for work timer to complete
    //     await timerWork();
    //     console.log("Finished waiting for timerWork");
    //     // Change CSS to show the new active timer
    //     changeCss();
    //     // Wait for break timer to complete
    //     await timerBreak();
    //     // Change CSS to show the new active timer
    //     changeCss();
    // }

    // Start the timer, adds active timer text CSS to the first Work
    function startTimer() {
        // Set continueLooping just in case user refreshed the page, causing checkbox status to stay but variable to change
        setContinueLoop();
        addActiveCssToStart();
        main();
    }

    // Main loop, calls the timer functions
    async function main() {
        for (var i = 0; i < 4; i++) {
            await timerWorkBreakAwait();
        }
        await timerRestAwait();
        // Loop if loop checkbox is still checked
        if (continueLooping) {
            main();
        }
    }

    // Work and break can be put together in one function, because they both run exactly the same 4 times each loop
    async function timerWorkBreakAwait() {
        // Wait for work timer to complete
        console.log("Calling timerWork from timerWorkBreakAwait");
        await timerWork();
        // console.log("Finished waiting for timerWork");
        // Change CSS to show the new active timer
        // changeCss();
        // Wait for break timer to complete
        console.log("Calling timerBreak from timerWorkBreakAwait");
        await timerBreak();
        // console.log("Finished waiting for timerBreak");
        // Change CSS to show the new active timer
        // if (document.querySelector("#timerText")) {
        //     changeCss();
        // }
    }

    function timerWork() {
        //console.log("Calling timer(timeWork)");
        return timer(timeWork);
    }

    function timerBreak() {
        //console.log("Calling timer(timeBreak)");
        return timer(timeBreak);
    }

    async function timerRestAwait() {
        console.log("Calling timerRest from timerRestAwait");
        await timerRest();
        // console.log("Finished waiting for timerRest");
        // changeCss();
    }

    function timerRest() {
        console.log("Calling timer(timeRest)");
        return timer(timeRest);
    }

    // Creates a promise that resovles when the timer is complete
    function timer(timeInSeconds) {
        //console.log("Returning promise from timer");
        return new Promise(function executor(resolve, reject) {
            var endTime = Date.now() + timeInSeconds * 1000;
            var rafCallback = function () {
                setTimeout(function () {
                    // timeLeft is in milliseconds
                    timeLeft = endTime - Date.now();

                    var timeLeftSeconds = Math.floor((timeLeft / 1000) % 60);
                    var timeLeftMinutes = Math.floor((timeLeft / 60000) % 60);

                    timerText = timeLeftMinutes + ":" + timeLeftSeconds;

                    // Recursive call to rAF if there is still time left
                    if (timeLeft > 0) {
                        rafId = requestAnimationFrame(rafCallback);
                    }
                    // If not, timer has finished. Resolve the promise to move on to the next time period
                    else {
                        console.log("Resolving now");
                        resolve();
                    }

                }, 1000 / fps);
            };

            // Call rAF to start the cycle
            rafId = requestAnimationFrame(rafCallback);
        });
    }

    

    // Save the inputted time values
    function saveTimes() {
        timeWork = document.querySelector("#timeWork").value;
        timeBreak = document.querySelector("#timeBreak").value;
        timeRest = document.querySelector("#timeRest").value;
        console.log(`timeWork: ${timeWork}, timeBreak: ${timeBreak}, timeRest: ${timeRest}`);
    }

    // Move the active CSS class to the next string in the array
    function changeCss() {
        // Move both pointers one to the right in the array
        // Check if this is the first time the function is being run
        if (newCssSelector) {
            oldCssSelector = newCssSelector;
        }
        newCssSelector = timerCycle[timerCycleIndex];
        console.log(`oldCssSelector: ${oldCssSelector}, newCssSelector: ${newCssSelector}`);
        // Remove the "active" class from the old timer and add it to the new timer
        document.querySelector(`#${oldCssSelector}`).classList.remove("timerTextActive");
        document.querySelector(`#${newCssSelector}`).classList.add("timerTextActive");
        // Increment the index for the next timer
        if (timerCycleIndex < timerCycle.length - 1) {
            //console.log(`timerCycleIndex is ${timerCycleIndex}`);
            timerCycleIndex++;
        }
        // Reset the index if it reached the last string in the array
        else {
            //console.log("timerCycleIndex reset");
            timerCycleIndex = 0;
        }
    }

    function addActiveCssToStart() {
        document.querySelector(`#work1`).classList.add("timerTextActive");
    }

    function setContinueLoop() {
        continueLooping = document.querySelector("#continueLooping").checked;
        console.log(`continueLooping is ${continueLooping}`);
    }

    return backgroundMain;
}