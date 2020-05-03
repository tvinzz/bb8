const cheerio = require('cheerio');
const axios = require('axios');

const MEM_URL = 'https://www.anekdot.ru/random/mem/';
const BLANK_IMAGE_URL = 'https://upload.wikimedia.org/wikipedia/en/3/39/BB-8%2C_Star_Wars_The_Force_Awakens.jpg';

const { log } = console;

/**
 * Returns mem picture url
 * @returns {Promise<string|string>}
 */
const getMem = async () => {
    try {
        const response = await axios.get(MEM_URL);
        const $ = cheerio.load(response.data);
        const mems = $('.content .topicbox[id] > .text > img');
        return mems[3].attribs.src || mems[2].attribs.src || BLANK_IMAGE_URL;
    } catch (e) {
        log(e.message);
        return 'Что-то пошло не так...';
    }
};

/**
 * Initiate mems functionality
 * @param bot
 */
const memInit = (bot) => {
    bot.hears([/мем.{0,2}?(\s|$)/i, /мемас/i], async (ctx) => ctx.replyWithPhoto(await getMem()));
    bot.command('m', async (ctx) => ctx.replyWithPhoto(await getMem()));
};

module.exports = {
    getMem,
    memInit,
};
