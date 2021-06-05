---
layout: default
comments: true
published: true
title: Software-based PWM with PIGPIO
---

This project builds a simple circuit that uses Software-based Pulse-Width Modulation (PWM) with PIGPIO.

In the previous article ([Pulse-Width Modulation (PWM) - Theory]({% link _posts/2021-05-29-PWM.md %})), we reviewed why PWM works. Let's now take a look at how we can get PWM working on Raspberry Pi using JavaScript. The project described here today uses Software-based PWM via the [PIGPIO](https://www.npmjs.com/package/pigpio) library.

# How does the project work?

The project is the same we discussed in the [Hardware-based PWM with RPIO]({% link _posts/2021-05-30-HardwarePWM-RPIO.md %}) article, so if you have not read that one, maybe it's a good idea to do so now.

![Oscilloscope](/assets/blog/2021-06-04/Oscilloscope.png)

One notable difference with the previous project is the PWM frequency (duty cycle). As shown on the oscilloscope above, the frequency is 8.0 kHz or a period of 125 microseconds. This frequency does not indicate how often the data changes, which in the code below is once per second.

# Software-based PWM (PIGPIO)

> Software-based PWM uses the CPU to continuously put either a HIGH or LOW value on the output pin, depending on the state in the duty cycle, but we can use any GPIO pin!

The code below uses Software-based PWM via the [PIGPIO](https://www.npmjs.com/package/pigpio) npm package.

Although this is a simple project, I have decided to write the code using two classes: **LedPIGPIO** handles the hardware, and **LedLogic** handles the logic. As discussed here ([Hardware-based PWM with RPIO]({% link _posts/2021-05-30-HardwarePWM-RPIO.md %})), this organizing allowed me to separate the hardware, and swap the old RPIO for the new PIGPIO library. The logic is quite simple. An infinite loop varies the duty cycle by 20%, either increasing or decreasing the percentage. Each iteration of the loop occurs every second.

[PIGPIO](https://www.npmjs.com/package/pigpio) has really good documentation [Gpio class](https://github.com/fivdi/pigpio/blob/master/doc/gpio.md) and [Configuration](https://github.com/fivdi/pigpio/blob/master/doc/configuration.md). I wrote the code for this project extracting a lot of information from those pages, but let me explain the important parts and the numbers I used as we go thorugh the code.

I will only explain first 30 lines because the rest of the code is identical to the one discussed on the [Hardware-based PWM with RPIO]({% link _posts/2021-05-30-HardwarePWM-RPIO.md %}) article.

<script src="https://gist.github.com/eltoroit/45cd399857e5e5398f8a391d1d562d19.js"></script>

- `1` Import the [PIGPIO](https://www.npmjs.com/package/pigpio) library.
- `2` Define a constant Gpio to reference the Gpio class in the Pigpio library.
- `3` Import the pins library. See the article [GPIO Pins]({% link _posts/2021-04-18-GPIO-pins.md %}) to understand why this is required.
- `5-29` This is the class that we swapped from the previous project to use Pigpio.
- `6` Hold a reference to the LED.
- `7-9` Some special numbers that we are going to discuss in just a little bit.
- `10` Define the pin on the Raspberry Pi that is attached to the LED
- `12-19` The constructor which initializes the Software-based PWM using Pigpio.
- `13` Initializes the Pigpio C library. We need to initialize this because we want to gracefully close the application and turn off the LED.
- `14` Configures the clock for PWM and a sample rate of 5 μs. The sample rate can only be set to one of these values: 1, 2, 4, 5, 8, or 10. [Read more here](https://github.com/fivdi/pigpio/blob/master/doc/configuration.md#configureclockmicroseconds-peripheral)
- `15` We are initializing the GPIO clss for the the pin where we have the LED connected to be an output pin.
- `16` Selects the duty cycle range to be used for the GPIO. Values go from 25 to 40,000. [Read more here](https://github.com/fivdi/pigpio/blob/master/doc/gpio.md#pwmrangerange)
- `17` Sets the frequency in hertz to be used for the GPIO. The selectable frequencies depend upon the sample rate (in our case it's 5 μs) using the table found [here](https://github.com/fivdi/pigpio/blob/master/doc/gpio.md#pwmfrequencyfrequency)
- `18` Initialize the LED by turning it off.
- `22`

This formula helps calculate the PWM frequency: `CLOCK / (range \* ClockDivider)` taking into consideration these values:

- CLOCK: The Raspberry Pi 4B has a PWM input clock that runs at 54 MHz.
- ClockDivider: Must be a power of two, for example, 2, 4, 8, 16, 32, 64, 128, and so on up to a maximum of 1024.

With a range of 1000 and a ClockDivider equals 8, we get a PWM frequency of 6.75 kHz.

Let's take a look at other parts of this code.

- `4-25` This class isolates the hardware implementation using RPIO from the part that controls the duty cycle percentage.
- `27-75` We are controlling the duty cycle percentage.
- `77-78` This is just the invocation of the main code.

- `5` The duty cycle is divided into 1000 pieces, so when we increase 20%, we are increasing by 200 points.
- `6` ClockDivider helps define the frequency or period of the duty cycle.
- `7` We are using GPIO18, but we need the physical number of the pin. We use [GPIO Pins]({% link _posts/2021-04-18-GPIO-pins.md %}) to - calculate the value.
- `11` Opens the GPIO18 pin for PWM functionality.
- `12` Sets the clock divider for the duty cycle.
- `13` Sets the range of values. In our case, we are using values from 0 to 1000 (range passed as a parameter to the constructor)
- `16-19` Receives the percentage, a value greater than 0 and less than or equals 1, indicating the duty cycle percentage.
- `18` Writes the value when it changes. In our case, this happens once per second, and it's not related to the duty cycle frequency.
- `22` Close the application by resetting the pin and turning the LED off at the end of the application.

- `36` We are going to update the percentages once per second (1000 ms).
- `39` Instantiate the class that handles the hardware.
- `41-51` Detect and handle the events when the Node.js process terminates
- `54-63` Update values when we reach the extremes
- `65-68` If the data is within the correct range, call the hardware (`67`) to update the LED.
- `71-73` The infinite loop
