const Gpio = require('pigpio').Gpio;

const LOW = 0;
const HIGH = 1;

const pinLED = 18;
const pinButton = 17;

console.log("Program is starting...\n");

const led = new Gpio(pinLED, { mode: Gpio.OUTPUT });
const button = new Gpio(pinButton, { mode: Gpio.INPUT, pullUpDown: Gpio.PUD_UP, alert: true });

function flipState(input) {
    let output = HIGH;
    if (input === HIGH) {
        output = LOW;
    }
    return output;
}

function tableLamp() {
    let stateLED = LOW;
    // Level must be stable for 10 ms (10,000 µs) before an alert event is emitted.
    button.glitchFilter(10e3);

    button.on('alert', (level) => {
        if (level) {
            stateLED = flipState(stateLED);
            led.digitalWrite(stateLED);
        }
    });
}
tableLamp();
