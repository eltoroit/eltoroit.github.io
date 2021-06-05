const rpio = require('rpio');
const { Pins } = require('./pins');

class I2C {
    ADS7830_ADDRESS = 0x4b;
    ADS7830_CHANNELS = [0x84, 0xc4, 0x94, 0xd4, 0xa4, 0xe4, 0xb4, 0xf4];

    constructor() {
        rpio.i2cBegin();
    }

    async readValue(channel) {
        rpio.i2cSetSlaveAddress(this.ADS7830_ADDRESS);
        rpio.i2cSetBaudRate(100 * 1000); // 100 KHz

        var txbuf = Buffer.from([this.ADS7830_CHANNELS[0]]);
        let rxbuf = Buffer.alloc(1);

        rpio.i2cWrite(txbuf);
        rpio.i2cRead(rxbuf, 1);
        return rxbuf[0];
    }

    shutdown() {
        rpio.i2cEnd();
        rpio.exit();
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

    shutdown() {
        rpio.close(this._pin, rpio.PIN_RESET);
        rpio.exit();
    }
}

class AppLogic {
    i2c;
    led;

    constructor() {
        this.i2c = new I2C();
        this.led = new LedRPIO();

        process.on('SIGINT', () => {
            console.log('SIGINT');
            process.exit();
        });

        process.on('exit', (code) => {
            clearTimeout(this._timer);
            console.log('Closing Raspberry Pi');
            this.i2c.shutdown();
            this.led.shutdown();
            process.exit(0);
        });

    }

    mainLoop() {
        setInterval(async () => {
            let value = await this.i2c.readValue();
            this.led.writeValue(value / 255);
            console.log(`Value read: ${value}`);
        }, 20);
    }
}

let app = new AppLogic();
app.mainLoop();