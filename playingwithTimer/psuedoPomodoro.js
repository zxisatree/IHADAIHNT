// Set default values for each period
let timeWork = 25,
	timeBreak = 5,
	timeRest = 20;
let timerCycle = ["work1", "break1", "work2", "break2", "work3", "break3", "work4", "break4", "rest"];
let timerCycleIndex = 0;
let oldCssSelector, newCssSelector;

// Main loop, calls the timer functions
function main() {
	for (var i = 0; i < 4; i++) {
		timerWorkBreakAwait();
	}
	timerRestAwait();
	// Loop
	main();
}

// Work and break can be put together in one function, because they bot hrun exactly the same 4 times each loop
async function timerWorkBreakAwait() {
	// Wait for work timer to complete
	await timerWork();
	// Change CSS to show the new active timer
	changeCss();
	// Wait for break timer to complete
	await timerBreak();
	// Change CSS to show the new active timer
	changeCss();
}

function timerWork() {
	return timer(timeWork);
}

function timerBreak() {
	return timer(timeBreak);
}

async function timerRestAwait() {
	await timerRest();
	changeCss();
}

function timerRest() {
	return timer(timeRest);
}

// Creates a promise that resovles when the timer is complete
function timer() {
    return new Promise(function executor(resolve, reject) {
		startTimerAndUpdateTimerText();
		if (timerFinished) {
			resolve();
		}
	});
}

// Move the active CSS class to the next string in the array
function changeCss() {
	// Move both pointers one to the right in the array
	oldCssSelector = newCssSelector;
	newCssSelector = timerCycle[timerCycleIndex];
	// Remove the "active" class from the old timer and add it to the new timer
	document.querySelector(`#${oldCssSelector}`).classList.remove("timerTextActive");
	document.querySelector(`#${newCssSelector}`).classList.add("timerTextActive");
	// Increment the index for the next timer
	if (timerCycleIndex < timerCycle.length) {
		timerCycleIndex++;
	}
	// Reset the index if it reached the last string in the array
	else timerCycleIndex = 0;
}