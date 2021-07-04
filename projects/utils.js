const readline = require('readline');

exports.Utils = class {
    static delay(ms) {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve();
            }, ms);
        })
    }

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



