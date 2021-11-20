function sum(a,b) {
    return a+b;
}

function isPositive(number) {
    return number >= 0;
}

function randomNumber() {
    return Math.random;
}

document.addEventListener("click", function() {
    console.log("Clicked");
})

let sumArrow = (a,b) => a + b;
let isPositiveArrow = number => number >= 0;
let randomNumberArrow = () => Math.random;
document.addEventListener("click", () => console.log("Clicked"));