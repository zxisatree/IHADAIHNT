; // Testing all the various ways to write a timer
(function(global) {
    // Add the module prefix to the console logs
    const console = consoleAddNameAsPrefix('playingWithTimer', '#abb2b9');

    // Toggle to decide whether to start or stop timer
    let startState = false;
    // ID to cancelInterval
    let intervalRef = null;
    // Tells timerRaf whether to continue animating or to stop
    let timerRafSwitch = false;
    // ID to cancelAnimationFrame
    let rAFID;
    // Start time for timer
    let rafDateStartTime;
    // Saves the time when paused
    let previousRafDateCount = 0;
    // Count for rAFDate function
    let rafDateCount = 0;

    // Add onclick events to all the buttons
    document.querySelector("#toggleInterval").addEventListener("click", toggleTimerInterval);
    document.querySelector("#toggleIntervalDate").addEventListener("click", toggleTimerIntervalDate);
    document.querySelector("#hang").addEventListener("click", hangBrowser);
    document.querySelector("#hangWorker").addEventListener("click", hangWorker);
    document.querySelector("#startRaf").addEventListener("click", startTimerRaf);
    document.querySelector("#stopRaf").addEventListener("click", stopTimerRaf);
    document.querySelector("#pauseRaf").addEventListener("click", pauseTimerRaf);
    document.querySelector("#startRafDate").addEventListener("click", startTimerRafDate);
    document.querySelector("#stopRafDate").addEventListener("click", stopTimerRafDate);
    document.querySelector("#pauseRafDate").addEventListener("click", pauseTimerRafDate);
    document.querySelector("#startWorker").addEventListener("click", startTimerWorker);
    document.querySelector("#stopWorker").addEventListener("click", stopTimerWorker);

    // Generic toggle timer function
    function toggleTimer(startTimerFunction, stopTimerFunction) {
        if (startState === false) {
            console.log("startState is false, running function to start timer");
            startState = true;
            startTimerFunction();
        }
        else if (startState === true) {
            console.log("startState is true, running function to stop timer");
            startState = false;
            stopTimerFunction();
        }
    }

    // Toggle the timer that only uses setInterval to count time
    function toggleTimerInterval() {
        toggleTimer(startTimerInterval, stopTimerInterval);
    }

    // Toggle the timer that uses setInterval and Date.now() to count time
    function toggleTimerIntervalDate() {
        toggleTimer(startTimerIntervalDate, stopTimerInterval);
    }

    // Start the setInterval timer
    function startTimerInterval() {
        console.log("startTimerInterval() was run");
        let count = 0;

        intervalRef = setInterval(() => {
            // Count is in milliseconds
            count += 10;

            let ms = count % 1000;
            let s = Math.floor((count / 1000) % 60);
            let m = Math.floor((count / 60000) % 60);
            let h = Math.floor((count / 3600000) % 60);

            document.querySelector("#timerText").innerHTML = h + ":" + m + ":" + s + ":" + ms;
        }, 10);
        document.querySelector("#startStop").innerHTML = "Stop";
    }

    // Stop the setInterval timer
    function stopTimerInterval() {
        console.log("stopTimerInterval() was run");
        document.querySelector("#startStop").innerHTML = "Start";
        clearInterval(intervalRef);
    }

    // Start the timer that uses setInterval and Date.now() to count time
    function startTimerIntervalDate() {
        console.log("startTimerIntervalDate() was run");
        let startTime = Date.now();

        intervalRef = setInterval(() => {
            // Count is in milliseconds
            count = Date.now() - startTime;

            let ms = count % 1000;
            let s = Math.floor((count / 1000) % 60);
            let m = Math.floor((count / 60000) % 60);
            let h = Math.floor((count / 3600000) % 60);

            document.querySelector("#timerText").innerHTML = h + ":" + m + ":" + s + ":" + ms;
        }, 10);

        document.querySelector("#startStop").innerHTML = "Stop";
    }

    // Start the timer that uses rAF and Date.now() to count time
    function startTimerRafDate() {
        console.log("startTimerRafDate was run");
        rafDateStartTime = Date.now();
        timerRafDate();
    }
    
    // Pause the timer that uses rAF and Date.now() to count time
    function pauseTimerRafDate() {
        console.log("pauseTimerRafDate was run");
        cancelAnimationFrame(rAFID);
        // Save the current time
        previousRafDateCount = rafDateCount;
        console.log(`Current time in ms is: ${previousRafDateCount}`);
    }

    // Stop the timer that uses rAF and Date.now() to count time
    function stopTimerRafDate() {
        console.log("stopTimerRafDate was run");
        cancelAnimationFrame(rAFID);
        // Reset the current time
        previousRafDateCount = 0;
        rafDateCount = 0;
    }

    // Start the rAFDate timer
    function timerRafDate() {
        var rAFCallbackDate = function(callback) {
            console.log("rAFCallbackDate was called");
            // Count in milliseconds is now - start time + previous count saved
            rafDateCount = Date.now() - rafDateStartTime + previousRafDateCount;
            
            let ms = rafDateCount % 1000;
            let s = Math.floor((rafDateCount / 1000) % 60);
            let m = Math.floor((rafDateCount / 60000) % 60);
            let h = Math.floor((rafDateCount / 3600000) % 60);

            document.querySelector("#timerText").innerHTML = h + ":" + m + ":" + s + ":" + ms;
            // Recursive call to rAF
            rAFID = requestAnimationFrame(rAFCallbackDate);
        }

        // Call rAF to start the cycle
        rAFID = requestAnimationFrame(rAFCallbackDate);
    }

    // Start the rAF timer
    function timerRaf() {
        var rAFCallback = function(callback) {
            console.log("rAFCallback was called");
            // Count in milliseconds is the time elapsed since the document was loaded
            let count = callback;

            let ms = count % 1000;
            let s = Math.floor((count / 1000) % 60);
            let m = Math.floor((count / 60000) % 60);
            let h = Math.floor((count / 3600000) % 60);

            document.querySelector("#timerText").innerHTML = h + ":" + m + ":" + s + ":" + ms;

            // Attempted to design a pause button, but it failed as the timestamp passed to the callback function is based off the time when the document was loaded
            if (timerRafSwitch) {
                // Recursive call to rAF
                rAFID = requestAnimationFrame(rAFCallback);
            }
        }

        // Call rAF to start the cycle
        rAFID = requestAnimationFrame(rAFCallback);
    }

    // Start the timer that uses rAF to count time
    function startTimerRaf() {
        console.log("startTimerRaf was run");
        timerRafSwitch = true;
        timerRaf();
    }
    
    // Pause the timer that uses rAF to count time - doesn't work as the timestamp passed to the callback function is based off the time when the document was loaded
    function pauseTimerRaf() {
        console.log("pauseTimerRaf was run");
        timerRafSwitch = false;
    }

    // Stop the timer that uses rAF to count time
    function stopTimerRaf() {
        console.log("stopTimerRaf was run");
        cancelAnimationFrame(rAFID);
    }

    // Hangs the browser for testing if the timer would continue or not
    function hangBrowser() {
        let val = "";

        for (let i = 0; i < 30000; i++) {
            for (let j = 0; j < 30000; j++) {
                val = "Loop returned: " + i + j;
            }
        }
    }

    // Initialise the worker scripts
    var workerInterval = new Worker('workerInterval.js');
    var workerHang = new Worker('workerHang.js');

    // Hang the worker
    function hangWorker() {
        workerHang.postMessage("hang");
    }

    // Initialise the timerID for setInterval so that the worker has permanent access to it
    var timerID;

    // Change the timer text whenever a message is received from the worker
    workerInterval.onmessage = function(event) {
        document.querySelector('#timerText').innerHTML = event.data;
    };
    
    // Tell the worker to start the timer
    function startTimerWorker() {
        workerInterval.postMessage('start');
    }

    // Tell the worker to start the timer
    function stopTimerWorker() {
        workerInterval.postMessage('stop');
    }
}(window));