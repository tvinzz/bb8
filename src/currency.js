const axios = require('axios');
const { ERROR_MESSAGE } = require('./consts');

const CURRENCY_RATES_URL = 'https://www.cbr-xml-daily.ru/daily_json.js';

const { log } = console;

/**
 * Returns currency rates
 * @returns {Promise<string|string>}
 */
const getCurrencyRates = async () => {
    try {
        const response = await axios.get(CURRENCY_RATES_URL);
        const usd = response.data.Valute.USD;
        const eur = response.data.Valute.EUR;
        const usdRate = usd.Value > usd.Previous ? '▲' : '▼';
        const eurRate = eur.Value > eur.Previous ? '▲' : '▼';
        const usdDiff = (usd.Value - usd.Previous).toFixed(2);
        const eurDiff = (eur.Value - eur.Previous).toFixed(2);
        return '<b>🏦 Курсы валют ЦБ РФ на сегодня:</b>\n\n'
            + `💵 Доллар США $ - ${usd.Value} руб. ${usdRate} ${usdDiff}\n\n`
            + `💶 Евро € - ${eur.Value} руб. ${eurRate} ${eurDiff}`;
    } catch (e) {
        log(e.message);
        return ERROR_MESSAGE;
    }
};

/**
 * Initiate currency rates functionality
 * @param bot
 */
const currencyInit = (bot) => {
    bot.hears([/валют/i], async (ctx) => ctx.replyWithHTML(await getCurrencyRates()));
    bot.command('c', async (ctx) => ctx.replyWithHTML(await getCurrencyRates()));
};

module.exports = {
    getCurrencyRates,
    currencyInit,
};
