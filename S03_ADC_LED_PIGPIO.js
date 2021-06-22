const i2c = require('i2c-bus');
const pigpio = require('pigpio');
const Gpio = pigpio.Gpio;
const { Pins } = require('./pins');

class ADS7830 {
    i2c_b1 = null;
    ADDRESS = 0x4b;
    CHANNELS = [0x84, 0xc4, 0x94, 0xd4, 0xa4, 0xe4, 0xb4, 0xf4];

    constructor() {
        i2c.openPromisified(1)
            .then(i2c_b1 => this.i2c_b1 = i2c_b1)
            .catch(error => { throw new Error(error) })
    }

    async readValue() {
        let data = -1;
        if (this.i2c_b1) {
            const wbuf = Buffer.from([this.CHANNELS[0]]);
            const rbuf = Buffer.alloc(1);

            await this.i2c_b1.i2cWrite(this.ADDRESS, wbuf.length, wbuf);
            data = await this.i2c_b1.i2cRead(this.ADDRESS, rbuf.length, rbuf);
            data = data.buffer.readUIntBE(0, data.bytesRead);
        }
        return data;
    }

    async shutdown(isLast = false) {
        await this.i2c_b1.close();
    }
}

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

    shutdown(isLast = false) {
        this.writeValue(0);
        if (isLast) {
            pigpio.terminate();
        }
    }
}

class AppLogic {
    led;
    ads7830;

    constructor() {
        this.ads7830 = new ADS7830();
        this.led = new LedPIGPIO();

        process.on('SIGINT', () => {
            console.log('SIGINT');
            process.exit();
        });

        process.on('exit', async (code) => {
            clearTimeout(this._timer);
            console.log('Closing Raspberry Pi');
            await this.ads7830.shutdown();
            this.led.shutdown(true);
            process.exit(0);
        });

    }

    mainLoop() {
        setInterval(async () => {
            debugger;
            let value = await this.ads7830.readValue();
            if (value >= 0) {
                this.led.writeValue(value / 255);
                console.log(`Value read: ${value}`);
            }
        }, 20);
    }
}

let app = new AppLogic();
app.mainLoop();