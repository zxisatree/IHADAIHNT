self.onmessage = function(event) {
    if (event.data === 'start') {
        let count = 0;

        self.timerID = setInterval(_ => {
            count += 10;

            let ms = count % 1000;
            let s = Math.floor((count / 1000)) % 60;
            let m = Math.floor((count / 60000)) % 60;

            let time = m + ":" + s + ":" + ms;

            self.postMessage(time);
        }, 10);
    }
    else if (event.data === 'stop') {
        console.log("Stopping timer");
        clearInterval(self.timerID);
    }
};