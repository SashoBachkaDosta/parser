import { StyleguideParser } from './parser.js';
import * as readline from 'readline';
import { ConfigOptions } from './models/models.js';

import fs = require('fs');

class Startup {

    public static main(): number {
        let config: ConfigOptions = {in: '', out: ''};
        try {
            let json = JSON.parse(fs.readFileSync('prsconfig.json').toString())
            config.in = json.in;
            config.out = json.out;
            StyleguideParser.parseJson(config);
        } catch {
            let rl = readline.createInterface({
                input: process.stdin,
                output: process.stdout
            });
            rl.question('Please enter the path to your input json ', (answer) => {
                config.in = answer
                rl.question('Please enter the path to your desired output location ', (answer) => {
                    config.out = answer
                    fs.writeFileSync('prsconfig.json', JSON.stringify(config));
                    rl.close();
                    StyleguideParser.parseJson(config);
                })
            });
        }   
        return 0;
    }
}

Startup.main();