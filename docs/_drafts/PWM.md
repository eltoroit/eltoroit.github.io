---
layout: default
published: false
title: Pulse-Width Modulation (PWM)
---

PWM converts a digital circuit into an analog one!

We have seen in the [**Hello IoT (RPIO)**]({% link _posts/2021-03-28-HelloIoT-RPIO.md %}) and [**Hello IoT (PIGPIO)**]({% link _posts/2021-05-16-HelloIoT-PIGPIO.md %}) articles how the Raspberry Pi can output a HIGH voltage on GPIO18 and the LED turns ON, or remove that voltage and have the LED turn OFF. But can we actually dim the LED? Great question, I am glad you asked. Yes and no!

If we build this circuit:

https://cdn-shop.adafruit.com/datasheets/WP7113SRD-D.pdf