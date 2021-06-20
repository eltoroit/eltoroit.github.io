---
layout: default
comments: true
published: true
title: Analog To Digital Conversion (I<sup>2</sup>C) with PIGPIO
---

The second part of the I<sup>2</sup>C series implements a ADC with I<sup>2</sup>C using PIGPIO library

> PIGPIO npm library does not implement I<sup>2</sup>C, but the same author [Brian Cooke (fivdi)](https://github.com/fivdi) has given us a nice package to work with I<sup>2</sup>C named [i2c-bus](https://www.npmjs.com/package/i2c-bus).

This article is a continuation of an article named "[Analog To Digital Conversion (I2C) with RPIO]({% link _posts/2021-06-06-ADC_RPIO.md %})" that I wrote a couple of weeks ago. Please make sure you read that to better understand this project. At least make sure you read these sections:

- Digital Vs. Analog Signals
- Analog-to-Digital Conversion
- Voltage Divider
- Configure Raspberry Pi
- ADS7830
  - Address
  - Channels

I am going to assume you have read it and only discuss the differences here.

# Project

We are going to build this simple circuit.

![First Phase](/assets/blog/2021-06-06/Project.png)

The potentiometer is going to work as a voltage divider. As we change the resistance value, the voltage detected on pin A0 of the ADS7830 ADC chip changes. The chip converts the voltages to values from 0 (representing 0 volts) to 255 (representing 3.3 volts), and the Raspberry Pi receives this value on the SDA (GPIO2) pin. Our code takes that value, displays it on the console and sends it to the class that controls the LED, which we discussed in this article [DMA-based PWM with PIGPIO]({% link _posts/2021-06-04-DMA_PWM-PIGPIO.md %}).

# Code

<script src="https://gist.github.com/eltoroit/0a3a2d34aa1a36deb53e681c214cbbd3.js"></script>

- `1` Import the [i2c-bus](https://www.npmjs.com/package/i2c-bus) npm library
- `2` Import the PIGPIO library.
- `3` Define a constant Gpio to reference the Gpio class in the Pigpio library.
- `4` Import the pins library. See the article [GPIO Pins]({% link _posts/2021-04-18-GPIO-pins.md %}) to understand why this is required.
- `6-33` This is the class that we created to use the ADC chip. Make sure you have read [Analog To Digital Conversion (I2C) with RPIO]({% link _posts/2021-06-06-ADC_RPIO.md %}) to understand how I got to these numbers.
- `7` We are holding an instance of the I<sup>2</sup>C so that we can call different functions.
- `8` The ADDRESS where we can find the I<sup>2</sup>C chip. See [Analog To Digital Conversion (I2C) with RPIO]({% link _posts/2021-06-06-ADC_RPIO.md %}) to understand how we got to this value
- `9` The CHANNELS is an array of values, one for each channel. See [Analog To Digital Conversion (I2C) with RPIO]({% link _posts/2021-06-06-ADC_RPIO.md %}) to understand how we got to these values
- `11-15` Contructor to initialize the I<sup>2</sup>C via a promise (asynchronously)
- `12` Uses [`openPromisified`](https://www.npmjs.com/package/i2c-bus#openpromisifiedbusnumber--options) to open the bus asynchronously.
  - The first parameter _busNumber_ is the number of the I<sup>2</sup>C bus/adapter to open. You can provide these values: 0 for /dev/i2c-0, 1 for /dev/i2c-1, ...
  - The `/dev/i2c-0` is not available on the Raspberry Pi 3, and I assume that holds for later versions of the Raspberry Pi. `/dev/i2c-0` is used by the GPU firmware side to talk to a GPIO expander, as well as HAT EEPROMs, the camera, and display. Accessing the I<sup>2</sup>C peripheral from ARM and GPU causes issues. Read more about this [here](https://www.raspberrypi.org/forums/viewtopic.php?p=1079046&sid=1a2909b1131de22430483e2b3d477d2f#p1079046)
- `17-28` This function reads the values from the chip.
- `18` Let's initialize the value to a -1. If the I<sup>2</sup>C bus is not ready, the function returns this value.
- `19-26` Skip reading the value if the I<sup>2</sup>C bus is not ready. Remember, opening the bus connection is asynchronous.
- `20` [Node.js documentation](https://nodejs.org/api/buffer.html#buffer_static_method_buffer_from_array) explains that this function allocates a new Buffer using an **array of bytes** up to 255 characters long. The value we are putting here is the command byte we in the [Analog To Digital Conversion (I2C) with RPIO]({% link _posts/2021-06-06-ADC_RPIO.md %}) article. Note that this expects an array of bytes! That's why we have to put the value inside square brackets.
- `21` [Node.js documentation](https://nodejs.org/api/buffer.html#buffer_static_method_buffer_alloc_size_fill_encoding) explains that this function allocates a new Buffer of size (defined by the parameter) bytes. If fill is undefined, which in our case it is, Node.js fills the buffer with zeros. But this does not matter because we are using that array to get the digital conversion, overriding the value.
- `23` We are writing **Asynchronously** to the I<sup>2</sup>C bus the buffer that contains the value of 0x84, which is the command byte to request the ADS7830 to convert the analog value on channel 0.
- `24` We are reading from the I<sup>2</sup>C bus into the one-byte buffer.
  - The output from the read gets stored in a variable named `data` containing 2 properties: `bytesRead` indicates how many bytes to expect, and `buffer` holds a buffer with the data.
- `25` We convert the data structure returned into a number field using the [readUIntBE](https://nodejs.org/api/buffer.html#buffer_buf_readuintbe_offset_bytelength) which "Reads `bytesRead` number of bytes from `buffer` at the specified offset (0 in our case) and interprets the result as an unsigned big-endian integer supporting up to 48 bits of accuracy."
- `27` We return the value read, or -1 if the I<sup>2</sup>C bus is not ready
- `30-32` Shutting down the application calls this function.
- `31` Close the I<sup>2</sup>C bus
- `35-61` This class is the same we had discussed in the [DMA-based PWM with PIGPIO]({% link _posts/2021-06-04-DMA_PWM-PIGPIO.md %}) article. The only difference is on lines `57-59` where we only want to close PIGPIO if this is the last usage.
- `63-96` This is the main class for our project. It's responsible for reading the value from the ADS7830 ADC chip and providing that value to the LED so that it can be dimmed. This code is the same as we used in the [Analog To Digital Conversion (I2C) with RPIO]({% link _posts/2021-06-06-ADC_RPIO.md %}) article.
