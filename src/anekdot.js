const cheerio = require('cheerio');
const axios = require('axios');
const { AllHtmlEntities } = require('html-entities');

const entities = new AllHtmlEntities();

const ANEKDOT_URL = 'https://www.anekdot.ru/random/anekdot/';

const { log } = console;

/**
 * Returns anekdots
 * @returns {Promise<string>}
 */
const getAnekdot = async () => {
    try {
        const response = await axios.get(ANEKDOT_URL);
        const anekdots = [];
        const $ = cheerio.load(response.data);
        $('.content .topicbox[id] > .text').each((i, elem) => {
            const anekdot = entities.decode($(elem).html()).replace(/<br>/g, '\n');
            anekdots.push(anekdot);
        });
        return '<b>😅 АНЕКДОТ:</b>\n'
            + `${anekdots[0]}\n\n`
            + '<b>😉 ВОТ ЕЩЕ ОДИН:</b>\n'
            + `${anekdots[1]}\n\n`
            + '<b>🤔 МОЖЕТ ХОТЬ ЭТОТ СМЕШНОЙ БУДЕТ:</b>\n'
            + `${anekdots[2]}`;
    } catch (e) {
        log(e.message);
        return 'Что-то пошло не так...';
    }
};

/**
 * Initiate anekdots functionality
 * @param bot
 */
const anekdotInit = (bot) => {
    bot.hears([/анекдот/i], async (ctx) => ctx.replyWithHTML(await getAnekdot()));
    bot.command('a', async (ctx) => ctx.replyWithHTML(await getAnekdot()));
};

module.exports = {
    getAnekdot,
    anekdotInit,
};
