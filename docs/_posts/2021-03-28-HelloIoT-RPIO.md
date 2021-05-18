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

For today's blog, we are going to use the [RPIO](https://www.npmjs.com/package/rpio) library. In a future blog post we will build the same project using [PIGPIO](https://www.npmjs.com/package/pigpio) so that we can compare the differences.

Please follow these steps to get the RPIO library ready:

- Configure the RPIO npm package by using this command `npm install rpio`
- Let’s add the node_modules folder to .gitignore `echo "node_modules" > .gitignore`
- Create a file named `S01_LedButton_RPIO.js` with this code:

<script src="https://gist.github.com/eltoroit/f8fb7d4fe49eb1f90f44e82ad950b934.js"></script>

Open the terminal panel, and type `node S01_LedButton_RPIO.js`. When the button gets pressed, the LED will change state from OFF to ON. If you press the button again, the state will change back to OFF.

If you prefer, you can run the debugger like this `node inspect S01_LedButton_RPIO.js` and use VS Code to debug the code.

# So what does this code do?

- `1` Imports the RPIO library
- `2` Imports the [perf_hooks.performance standard library](https://nodejs.org/api/perf_hooks.html#perf_hooks_perf_hooks_performance) that implements a very good timer with a resolution in milliseconds, similar to the [Window.performance](https://developer.mozilla.org/en-US/docs/Web/API/Window/performance) found in browsers.

  As a software developer, if I need the [**event loop in JavaScript**](http://eteventloop.herokuapp.com/) to wait for a little bit I may use 1/2 a second because that is not a lot of time. Well, in electronics that is an eternity!

- `4 - 5` Defines shortcuts for the HIGH/LOW values using the definitions in the RPIO library.
- `7 - 8` Define the pins used for the LED and for the button.

  View this article [**GPIO Pins**]({% link _posts/2021-04-18-GPIO-pins.md %}) to understand why we are usign pins 11 and 12, rather than GPIO17 and GPIO18.

- `12 - 14` Initializes the buttons to indicate the LED is output and the button is input. We also tell the button to use a pull-up resistor (rather than a pull-down - resistor).

  View this article [**Pull-Up, Pull-Down Resistors**]({% link _posts/2021-05-02-PullUpDown.md %}) if you want to understand the difference between a pull-up and a pull-down resistor.

- `16 - 22` Flip the output from a LOW to a HIGH or a HIGH to a LOW. This is how we are going to turn ON/OFF the LED.
- `24 - 40` The main application... Read below for an explanation of how this function works.
- `41` Invokes the main application

The main function (`24 - 40`)

- `25` Defines the original state for the LED (off).
- `26` Initializes the timer with the current time.
- `28` Defines the length of time (500ms) that the button must be pressed before reacting.

  View this article [**Debouncing A Button**]({% link _posts/2021-03-28-HelloIoT-RPIO.md %}) to understand why we have to do this.

- `30 - 39` We are building a handler for the poll event on the button pin. This basically asks RPIO to let us know when the button is released.
- `31` Get the value of the timer when the button is released.
- `32` Checks to see if we should be acting on the information received
- `35` Flip the state of the LED (in memory)
- `36` Assign the value to the LED, changing the state of the LED (turns it ON or OFF).
- `38` Store the current time.
- `39` RPIO allows us to specify when we want to be notified about the event. We want to be notified when the button gets released rather than when the button gets pressed.

If you have read through the code description, you should have several questions pending because I told you that some of those pieces would be explained later. Unfortunately we run out of time for today, so I will be writing other articles in the near future to discuss these topics.
