; // Code for the timer portion of the web extension
(function() {
    // Add the module prefix to the console logs for debugging
    const console = consoleAddNameAsPrefix('timer', '#ff8d33');

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
        "endTime": 0,
        "timerFunctionIndex": 0
    };

    // Assign local variable of window to each default value
    for (const defaultKey in defaultValues) {
        let setDefaultValue = setDefaultLocalStorage(defaultKey, defaultValues[defaultKey]);
        window[defaultKey] = setDefaultValue;
        console.log(`${defaultKey}: localStorage: ${setDefaultValue}, variable: ${window[defaultKey]}`);
    }

    // Variables
    // timeWork, timeBreak, timeRest and endTime are declared in defaultValues above
    // ID to cancelAnimationFrame
    let rafId;
    let fps = 5;
    let timerFunctionArray = [timerWork, timerBreak, timerWork, timerBreak, timerWork, timerBreak, timerWork, timerBreak, timerRest];
    let pomodoroNameArray = ["Work", "Break", "Work", "Break", "Work", "Break", "Work", "Break", "Rest"];
    let cssIdArray = ["work1", "break1", "work2", "break2", "work3", "break3", "work4", "break4", "rest"];

    document.querySelector("#saveTimes").addEventListener("click", saveTimes);
    document.querySelector("#startTimer").addEventListener("click", startTimer);
    document.querySelector("#continueTimer").addEventListener("click", mainTimerLoop);

    // Check if endTime is less than now, continue timer if it is
    window.addEventListener("load", timerOnLoad);
    async function timerOnLoad() {
        timerFunctionIndex = Number.parseInt(timerFunctionIndex);
        if (endTime > Date.now()) {
            changeActivePomodoroCss(timerFunctionIndex);
            await timerPromise();
            endPomodoro();
        } else {
            if (timerFunctionIndex != 0) {
                changeActivePomodoroCss(timerFunctionIndex - 1);
                displayEndScreen(timerFunctionIndex - 1);
            }
        }
    }

    // Start the timer, adds active timer text CSS to the first Work
    function startTimer() {
        timerFunctionIndex = 0;
        localStorage.setItem("timerFunctionIndex", timerFunctionIndex);
        changeActivePomodoroCss(0);
        mainTimerLoop();
    }

    // Main loop, calls the timer functions
    async function mainTimerLoop() {
        changeActivePomodoroCss(timerFunctionIndex);
        await timerFunctionArray[timerFunctionIndex]();
        endPomodoro();
    }

    function endPomodoro() {
        displayEndScreen(timerFunctionIndex);
        incrementTimerFunctionIndex();
    }

    function displayEndScreen(index) {
        index = Number.parseInt(index);
        document.querySelector("#timerText").innerHTML = `Pomodoro ${pomodoroNameArray[index]} has ended! Click Continue to move on to the next Pomodoro ${pomodoroNameArray[index + 1]}.`;
    }

    function incrementTimerFunctionIndex() {
        timerFunctionIndex = (timerFunctionIndex + 1) % 9;
        localStorage.setItem("timerFunctionIndex", timerFunctionIndex);
    }

    function timerWork() {
        return timer(timeWork);
    }

    function timerBreak() {
        return timer(timeBreak);
    }

    function timerRest() {
        return timer(timeRest);
    }

    // Sets endTime and calls the timer function
    function timer(timeInSeconds) {
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
                    if (timerInSeconds > 1000 / fps) {
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
            window[timeValueKey] = timeValueList[timeValueKey];
            console.log(`${timeValueKey}: ${window[timeValueKey]}`);
        }
    }

    // Change the CSS of the current pomodoro to red text, and the rest to nothing
    function changeActivePomodoroCss(index) {
        // console.log(`index: ${index}. cssIdArray: ${cssIdArray}. cssIdArray[index]: ${cssIdArray[index]}`);
        // console.log(`changeActivePomodoroCss: #${cssIdArray[index]}`);
        document.querySelector(`#${cssIdArray[index]}`).classList.add("timerTextActive");
        for (let i = 0; i < 9; i++) {
            if (i != index) {
                document.querySelector(`#${cssIdArray[i]}`).classList.remove("timerTextActive");
            }
        }
    }

}());