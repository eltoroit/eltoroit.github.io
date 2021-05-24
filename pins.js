const rpio = require('rpio');

const PINS = [
    { Physical: 1, Name: '3.3v', WPi: null, BCM: null },
    { Physical: 2, Name: '5v', WPi: null, BCM: null },
    { Physical: 3, Name: 'SDA.1', WPi: 8, BCM: 2 },
    { Physical: 4, Name: '5v', WPi: null, BCM: null },
    { Physical: 5, Name: 'SCL.1', WPi: 9, BCM: 3 },
    { Physical: 6, Name: '0v', WPi: null, BCM: null },
    { Physical: 7, Name: 'GPIO.4', WPi: 7, BCM: 4 },
    { Physical: 8, Name: 'GPIO.14/TxD', WPi: 15, BCM: 14 },
    { Physical: 9, Name: '0v', WPi: null, BCM: null },
    { Physical: 10, Name: 'GPIO.15/RxD', WPi: 16, BCM: 15 },
    { Physical: 11, Name: 'GPIO.17/ce1', WPi: 0, BCM: 17 },
    { Physical: 12, Name: 'GPIO.18/ce0', WPi: 1, BCM: 18, PWM: true },
    { Physical: 13, Name: 'GPIO.27', WPi: 2, BCM: 27 },
    { Physical: 14, Name: '0v', WPi: null, BCM: null },
    { Physical: 15, Name: 'GPIO.22', WPi: 3, BCM: 22 },
    { Physical: 16, Name: 'GPIO.23', WPi: 4, BCM: 23 },
    { Physical: 17, Name: '3.3v', WPi: null, BCM: null },
    { Physical: 18, Name: 'GPIO.24', WPi: 5, BCM: 24 },
    { Physical: 19, Name: 'GPIO.10/MOSI', WPi: 12, BCM: 10 },
    { Physical: 20, Name: '0v', WPi: null, BCM: null },
    { Physical: 21, Name: 'GPIO.9/MISO', WPi: 13, BCM: 9 },
    { Physical: 22, Name: 'GPIO.25', WPi: 6, BCM: 25 },
    { Physical: 23, Name: 'GPIO.11/SCLK', WPi: 14, BCM: 11 },
    { Physical: 24, Name: 'GPIO.8/CE0', WPi: 10, BCM: 8 },
    { Physical: 25, Name: '0v', WPi: null, BCM: null },
    { Physical: 26, Name: 'GPIO.7/CE1', WPi: 11, BCM: 7 },
    { Physical: 27, Name: 'GPIO.0/SDA0/ID_SD', WPi: 30, BCM: 0 },
    { Physical: 28, Name: 'GPIO.1/SCL0/ID_SC', WPi: 31, BCM: 1 },
    { Physical: 29, Name: 'GPIO.5', WPi: 21, BCM: 5 },
    { Physical: 30, Name: '0v', WPi: null, BCM: null },
    { Physical: 31, Name: 'GPIO.6', WPi: 22, BCM: 6 },
    { Physical: 32, Name: 'GPIO.12', WPi: 26, BCM: 12, PWM: true },
    { Physical: 33, Name: 'GPIO.13', WPi: 23, BCM: 13, PWM: true },
    { Physical: 34, Name: '0v', WPi: null, BCM: null },
    { Physical: 35, Name: 'GPIO.19/miso', WPi: 24, BCM: 19, PWM: true },
    { Physical: 36, Name: 'GPIO.16/ce2', WPi: 27, BCM: 16 },
    { Physical: 37, Name: 'GPIO.26', WPi: 25, BCM: 26 },
    { Physical: 38, Name: 'GPIO.20/mosi', WPi: 28, BCM: 20 },
    { Physical: 39, Name: '0v', WPi: null, BCM: null },
    { Physical: 40, Name: 'GPIO.21/sclk', WPi: 29, BCM: 21 }
];

exports.Pins = class Pins {
    // To Physical (Used in Rpio)
    static WPi_2_Physical(WPi) {
        this._validateInput(WPi);
        return this._validateOutput(WPi, PINS.find(pin => pin.WPi === WPi)).Physical;
    }
    static BCM_2_Physical(BCM) {
        this._validateInput(BCM);
        return this._validateOutput(BCM, PINS.find(pin => pin.BCM === BCM)).Physical;
    }
    static Name_2_Physical(Name) {
        this._validateInput(Name);
        return this._validateOutput(Name, PINS.find(pin => pin.Name === Name)).Physical;
    }
    static Physical_2_Physical(Physical) {
        this._validateInput(Physical);
        return this._validateOutput(Physical, PINS.find(pin => pin.Physical === Physical)).Physical;
    }
    // To BCM (Used in PigPio)
    static WPi_2_BCM(WPi) {
        this._validateInput(WPi);
        return this._validateOutput(WPi, PINS.find(pin => pin.WPi === WPi)).BCM;
    }
    static BCM_2_BCM(BCM) {
        this._validateInput(BCM);
        return this._validateOutput(BCM, PINS.find(pin => pin.BCM === BCM)).BCM;
    }
    static Name_2_BCM(Name) {
        this._validateInput(Name);
        return this._validateOutput(Name, PINS.find(pin => pin.Name === Name)).BCM;
    }
    static Physical_2_BCM(Physical) {
        this._validateInput(Physical);
        return this._validateOutput(Physical, PINS.find(pin => pin.Physical === Physical)).BCM;
    }

    static delay(ms) {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve();
            }, ms);
        })
    }

    // RPIO
    static FlipState_RPIO(input) {
        let output = rpio.HIGH;
        if (input === rpio.HIGH) {
            output = rpio.LOW;
        }
        return output;
    }

    // PIGPIO
    static PIGPIO = {
        LOW: 0,
        HIGH: 1
    }
    static FlipState_PIGPIO(input) {
        let output = this.PIGPIO.HIGH;
        if (input === this.PIGPIO.HIGH) {
            output = this.PIGPIO.LOW;
        }
        return output;
    }

    // Private
    static _validateInput(input) {
        if (input === null) throw new Error(`Invalid pin requested [${input}]`);
    }

    static _validateOutput(input, output) {
        if (output === null) throw new Error(`Pin [${input}] could not be found`);
        if (output.WPi === null) throw new Error(`Pin [${JSON.stringify(output)}] not valid for this operation`);
        return output;
    }
}