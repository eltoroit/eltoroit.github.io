---
layout: default
isPublished: true
title: Pull-Up, Pull-Down Resistors
---

When working with electronic logic circuits, we use pull-up/pull-down resistors to ensure a known state for a signal.

Digital electronics have two different values:

- True/False
- High/Low
- On/Off
- 0/1
- VCC/GND

  VCC (Voltage Common Collector) is the higher voltage with relation to GND (ground). In Raspberry Pi circuits, VCC is usually either 3.3 volts or 5 volts.

But in reality, we are working with analog voltages ranging anywhere from 0 volts to VCC volts. If you remember the video I showed you on the [**Debouncing A Button**]({% link _posts/2021-04-04-DebounceButton.md %}) article, the voltages can have any value between 0 volts and VCC.

So if we are working on a logic circuit where 5 volts is VCC (HIGH/TRUE) and 0 volts is gound (LOW/FALSE), what about 4.5 volts? Does that correspond to a HIGH/TRUE value? What about 4.999 volts? What about 2.5 volts? 2.4? 2.6? Where do the breaks happen? Those were the questions I was asking myself at this moment. I was surprised when I found the answer: There is not a standard set of values. Depending on the technology you are using (TTL, CMOS, GTL, and others), the ranges are different, as illustrated in this image:

![Logic Voltages](/assets/blog/2021-05-02/LogicVoltages.png)

# Pull-Up Resistor

But a much more critical aspect that I learned is that sometimes the voltage can act strangely! To explain what I am talking about, let's take a look at this circuit:

![Without Pull-Up resistor](/assets/blog/2021-05-02/PullUpWithout.png)

If we close the switch, then the input is 0 volts. But what would be the voltage if we open the switch? We can not assume that it is VCC volts! We need to build the circuit differently using a **pull-up resistor**, as shown on this image:

![With Pull-Up resistor](/assets/blog/2021-05-02/PullUpWith.png)

In this circuit, when the switch is open, the voltage is VCC volts. But what is the voltage if the switch is closed? That is a great question. I'm glad you asked! The input is connected directly to ground, and we have 0 volts. All the VCC voltage drops across the 10 KΩ resistor shown.

# Pull-Down Resistor

We also have a similar but reverse operation in this circuit:

![Without Pull-Down resistor](/assets/blog/2021-05-02/PullDownWithout.png)

And it gets solved with a **pull-down resistor** as shown in this circuit:

![With Pull-Down resistor](/assets/blog/2021-05-02/PullDownWith.png)

In this circuit, when the switch is open, the voltage is 0 volts because it's connected to ground. But what is the voltage if the switch is closed? The input is connected directly to VCC, therefore the voltage is VCC. All the VCC voltage drops across the 10 KΩ resistor shown.
