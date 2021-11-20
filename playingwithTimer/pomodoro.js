; // Simple pomodoro timer that loops through 4 work+break cycles into rest
(function(global) {
    // Add the module prefix to the console logs
    //const console = consoleAddNameAsPrefix('pomodoro', '#f1948a ');

    // Set the default values for the timer
    let timeWork = 25;
    let timeBreak = 5;
    let timeRest = 20;
    // ID to cancelAnimationFrame
    let rAFID;
    let timerFinished = false;
    let timerText;

    // Add onclick events to all the buttons
    document.querySelector("#savePomodoro").addEventListener("click", savePomodoro);
    document.querySelector("#startPomodoro").addEventListener("click", startPomodoro);

    // Start the pomodoro timer
    function startPomodoro() {
        doCountdown("#work1");
        // W B W B W B W B R
    }

    // Save the inputted time values
    function savePomodoro() {
        timeWork = document.querySelector("#timeWork").value;
        timeBreak = document.querySelector("#timeBreak").value;
        timeRest = document.querySelector("#timeRest").value;
        console.log(`timeWork: ${timeWork}, timeBreak: ${timeBreak}, timeRest: ${timeRest}`);
    }

    function doCountdown(selector) {
        switch (selector) {
            case "#work1":
                removeActiveClass("#rest");
                addActiveClass(selector);
                startCountdown(timeWork, doCountdown, "#break1");
                break;
            case "#break1":
                removeActiveClass("#work1");
                addActiveClass(selector);
                startCountdown(timeBreak, doCountdown, "#work2");
                break;
            case "#work2":
                removeActiveClass("#break1");
                addActiveClass(selector);
                startCountdown(timeWork, doCountdown, "#break2");
                break;
            case "#break2":
                removeActiveClass("#work2");
                addActiveClass(selector);
                startCountdown(timeBreak, doCountdown, "#work3");
                break;
            case "#work3":
                removeActiveClass("#break2");
                addActiveClass(selector);
                startCountdown(timeWork, doCountdown, "#break3");
                break;
            case "#break3":
                removeActiveClass("#work3");
                addActiveClass(selector);
                startCountdown(timeBreak, doCountdown, "#work4");
                break;
            case "#work4":
                removeActiveClass("#break3");
                addActiveClass(selector);
                startCountdown(timeWork, doCountdown, "#break4");
                break;
            case "#break4":
                removeActiveClass("#work4");
                addActiveClass(selector);
                startCountdown(timeBreak, doCountdown, "#rest");
                break;
            case "#rest":
                removeActiveClass("#break4");
                addActiveClass(selector);
                startCountdown(timeRest, doCountdown, "#work1");
                break;
        }
    }

    function addActiveClass(selector) {
        document.querySelector(selector).classList.add("pomodoroTextActive");
    }

    function removeActiveClass(selector) {
        document.querySelector(selector).classList.remove("pomodoroTextActive");
    }

    function startCountdown(time, callback, selector) {
        // time is in seconds
        endDate = Date.now() + time * 1000;
        console.log(`endDate is ${new Date(endDate).toLocaleTimeString("en-SG", {timeZone: 'Asia/Singapore'})}`);
        /*
        USE SECONDS FOR TESTING
        Calculate the date that the timer is supposed to end
        rAF and check if Date.now() > that time, and display "end" if true
        Else display time - Date.now()
        */
        var rAFCallbackDate = function() {
            let fps = 5;
            // Does the actual logic
            setTimeout(function() {
                console.log("rAFCallbackDate was called");
                // Count in milliseconds is now - start time + previous count saved
                rafDateCount = endDate - Date.now();
                
                let s = Math.floor((rafDateCount / 1000) % 60);
                let m = Math.floor((rafDateCount / 60000) % 60);

                timerText = m + ":" + s;
                document.querySelector("#pomodoroTimerText").innerHTML = timerText;
                // Recursive call to rAF, arbitrary number 200ms as the floor for when timer will be considered to have finished
                if (rafDateCount > 1000/fps) {
                    rAFID = requestAnimationFrame(rAFCallbackDate);
                }
                else {
                    cancelAnimationFrame(rAFID);
                    timerFinished = true;
                    timerText = "Time is up!";
                    document.querySelector("#pomodoroTimerText").innerHTML = timerText;
                    // start next countdown here
                    callback(selector);
                }
            }, 1000/fps);
        }

        // Call rAF to start the cycle
        rAFID = requestAnimationFrame(rAFCallbackDate);
    }
}(window));