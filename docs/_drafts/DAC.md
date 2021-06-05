---
layout: default
comments: true
published: true
title: Analog To Digital Conversion (I<sup>2</sup>C)
---

How can the Raspberry Pi, being all-digital, read an analog signal? Use an _Analog-to-Digital Converter (ADC)_. This article discusses I<sup>2</sup>C ADCs.

In the last couple of articles [Pulse-Width Modulation (PWM) - Theory]({% link _posts/2021-05-29-PWM.md %}) and [Hardware-based PWM with RPIO]({% link _posts/2021-05-30-HardwarePWM-RPIO.md %}) we simulated an analog signal required to dim an LED using a digital output from the Raspberry Pi. But we were not converting a digital signal to an analog one. We were only producing a high or low value (on/off, 1/0, true/false) for a predefined amount of time, and the analog circuit believed, by averaging the values, that it was an analog signal. Today we are going to convert an analog signal to a digital one!

Before going into how this conversion takes place, we need to understand few things.

# Digital Vs. Analog Signals

An _analog signal_ is a continuous signal that represents some physical measurement. Most signals in life (speed, length, weight, brightness, sound, voltage, current, power, resistance, and many more) are analog. Let's think about the speed of a car; a fast car can go from 0 to 60 in few seconds, but it does not matter how fast the car is; it never goes instantaneously from 0 to 60.

A _digital signal_ represents data as a sequence of different values at any point in time. It can only take one of a fixed number of values depending on the resolution. For example if we have a signal with an 8 bit resolution, then we could obtain 2<sup>8</sup> (256) values ranging from 0x00 (00000000) to 0xFF (11111111). Those values can change instantaneously!

<p style="text-align:center;">
    <video src="/assets/blog/2021-06-05/Analog-Digital.mov" style="max-width: 100%;" autoplay controls loop></video>
</p>

# Analog-to-Digital Conversion

Computers, like the Raspberry Pi, work with digital signals. If you want to build a system that monitors an analog voltage, you need to use an _Analog-to-Digital Converter_. The ADC converts an analog signal (voltage or current) into a digital number representing the magnitude of the measured value. By the way, a _digital-to-analog converter (DAC)_ performs the reverse function, but we are not discussing those in this article.

There are several factors you need to consider when selecting the correct ADC for your projects, including:

- Interfaces:
  - ADC chips use I<sup>2</sup>C (Inter-Integrated-Circuit) or SPI (Serial Peripheral Interface) bus interfaces.
  - In this article, we use the board provided in the Frenove kit. It's called ADS7830 DAC, and it uses an I<sup>2</sup>C interface.
  - SPI is faster than I<sup>2</sup>C, but it limits the number of devices the bus can accept. For the Raspberry Pi, the limit is 2 devices.
  - I<sup>2</sup>C is slower than SPI, but you can connect many more devices to the I<sup>2</sup>C host machine as long as their addresses don't conflict.
- Number of channels:
  - The number of voltage inputs you can connect to the boards.
  - The ADS7830 DAC we are using today has 8 channels.
- Sensitivity
  - Measured by its bit rate.
  - A higher bit rate means that the chip has a higher resolution for measuring the input voltage, but this comes at the expense of the speed of the readings.
  - The ADS7830 DAC has an 8-bit resolution, which means it can have 2<sup>8</sup> (256) values from 0x00 to 0xFF.
- Sample Rate
  - The speed at which the ADC chip can sample and report the input voltage.
  - The ADS7830 DAC has a sampling rate of 70kHz.

This information comes from this [datasheet](https://www.ti.com/lit/ds/symlink/ads7830.pdf).

# Project

For the first phase of the project, we are going to use the project from the book.

![ADS7830 Circuit](/assets/blog/2021-06-05/ADC7830.png)

First, we have to configure the Raspberry Pi to enable the I<sup>2</sup>C interface.

- Type `sudo raspi config` on the terminal window.
- Select `Interfacing Options`.
- Select `I2C`.
- Answer `Yes` when asked to enable I<sup>2</sup>C.
- Close the configuration tool
- Execute this command: `i2cdetect -y 1`

You should see a table like this:

![I2C Table](/assets/blog/2021-06-05/I2C_Table.png)

That is great, I<sup>2</sup>C is working, and we know the address that our ADC is going to be using (0x4b).

# Project

https://learn.sparkfun.com/tutorials/raspberry-pi-spi-and-i2c-tutorial/all
https://aticleworld.com/difference-between-i2c-and-spi/
https://www.sparkfun.com/news/980
https://www.guru99.com/analog-vs-digital.html
