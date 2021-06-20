const i2c = require('i2c-bus');
const Gpio = require('pigpio').Gpio;
// const { Pins } = require('./pins');

// class ADS7830 {
ADDRESS = 0x4b;
CHANNELS = [0x84, 0xc4, 0x94, 0xd4, 0xa4, 0xe4, 0xb4, 0xf4];

//     constructor() {
//         rpio.init({ gpiomem: false, close_on_exit: false })
//         rpio.i2cBegin();
//     }

//     readValue() {
//         rpio.i2cSetSlaveAddress(this.ADDRESS);
//         rpio.i2cSetBaudRate(100e3); // 100 KHz

//         var txbuf = Buffer.from([this.CHANNELS[0]]);
//         let rxbuf = Buffer.alloc(1);

//         rpio.i2cWrite(txbuf);
//         rpio.i2cRead(rxbuf, 1);
//         return rxbuf[0];
//     }

//     shutdown(isLast = false) {
//         rpio.i2cEnd();
//         if (isLast) {
//             rpio.exit();
//         }
//     }
// }

// class LedPIGPIO {
//     _led = null;
//     _clock = 5;
//     _range = 25;
//     _frequency = 8000;
//     _pin = Pins.BCM_2_BCM(18);

//     constructor() {
//         pigpio.initialize();
//         pigpio.configureClock(this._clock, pigpio.CLOCK_PWM);
//         this._led = new Gpio(this._pin, { mode: Gpio.OUTPUT });
//         this._led.pwmRange(this._range);
//         this._led.pwmFrequency(this._frequency);
//         this._led.digitalWrite(Pins.PIGPIO.LOW);
//     }

//     writeValue(percentage) {
//         this._led.pwmWrite(Math.floor(this._range * percentage));
//     }

//     shutdown(isLast = false) {
//         this._led.digitalWrite(0);
//         if (isLast) {
//             pigpio.terminate();
//         }
//     }
// }

// class AppLogic {
//     led;
//     ads7830;

//     constructor() {
//         this.ads7830 = new ADS7830();
//         this.led = new LedPIGPIO();

//         process.on('SIGINT', () => {
//             console.log('SIGINT');
//             process.exit();
//         });

//         process.on('exit', (code) => {
//             clearTimeout(this._timer);
//             console.log('Closing Raspberry Pi');
//             this.led.shutdown();
//             this.ads7830.shutdown(true);
//             process.exit(0);
//         });

//     }

//     mainLoop() {
//         setInterval(() => {
//             let value = this.ads7830.readValue();
//             this.led.writeValue(value / 255);
//             console.log(`Value read: ${value}`);
//         }, 20);
//     }
// }

// let app = new AppLogic();
// app.mainLoop();
function readPromisesByte() {
    let i2c1 = null;
    return new Promise((resolve, reject) => {
        i2c.openPromisified(1)
            .then(_i2c1 => {
                i2c1 = _i2c1;
                return i2c1.readByte(ADDRESS, CHANNELS[0]);
            })
            .then(rawData => {
                resolve(rawData);
            })
            .then(_ => i2c1.close())
            .catch(error => reject(error));
    });
}

function readPromisesWord() {
    let i2c1 = null;
    return new Promise((resolve, reject) => {
        i2c.openPromisified(1)
            .then(_i2c1 => {
                i2c1 = _i2c1;
                return i2c1.readWord(ADDRESS, CHANNELS[0]);
            })
            .then(rawData => {
                resolve(rawData);
            })
            .then(_ => i2c1.close())
            .catch(error => reject(error));
    });
}

function readPromisesPlain() {
    let i2c1 = null;
    const wbuf = Buffer.from([CHANNELS[0]]);
    const rbuf = Buffer.alloc(1);

    return new Promise((resolve, reject) => {
        i2c.openPromisified(1)
            .then(_i2c1 => {
                i2c1 = _i2c1;
                return i2c1.i2cWrite(ADDRESS, wbuf.length, wbuf);
            })
            .then(_ => {
                return i2c1.i2cRead(ADDRESS, rbuf.length, rbuf);
            })
            .then(data => {
                resolve(data.buffer.readUIntBE(0, data.bytesRead));
            })
            .then(_ => i2c1.close())
            .catch(console.log);
    });
}

console.log("START");
setInterval(async () => {
    let v1b = await readPromisesByte();
    let v1w = await readPromisesWord();
    let v2 = await readPromisesPlain();
    console.log(`${new Date()} | ${v1b} | ${v1w} | ${v2}`);
}, 20);
console.log("END");