const readline = require('readline');

exports.Utils = class Utils {

    static delay(ms) {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve();
            }, ms);
        })
    }

    // completer: 
    static readFromConsole(prompt, completer) {
        return new Promise((resolve) => {
            const reader = require('readline').createInterface({
                input: process.stdin,
                output: process.stdout
            });
            try {
                reader.question(prompt, answer => {
                    resolve(answer);
                    reader.close();
                });
            } catch (ex) {
                reject();
                reader.close();
            }
        })
    }
}



