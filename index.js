const { Telegraf } = require('telegraf')
const menuInit = require("./src/menu");
const { weatherInit } = require('./src/weather');
const { anekdotInit } = require('./src/anekdot');
const { memInit } = require('./src/mem');
const { currencyInit } = require('./src/currency');
const { cryptoCoinsInit } = require('./src/crypto');
const chalk = require('chalk');
const bb8 = require('./private/bb8.json');

const { log } = console;

const bot = new Telegraf(bb8.token);

console.log(chalk.green('Status: BB-8 is active now'));

try {
    menuInit(bot);
    weatherInit(bot);
    anekdotInit(bot);
    memInit(bot);
    currencyInit(bot);
    cryptoCoinsInit(bot);
    bot.launch();
} catch (e) {
    log(chalk.red(e.message));
}
