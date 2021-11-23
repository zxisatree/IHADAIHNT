// Continuously logs a timer's progress until the timer finishes

let fps = 5;
let timerInSeconds = 3;
let endTime = Date.now() + timerInSeconds * 1000;

function rAFPromise() {
    const promise = new Promise(requestAnimationFrame);
    promise.then(function callback(timestamp) {
        timeLeft = endTime - Date.now();
        console.log(`There is ${timeLeft} before ${endTime}. Now it is ${Date.now()}`);
        // Recursive call to rAF if there is still time left
        if (timeLeft > 0) {
            // rAFPromise will be called on the next frame
            rafId = requestAnimationFrame(rAFPromise);
        }
        // If not, timer has finished. Resolve the promise
        else {
            console.log("Resolving now");
            // Since it's in a .then function, 
            return "Resolved";
        }
    });
    return promise;
}

function rAFPromiseSlowed() {
    setTimeout(function () {
        const promise = new Promise(requestAnimationFrame);
        promise.then(function callback(timestamp) {
            timeLeft = endTime - Date.now();
            console.log(`There is ${timeLeft} before ${endTime}. Now it is ${Date.now()}`);
            if (timeLeft > 0) {
                // callback is rAFPromiseSlowed
                rafId = requestAnimationFrame(rAFPromiseSlowed);
            }
            else {
                console.log("Resolving now");
                return "Resolved";
            }
        });
        return promise;
    }, 1000 / fps);
}

console.log("Calling rAFPromise");
rAFPromiseSlowed();
console.log("rAFPromise called");