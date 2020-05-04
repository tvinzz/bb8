const TelegrafInlineMenu = require('telegraf-inline-menu');
const { getAnekdot } = require('./anekdot');
const { getMem } = require('./mem');
const { getCurrencyRates } = require('./currency');
const { getWeather } = require('./weather');
const { displayCryptoCurrencyInfo } = require('./crypto');

const { weatherInfo, cryptoInfo, aboutBB8 } = require('./consts');

const menu = new TelegrafInlineMenu('Чем я могу вам помочь?');
const weatherMenu = new TelegrafInlineMenu('Выберите город:');
const cryptoMenu = new TelegrafInlineMenu('Выберите криптовалюту:');

/**
 * Initiate bot menu
 */
const menuInit = (bot) => {
    menu.manual('💵 Курсы валют ЦБ РФ', 'c');

    menu.submenu('🔸 Криптовалюты', 'k', cryptoMenu, { joinLastRow: true })
        .manual('Биткоин', 'btc', { root: true })
        .manual('Эфириум', 'eth', { joinLastRow: true, root: true })
        .manual('Litecoin', 'ltc', { root: true })
        .manual('Dash', 'dash', { joinLastRow: true, root: true })
        .manual('Monero', 'xmr', { root: true })
        .manual('Zcash', 'zec', { joinLastRow: true, root: true })
        .manual('Tether', 'usdt', { root: true })
        .manual('EOS', 'eos', { joinLastRow: true, root: true })
        .manual('🔸 Другие криптовалюты', 'crypto', { root: true });

    menu.manual('🤣 Анекдоты', 'a');

    menu.manual('😸 Случайный мем', 'm', { joinLastRow: true });

    menu.submenu('🌤 Прогноз погоды', 's', weatherMenu)
        .manual('Москва', 'moscow', { joinLastRow: true, root: true })
        .manual('Санкт-Петербург', 'piter', { joinLastRow: true, root: true })
        .manual('Сочи', 'sochi', { root: true })
        .manual('Краснодар', 'krasnodar', { joinLastRow: true, root: true })
        .manual('Новосибирск', 'novosib', { root: true })
        .manual('Екатеринбург', 'eburg', { joinLastRow: true, root: true })
        .manual('Пермь', 'perm', { root: true })
        .manual('Самара', 'samara', { joinLastRow: true, root: true })
        .manual('🏢 Другие города', 'weather', { root: true });

    menu.manual('ℹ️ BB-8', 'i', { joinLastRow: true });

    menu.setCommand('start');

    const showMenu = menu.replyMenuMiddleware();
    bot.use(menu.init());

    const bb8Names = [/bb8/i, /bb-8/i, /ии8/i, /ии-8/i];
    bot.hears(bb8Names, showMenu);
    bot.command('bb8', showMenu);

    bot.command('info', (ctx) => {
        ctx.replyWithAudio('https://kinamwood.ru/bb-8.mp3');
        ctx.replyWithHTML(aboutBB8);
    });

    bot.action('a', async (ctx) => ctx.replyWithHTML(await getAnekdot()));
    bot.action('m', async (ctx) => ctx.replyWithPhoto(await getMem()));
    bot.action('c', async (ctx) => ctx.replyWithHTML(await getCurrencyRates()));

    // weather
    bot.action('moscow', async (ctx) => ctx.replyWithHTML(await getWeather('Moscow')));
    bot.action('piter', async (ctx) => ctx.replyWithHTML(await getWeather('Saint Petersburg')));
    bot.action('sochi', async (ctx) => ctx.replyWithHTML(await getWeather('Sochi')));
    bot.action('krasnodar', async (ctx) => ctx.replyWithHTML(await getWeather('Krasnodar')));
    bot.action('novosib', async (ctx) => ctx.replyWithHTML(await getWeather('Novosibirsk')));
    bot.action('eburg', async (ctx) => ctx.replyWithHTML(await getWeather('Ekaterinburg')));
    bot.action('perm', async (ctx) => ctx.replyWithHTML(await getWeather('Perm')));
    bot.action('samara', async (ctx) => ctx.replyWithHTML(await getWeather('Samara')));
    bot.action('weather', (ctx) => ctx.replyWithHTML(weatherInfo));

    // crypto coins
    bot.action('btc', async (ctx) => displayCryptoCurrencyInfo('bitcoin', ctx));
    bot.action('eth', async (ctx) => displayCryptoCurrencyInfo('ethereum', ctx));
    bot.action('ltc', async (ctx) => displayCryptoCurrencyInfo('litecoin', ctx));
    bot.action('dash', async (ctx) => displayCryptoCurrencyInfo('dash', ctx));
    bot.action('xmr', async (ctx) => displayCryptoCurrencyInfo('monero', ctx));
    bot.action('zec', async (ctx) => displayCryptoCurrencyInfo('zcash', ctx));
    bot.action('usdt', async (ctx) => displayCryptoCurrencyInfo('tether', ctx));
    bot.action('eos', async (ctx) => displayCryptoCurrencyInfo('eos', ctx));
    bot.action('crypto', (ctx) => ctx.replyWithHTML(cryptoInfo));

    bot.action('i', (ctx) => {
        ctx.replyWithAudio('https://kinamwood.ru/bb-8.mp3');
        ctx.replyWithHTML(aboutBB8);
    });
};

module.exports = menuInit;
