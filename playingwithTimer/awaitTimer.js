(function (global) {
    document.querySelector("#await").addEventListener("click", startAwaitTimer);

    // Start the await timer
    async function startAwaitTimer() {
        // W B W B W B W B R
        console.log("Await timer started");
        await startAwait(10);
        console.log("Await complete");
    }

    function startAwait(time) {
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
            setTimeout(function() {
                console.log("rAFCallbackDate was called");
                // Count in milliseconds is now - start time + previous count saved
                rafDateCount = endDate - Date.now();
                
                let s = Math.floor((rafDateCount / 1000) % 60);
                let m = Math.floor((rafDateCount / 60000) % 60);

                timerText = m + ":" + s
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
                }
            }, 1000/fps);
        }

        // Call rAF to start the cycle
        rAFID = requestAnimationFrame(rAFCallbackDate);
        return promise;
    }
}(window));