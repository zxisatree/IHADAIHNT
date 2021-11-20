// Want to await the timer to finish from a main function, then continue

let count = 0;
let fps = 5;
var time = 3;

function rAFPromise() {
    endDate = Date.now() + time * 1000;
    
    setTimeout(function () {
        const promise = new Promise(requestAnimationFrame);
        promise.then(function callback(timestamp) {
            console.log("Callback run");
            requestAnimationFrame(rAF);
        });
        return promise;
    }, 1000 / fps);
}

function rAF() {
    rAFPromise();
    // console.log(++count);
}

rAF();