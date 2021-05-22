---
layout: default
published: false
title: Pulse-Width Modulation (PWM)
---

PWM converts a digital circuit into an analog one!

We have seen in the [Hello IoT (RPIO)]({% link _posts/2021-03-28-HelloIoT-RPIO.md %}) and [Hello IoT (PIGPIO)]({% link _posts/2021-05-16-HelloIoT-PIGPIO.md %}) articles how Raspberry Pi can put 3.3 volts (logic HIGH) on GPIO18 and the LED turns ON, or 0 volts (logic LOW) and the LED turns OFF. But can we dim the LED? Great question! I am glad you asked. Before I can answer that, we need to discuss few things.

# How to dim a LED?

Let's look at a simple [datasheet for a standard LED](https://marktechopto.com/pdf/products/datasheet/MT4118-HR-A.pdf); this may not be the same LED we are using, but all of them work very similar. Some of the values may be a bit different but the concepts, which is what I want to show you, work the same way. There are two specific charts that I want to highlight from that datasheet.

The first chart shows the forward current and voltage operation. What is interesting to see here, is that the voltage is around 2.2 volts (1.8 volts to 2.4 volts), basically it does not change much. But the current goes from 0mA to 50mA!

![Forward current vs. applied voltage](/assets/blog/2021-05-30/LED_Chart01.png)

We can see therefore that the current is probably more important than the voltage if we want to change the intensity of the LED. Actually, if we take a look at the second chart in the datasheet, we can see that the intensity is directly proportional to the current flowing trought the LED.

![Vf/If](/assets/blog/2021-05-30/LED_Chart01.png)

The second chart

If we build this circuit:

https://cdn-shop.adafruit.com/datasheets/WP7113SRD-D.pdf
