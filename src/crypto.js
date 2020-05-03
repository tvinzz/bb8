const CoinGecko = require('coingecko-api');

const CoinGeckoClient = new CoinGecko();

/**
 * Returns crypto coins rates
 * @param coin
 * @returns {Promise<{data: string, logo: *}>}
 */
const getCoinData = async (coin) => {
    const data = await CoinGeckoClient.coins.fetch(coin, {});
    return {
        logo: data.data.image.large,
        data: `<b>${data.data.name}</b>\n`
            + `1 ${data.data.symbol.toUpperCase()} = ${data.data.market_data.current_price.usd} USD\n`
            + `1 ${data.data.symbol.toUpperCase()} = ${data.data.market_data.current_price.eur} EUR\n`
            + `1 ${data.data.symbol.toUpperCase()} = ${data.data.market_data.current_price.rub} RUB`,
    };
};

/**
 * Initiate crypto coins rates functionality
 * @param bot
 */
const cryptoCoinsInit = (bot) => {
    const displayCryptoCurrencyInfo = async (coin, ctx) => {
        const coinData = await getCoinData(coin);
        await ctx.replyWithPhoto(coinData.logo);
        await ctx.replyWithHTML(coinData.data);
    };
    bot.hears([/биткоин/i, /bitcoin/i], async (ctx) => {
        await displayCryptoCurrencyInfo('bitcoin', ctx);
    });
    bot.hears([/эфириум/i, /ethereum/i, /курс эфир/i], async (ctx) => {
        await displayCryptoCurrencyInfo('ethereum', ctx);
    });
    bot.command('k', async (ctx) => {
        const coin = ctx.message.text.split(' ').slice(1).toString();
        await displayCryptoCurrencyInfo(coin, ctx);
    });
};

module.exports = {
    getCoinData,
    cryptoCoinsInit,
};
