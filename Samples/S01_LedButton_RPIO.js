const rpio = require('rpio');
const { performance } = require('perf_hooks');

const LOW = rpio.LOW;
const HIGH = rpio.HIGH;

const pinLED = 12;      // GPIO18
const pinButton = 11;   // GPIO17

console.log("Program is starting...\n");

rpio.init();
rpio.open(pinLED, rpio.OUTPUT, LOW);
rpio.open(pinButton, rpio.INPUT, rpio.PULL_UP);

function flipState(input) {
    let output = HIGH;
    if (input === HIGH) {
        output = LOW;
    }
    return output;
}

function tableLamp() {
    let stateLED = LOW;
    let before = performance.now();
    // How long must the button be kept down? (milliseconds)
    const captureTime = 500;

    rpio.poll(pinButton, (pin) => {
        let now = performance.now();
        if (now - before < captureTime) {
            // Detected button down multiple times, maybe noisy button
        } else {
            stateLED = flipState(stateLED);
            rpio.write(pinLED, stateLED);
        }
        before = now;
    }, rpio.POLL_LOW)
}
tableLamp();
