---
layout: default
title: Hello IoT (RPIO)
---

We are now ready to start with a few simple circuits and finish setting up the Raspberry Pi.

We are all familiar with the “Hello World” samples in tutorials, so let’s keep that tradition and build the Hello IoT circuit. This is the schematic diagram:

![Schematic](/assets/blog/2021-03-28/Schematic.png)

Rather than describing the functionality of the project we are building, let’s watch it in action because a picture is worth a thousand words, and an animated GIF is worth a thousand pictures.

<p style="text-align:center">
    <video src="/assets/blog/2021-03-28/ProjectReview.mov" autoplay controls loop></video>
</p>

Just to be clear this is how the project works:

- When you press the button, the switch S1 is closed and the voltage goes down to 0 Volts.
- When the button is released, the swtich S1 is opened and the voltage goes back to VCC (3.3 volts)
- The NodeJS code detects the switch has been released, and it will change the state of the LED (LED1) from OFF to ON or viceversa.

Notice this is different than having the LED light only while the button is pressed! _(this will be important later on)_

# The NodeJS code

These are the steps to get the circuit working:

1. Create a folder in your Raspberry Pi named “Samples” by following these steps

   - `cd ~/work`
   - `mkdir Samples`

2. On your main computer, open VS Code and connect it to your Raspberry Pi.
3. Open the Samples folder created in the previous step.
4. Open the terminal window

   you should see `pi@raspberrypi:~/work/Samples` indication that you are connected to a folder named Samples in the Raspberry Pi.

5. Initialize the folder with these commands
   - `npm init -y`
   - `git init`

# Using The RPIO Library

For today's blog, we are going to use the <a href="https://www.npmjs.com/package/rpio" target="_blank">RPIO</a> library. In a future blog post we will build the same project using <a href="https://www.npmjs.com/package/pigpio" target="_blank">PIGPIO</a> so that we can compare the differences.

Please follow these steps to get the RPIO library ready:

- Configure the RPIO npm package by using this command `npm install rpio`
- Let’s add the node_modules folder to .gitignore `echo "node_modules" > .gitignore`
- Create a file named S01_LedButton_RPIO.js with this code:

```js
const rpio = require("rpio");
const { performance } = require("perf_hooks");

const LOW = rpio.LOW;
const HIGH = rpio.HIGH;

const pinLED = 12;
const pinButton = 11;

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

  rpio.poll(
    pinButton,
    (pin) => {
      let now = performance.now();
      if (now - before < captureTime) {
        // Detected the button down multiple times, probably because of noise in the button
      } else {
        stateLED = flipState(stateLED);
        rpio.write(pinLED, stateLED);
      }
      before = now;
    },
    rpio.POLL_LOW
  );
}
tableLamp();
```

Open the terminal panel, and type `node S01_LedButton_RPIO.js`. When the button gets pressed, the LED will change state from OFF to ON. If you press the button again, the state will change back to OFF.

If you prefer, you can run the debugger like this `node inspect S01_LedButton_RPIO.js` and use VS Code to debug the code.

So what does this code do?

Line #1: Imports the RPIO library
Line #2: Imports a standard library that implements a very good timer with a resolution in micro-seconds. More on this later.
Lines #4 and #5: Defines shortcuts for the HIGH/LOW values using the definitions in the library.
Lines #7 and #8: Define the pins used for the LED and for the button. More on this later.
Lines #12 - 14: Initializes the buttons to indicate the LED is output and the button is input. We also tell the button to use a pull-up resistor (rather than a pull-down resistor). More on this later.
Lines #16 - #22: Flip the output from a LOW to a HIGH or a HIGH to a LOW. This is how we are going to turn ON/OFF the LED.
Lines #24 - #40: The main application… We will take a look at this in just a few seconds.
Line #41: Invokes the main application

Line #25: Defines the original state for the LED (off).
Line #26: Initializes the timer with the current time.
Line #28: Defines the length of time (500ms) that the button must be pressed before reacting.
Lines #30 - #39: We are building a handler for the poll event on the button pin. This basically asks RPIO to let us know when the button is pressed.
Lines #31 - #34: We are controlling the timer.
Line #35: Flip the state of the LED
Line #36: Assign the value to the LED, changing the state of the LED.
Line #38: Store the current time. More on this later.
Line #39: RPIO allows us to specify when we want to be notified about the event. We want to be notified when the button gets pressed rather than when the button gets released.

If you have read through the code description, you should have several questions pending because I told you that some of those pieces would be explained later. Well, now it’s the time…
