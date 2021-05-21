---
layout: default
published: true
title: Hello IoT (PIGPIO)
---

This article is part 2 of another article I wrote a few weeks ago ([**Hello IoT (RPIO)**]({% link _posts/2021-03-28-HelloIoT-RPIO.md %})), where we are building the same circuit, but the code is written in NodeJS using the [PIGPIO](https://www.npmjs.com/package/pigpio) library. I highly recommend you read that article before you continue reading this one.

# PIGPIO

As indicated on the [PIGPIO page](https://www.npmjs.com/package/pigpio), this is a wrapper for the [pigpio C library](https://github.com/joan2937/pigpio) but built for NodeJS.

Before we can start using this library, we must ensure we have Pigpio C library installed, so please go ahead and type `pigpiod -v` in the terminal window. We should already have a version installed, but to be safe, let's bring it up to the newest version with these commands `sudo apt-get update` and then `sudo apt-get install pigpio`.

## Using The PIGPIO Library

Now that we have the latest Pigpio C library version, we need to install the PIGPIO npm package using this command `npm install pigpio`. After that, create a new file named `S01_LedButton_PIGPIO.js` and place it in the same folder you have the `S01_LedButton_RPIO.js` file. See ([**Hello IoT (RPIO)**]({% link _posts/2021-03-28-HelloIoT-RPIO.md %})) for instructions on how that file was created.

Paste this code int the new file:

<script src="https://gist.github.com/eltoroit/5a4ded85b11f87827c9fe94c4f232dc6.js"></script>

Once you have this file created, you can run it by typing this command: `sudo node S01_LedButton_PIGPIO.js`. Notice that we need to use `sudo` for PIGPIO, but that requirement does not exist for RPIO. The project works in the same way as we discussed in the (**[Hello IoT (RPIO)]({% link _posts/2021-03-28-HelloIoT-RPIO.md %})**) article. Also, note that you can use VS Code to debug your code if you run the code like this: `sudo node inspect S01_LedButton_PIGPIO.js`.

# So, what does this code do?

- `1` Imports the PIGPIO library
- `3-4` Defines the HIGH/LOW constants with the values expected for the library.
- `6-7` Define the pins used for the LED and the button.

  Notice that when we used these pins in RPIO, we used the pin’s position. For PIGPIO, we need to use the pin names. We are using GPIO17 and GPIO18, and we need to use those numbers here. For additional reference on the pins numbering, please visit the [**GPIO Pins**]({% link _posts/2021-04-18-GPIO-pins.md %}) article.

- `11` Defines the input pin.
- `12` Defines the output pin.

  Note that the button uses a Pull-Up Resistor. For more information, please visit [**Pull-Up, Pull-Down Resistors**]({% link _posts/2021-05-02-PullUpDown.md %}) article.

- `14-20` Flip the output from a LOW to a HIGH or a HIGH to a LOW. The LED Turns ON/OFF.
- `22-33` The main application…
- `34` Invokes the main application

- `23` Defines the original state for the LED (off).
- `25` Remember the noise on the button?

  Please visit the [**Debouncing A Button**]({% link _posts/2021-04-04-DebounceButton.md %}) article to understand why this is important.

  PIGPIO has a nice feature that handles this automatically. You need to indicate how long a button should be down to get an alert. The main difference is that 500ms is a massive number for PIGPIO, and we are using 10,000 µs (which corresponds to 10 ms).

- `27-32` We are building a handler for the alert event on the button pin. We ask PIGPIO to let us know when the user presses or releases the button.
- `28-31` We are only concern about the button release
- `29` Flip the state of the LED
- `30` Assign the value to the LED, changing the state of the LED.
