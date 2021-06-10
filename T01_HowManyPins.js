const rpio = require('rpio');
const { Pins } = require('./pins');

class LedRPIO {
    _range = 1000;
    _clockDivider = 8;
    _pin = null;
    GPIO_Number = null;

    constructor(GPIO_Number) {
        this.GPIO_Number = GPIO_Number;
        this._pin = Pins.BCM_2_Physical(GPIO_Number);
        rpio.init({ gpiomem: false, close_on_exit: false })
        rpio.open(this._pin, rpio.PWM);
        rpio.pwmSetClockDivider(this._clockDivider);
        rpio.pwmSetRange(this._pin, this._range);
    }

    writeValue(percentage) {
        let value = Math.floor(percentage * this._range);
        rpio.pwmSetData(this._pin, value);
    }

    shutdown(isLast = false) {
        rpio.close(this._pin, rpio.PIN_RESET);
        if (isLast) {
            rpio.exit();
        }
    }
}

class LedLogic {
    _leds = null;

    constructor() {
        this._leds = [
            { pin: new LedRPIO(12), value: .4 },
            { pin: new LedRPIO(18), value: .2 },

            { pin: new LedRPIO(13), value: .6 },
            { pin: new LedRPIO(19), value: .8 }
        ];

        process.on('SIGINT', () => {
            process.exit();
        });

        process.on('exit', (code) => {
            console.log('Closing Raspberry PI');
            this._leds.forEach((led, index, array) => {
                led.pin.shutdown(index + 1 === array.length);
            });
            process.exit(0);
        });
    }

    values() {
        console.log(`=== ${new Date().toJSON()}`);
        this._leds.forEach((led) => {
            console.log(`GPIO${led.pin.GPIO_Number} => ${Pins.BCM_2_Physical(led.pin.GPIO_Number)} => ${Math.floor(led.value * 100)}%`);
            led.pin.writeValue(led.value);
        });
        this.loop();
    }

    loop() {
        setTimeout(() => {
            this.values();
        }, 2e3);
    }
}

let led = new LedLogic();
led.values();