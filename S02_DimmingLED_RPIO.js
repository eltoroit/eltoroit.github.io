const rpio = require('rpio');
const { Pins } = require('./pins');

class LedRPIO {
    _clockDivider = 8;
    _pin = Pins.BCM_2_Physical(18);

    constructor(range) {
        rpio.init({ gpiomem: false, close_on_exit: false })
        rpio.open(this._pin, rpio.PWM);
        rpio.pwmSetClockDivider(this._clockDivider);
        rpio.pwmSetRange(this._pin, range);
    }

    writeValue(value) {
        rpio.pwmSetData(this._pin, value);
    }

    shutdown() {
        rpio.close(this._pin, rpio.PIN_RESET);
        rpio.exit();
    }
}

class LedLogic {
    _data = 0;
    _step = 0;
    _range = 0;
    _delay = 0;
    _factor = 0;
    _led = null;
    _timer = null;

    constructor() {
        this._range = 1e3;
        this._delay = 1e3;
        this._factor = 20 * Math.floor(this._range / 100);
        this._step = 1 * this._factor;
        this._led = new LedRPIO(this._range);

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

    run() {
        return new Promise((resolve, reject) => {
            if (this._data < 0) {
                this._data = 0 + this._factor;
                this._step = 1 * this._factor;
                console.log(`${new Date().toJSON()} >> Switch (^)`);
            } else if (this._data > this._range) {
                this._data = this._range - this._factor;
                this._step = -1 * this._factor;
                console.log(`${new Date().toJSON()} >> Switch (v)`);
            }

            if (this._data >= 0 && this._data <= this._range) {
                console.log(`${new Date().toJSON()} >> ${parseFloat(100 * this._data / this._range).toFixed(2)}% (${this._step > 0 ? '^' : 'v'})`);
                this._led.writeValue(this._data);
            }
            this._data += this._step;

            this._timer = setTimeout(() => {
                this.run();
            }, this._delay);
        })
    }
}

let led = new LedLogic();
led.run();