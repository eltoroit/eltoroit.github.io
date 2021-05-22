---
layout: default
published: false
title: Pulse-Width Modulation (PWM)
---

PWM converts a digital circuit into an analog one!

We have seen in the [Hello IoT (RPIO)]({% link _posts/2021-03-28-HelloIoT-RPIO.md %}) and [Hello IoT (PIGPIO)]({% link _posts/2021-05-16-HelloIoT-PIGPIO.md %}) articles how Raspberry Pi can put 3.3 volts (logic HIGH) on GPIO18 and the LED turns ON, or 0 volts (logic LOW) and the LED turns OFF. But can we dim the LED? Great question! I am glad you asked. Before I can answer that, we need to discuss few things.

# How to dim an LED?

Let's look at a simple [datasheet for a standard LED](https://marktechopto.com/pdf/products/datasheet/MT4118-HR-A.pdf); this may not be the same LED we are using, but all of them work very similar. Some of the values may be a bit different but the concepts, which is what I want to show you, work the same way. There are two specific charts that I want to highlight from that datasheet.

The first chart shows the forward current and voltage operation. What is interesting to see here is that the voltage is around 2.2 volts (1.8 volts to 2.4 volts). It does change as much as the current, which goes from 0 mA to 50 mA!

![Forward current vs. applied voltage](/assets/blog/2021-05-30/LED_Chart01.png)

Therefore, we can imagine that current is probably more important than voltage when changing the intensity of the LED because it has a more significant variation. The second chart from the same datasheet confirms this relationship, illustrating that the intensity is directly proportional to the current flowing through the LED.

![Forward current vs. Luminous intensity](/assets/blog/2021-05-30/LED_Chart02.png)

Fantastic, so how can we dim an LED? Vary the current! But how? We can build a simple circuit with a [Potentiometer](https://en.wikipedia.org/wiki/Potentiometer), an LED, and a battery, as shown below:

![Simple Circuit](/assets/blog/2021-05-30/PWM_01.png)

The 30 Ω resistor protects the LED when the potentiometer is set to 0 Ω. By varying the potentiometer from 0% (0 Ω) to 100% (200 Ω) we can vary the current and therefore dimming the LED. I used a very cool simulator named [EveryCircuit](https://everycircuit.com/app/) to see the different values for the voltages, current and intensity of the LED. This is shown on this animation:

<p style="text-align:center">
    <video src="/assets/blog/2021-05-30/PWM_01.mov" autoplay controls loop></video>
</p>
