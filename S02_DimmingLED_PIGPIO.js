const pigpio = require('pigpio');
const Gpio = pigpio.Gpio;
const { Pins } = require('./pins');

class LedPIGPIO {
    _led = null;
    _clock = 5;
    _range = 25;
    _frequency = 8000;
    _pin = Pins.BCM_2_BCM(18);

    constructor() {
        pigpio.initialize();
        pigpio.configureClock(this._clock, pigpio.CLOCK_PWM);
        this._led = new Gpio(this._pin, { mode: Gpio.OUTPUT });
        this._led.pwmRange(this._range);
        this._led.pwmFrequency(this._frequency);
        this._led.digitalWrite(Pins.PIGPIO.LOW);
    }

    writeValue(percentage) {
        this._led.pwmWrite(Math.floor(this._range * percentage));
    }

    shutdown() {
        this._led.digitalWrite(0);
        pigpio.terminate();
    }
}

class LedLogic {
    _data = 0;
    _step = 0;
    _delay = 0;
    _factor = 0;
    _led = null;
    _timer = null;

    constructor() {
        this._delay = 1e3;
        this._factor = .2;
        this._step = 1 * this._factor;
        this._led = new LedPIGPIO();

        process.on('SIGINT', () => {
            console.log();
            process.exit();
        });

        process.on('exit', (code) => {
            clearTimeout(this._timer);
            console.log('Closing Raspberry PI');
            this._led.shutdown();
            process.exit(0);
        });
    }

    loop() {
        if (this._data < 0) {
            this._data = 0 + this._factor;
            this._step = 1 * this._factor;
            console.log(`${new Date().toJSON()} >> Switch (^)`);
        } else if (this._data > 1) {
            this._data = 1 - this._factor;
            this._step = -1 * this._factor;
            console.log(`${new Date().toJSON()} >> Switch (v)`);
        }

        if (this._data >= 0 && this._data <= 1) {
            console.log(`${new Date().toJSON()} >> ${parseFloat(100 * this._data).toFixed(2)}% (${this._step > 0 ? '^' : 'v'})`);
            this._led.writeValue(this._data);
        }
        this._data += this._step;

        this._timer = setTimeout(() => {
            this.loop();
        }, this._delay);
    }
}

let led = new LedLogic();
led.loop();