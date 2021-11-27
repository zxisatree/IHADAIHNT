; // Code for the timer portion of the web extension
(function(global) {
    // Add the module prefix to the console logs for debugging
    const console = consoleAddNameAsPrefix('timer', '#ff8d33 ');

    // Check is key has been set before, set default value if not, always return value
    function setDefaultLocalStorage(key, value) {
        let item = localStorage.getItem(key);
        if (!item) {
            localStorage.setItem(key, value);
            return value;
        } else {
            return item;
        }
    }

    // Set default values for each period
    let defaultValues = {
        "timeWork": 2,
        "timeBreak": 3,
        "timeRest": 4,
        "endTime": 0
    };

    // Assign local variable of window to each default value
    for (const defaultKey in defaultValues) {
        let setDefaultSuccessfully = setDefaultLocalStorage(defaultKey, defaultValues[defaultKey]);
        global[defaultKey] = setDefaultSuccessfully;
        console.log(`localStorage: ${defaultKey}: ${setDefaultSuccessfully}`);
        console.log(`Variable ${defaultKey}: ${global[defaultKey]}`);
    }

    // Variables
    // timeWork, timeBreak, timeRest and endTime are declared in defaultValues above
    // ID to cancelAnimationFrame
    let rafId;
    let continueLooping = false;

    document.querySelector("#saveTimes").addEventListener("click", saveTimes);
    document.querySelector("#startTimer").addEventListener("click", startTimer);
    document.querySelector("#continueLooping").addEventListener("click", setContinueLoop);

    // Start the timer, adds active timer text CSS to the first Work
    function startTimer() {
        // Set continueLooping just in case user refreshed the page, causing checkbox status to stay but variable to change
        setContinueLoop();
        mainTimerLoop();
    }

    // Main loop, calls the timer functions
    async function mainTimerLoop() {
        for (var i = 0; i < 4; i++) {
            await timerWorkBreakAwait();
            if (!continueLooping) {
                return;
            }
        }
        await timerRestAwait();
        // Loop if loop checkbox is still checked
        if (continueLooping) {
            mainTimerLoop();
        }
    }

    // Work and break can be put together in one function, because they both run exactly the same 4 times each loop
    async function timerWorkBreakAwait() {
        await timerWork();
        // insert Change CSS
        await timerBreak();
        // insert Change CSS
    }

    function timerWork() {
        return timer(timeWork);
    }

    function timerBreak() {
        return timer(timeBreak);
    }

    async function timerRestAwait() {
        await timerRest();
    }

    function timerRest() {
        return timer(timeRest);
    }

    // Sets endTime and calls the timer function
    function timer(timeInSeconds) {
        let fps = 5;
        endTime = Date.now() + timeInSeconds * 1000;
        localStorage.setItem("endTime", endTime);
        return timerPromise();
    }

    // Returns a promise that resovles when the timer is complete
    function timerPromise() {
        return new Promise(function executor(resolve, reject) {
            let rafCallback = function () {
                setTimeout(function () {
                    let timerInSeconds = 0;
                    let timerText;

                    // timerInSeconds is in milliseconds
                    // endTime is either declared in defaultValues or in the function timer
                    timerInSeconds = endTime - Date.now();

                    let timeLeftSeconds = Math.floor((timerInSeconds / 1000) % 60);
                    let timeLeftMinutes = Math.floor((timerInSeconds / 60000) % 60);

                    timerText = timeLeftMinutes + ":" + timeLeftSeconds;
                    document.querySelector("#timerText").innerHTML = timerText;

                    // Recursive call to rAF if there is still time left
                    if (timerInSeconds > 0) {
                        rafId = requestAnimationFrame(rafCallback);
                    }
                    // If not, timer has finished. Resolve the promise to move on to the next time period
                    else {
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
        let timeValueList = {
            "timeWork": document.querySelector("#timeWork").value,
            "timeBreak": document.querySelector("#timeBreak").value,
            "timeRest": document.querySelector("#timeRest").value
        };

        for (const timeValueKey in timeValueList) {
            // Will not save the inputted time if it's not an integer
            if (!Number.isInteger(parseInt(timeValueList[timeValueKey]))) {
                console.log(`${timeValueKey} is not an integer`);
                continue;
            }
            localStorage.setItem(timeValueKey, timeValueList[timeValueKey]);
            global[timeValueKey] = timeValueList[timeValueKey];
            console.log(`${timeValueKey}: ${timeValueList[timeValueKey]}`);
        }
        console.log(`timeWork: ${timeWork}, timeBreak: ${timeBreak}, timeRest: ${timeRest}`);
    }

    function setContinueLoop() {
        continueLooping = document.querySelector("#continueLooping").checked;
    }

}(window));