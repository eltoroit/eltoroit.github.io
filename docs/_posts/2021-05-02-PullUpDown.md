---
layout: default
title: Pull-Up, Pull-Down Resistors
---

When working with electronic logic circuits, pull-up/pull-down resistors are used to ensure a known state for a signal.

Digital electronics have two different values:

- True/False
- High/Low
- On/Off
- 0/1
- VCC/Ground voltages

But in reality, we are working with analog voltages ranging anywhere from 0 volts to VCC volts. In Raspberry Pi circuits VCC is usually either 3.3 volts or 5 volts. If you remember the video I showed you on the [**Debouncing A Button**]({% link _posts/2021-04-04-DebounceButton.md %}) article, the voltages can definetly have any value.

By the way, there is not even a standard value that says this is a high or this is a low. Depending on the technology you are using (TTL, CMOS, GTL, etc) the ranges are different as illustrated on this image:

![Logic Voltages](/assets/blog/2021-05-02/LogicVoltages.png)

# Pull-Up Resistor

How is that important? Well, let’s take a look at this circuit:

![Without Pull-Up resistor](/assets/blog/2021-05-02/PullUpWithout.png)

If we close the switch, then the input will clearly be 0 volts. But what would be the voltage if the switch is opened? We can not assume that it will be VCC volts! We actually need to build the circuit differently using a pull-up resistor. This is shown in this next image:

![With Pull-Up resistor](/assets/blog/2021-05-02/PullUpWith.png)

In this circuit, when the switch is open, the voltage will be VCC volts. But what will be the voltage if the switch is closed? That is actually a great question. I'm glad you asked! The input is connected directly to ground, therefore the voltage will be 0. All the VCC voltage is dropped across the 10 KΩ shown.

# Pull-Down Resistor

We also have a similar but reverse operation in this circuit:

![Without Pull-Down resistor](/assets/blog/2021-05-02/PullDownWithout.png)

And it gets solved with a pull-down resistor as shown in this circuit:

![With Pull-Down resistor](/assets/blog/2021-05-02/PullDownWith.png)

In this circuit, when the switch is open, the voltage will be 0 volts because it's connected to ground. But what will be the voltage if the switch is closed? The input is connected directly to VCC, therefore the voltage will be VCC. All the VCC voltage is dropped across the 10 KΩ shown.
