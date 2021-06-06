const rpio = require('rpio');
const { Pins } = require('./pins');

class ADS7830 {
    ADDRESS = 0x4b;
    CHANNELS = [0x84, 0xc4, 0x94, 0xd4, 0xa4, 0xe4, 0xb4, 0xf4];

    constructor() {
        rpio.init({ gpiomem: false, close_on_exit: false })
        rpio.i2cBegin();
    }

    async readValue(channel) {
        rpio.i2cSetSlaveAddress(this.ADDRESS);
        rpio.i2cSetBaudRate(100e3); // 100 KHz

        var txbuf = Buffer.from([this.CHANNELS[0]]);
        let rxbuf = Buffer.alloc(1);

        rpio.i2cWrite(txbuf);
        rpio.i2cRead(rxbuf, 1);
        return rxbuf[0];
    }

    shutdown(isLast = false) {
        rpio.i2cEnd();
        if (isLast) {
            rpio.exit();
        }
    }
}

class LedRPIO {
    _range = 1000;
    _clockDivider = 8;
    _pin = Pins.BCM_2_Physical(18);

    constructor() {
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
        rpio.pwmSetData(this._pin, 0);
        if (isLast) {
            rpio.exit();
        }
    }
}

class AppLogic {
    led;
    ads7830;

    constructor() {
        this.ads7830 = new ADS7830();
        this.led = new LedRPIO();

        process.on('SIGINT', () => {
            console.log('SIGINT');
            process.exit();
        });

        process.on('exit', (code) => {
            clearTimeout(this._timer);
            console.log('Closing Raspberry Pi');
            this.led.shutdown();
            this.ads7830.shutdown(true);
            process.exit(0);
        });

    }

    mainLoop() {
        setInterval(async () => {
            let value = await this.ads7830.readValue();
            this.led.writeValue(value / 255);
            console.log(`Value read: ${value}`);
        }, 20);
    }
}

let app = new AppLogic();
app.mainLoop();