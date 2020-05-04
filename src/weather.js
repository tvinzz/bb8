const axios = require('axios');
const { ERROR_MESSAGE } = require('./consts');

const { log } = console;

const cities = {
    'Moscow': 'москв',
    'Saint Petersburg': 'питер',
    'Korolev': 'королев',
    'Mitischi': 'мытищ',
    'Pushkino': 'пушкин',
    'Krasnogorsk': 'красногорск',
    'Odintsovo': 'одинцов',
    'Balashikha': 'балаших',
    'Reutov': 'реутов',
    'Lyubertsy': 'люберц',
    'Khimki': 'химк',
    'Zelenograd': 'зеленоград',
    'Zheleznodorozhny': 'железнодорожн',
    'Shchyolkovo': 'щелков',
    'Fryazino': 'фрязин',
    'Ivanteyevka': 'ивантеевк',
    'Zagoryanskiy': 'загорян',
    'Podolsk': 'подольск',
    'Samara': 'самар',
    'Krasnodar': 'краснодар',
    'Yalta': 'крым',
    'Sochi': 'сочи',
    'Novosibirsk': 'новосиб',
    'Ko Pha ngan': 'панган',
    'Dahab': 'егип',
    'Norochcholai': 'ланк',
};

/**
 * Returns formatted weather forecast
 * @param {Object} data
 * @returns {string}
 */
const formatWeather = (data) => {
    const date = new Date();
    const today = date.getDate();
    const index = data.list.some((x, i) => {
        const day = new Date(x.dt * 1000);
        if (day.getDate() === (today + 1)) {
            return i;
        }
        return 0;
    });
    return `<b>🏢 ${data.city.name.toUpperCase()}:</b>\n\n`
        + `🌀 Сейчас ${data.list[0].weather[0].description}\n`
        + `🌡 Температура: ${Math.round(data.list[0].main.temp)} °C\n`
        + `☁️ Давление: ${Math.round(data.list[0].main.pressure / 1.33)} мм рт.ст.\n`
        // eslint-disable-next-line no-irregular-whitespace
        + `​​💦​ Влажность: ${data.list[0].main.humidity}%\n`
        + `🌬 Ветер: ${Math.round(data.list[0].wind.speed)} м/с\n\n`
        + `🌀 Завтра днем ${data.list[index + 5].weather[0].description}\n`
        + `🌡 Ночью: ${Math.round(data.list[5].main.temp)} °C, `
        + `днем: ${Math.round(data.list[index + 5].main.temp)} °C\n`
        + `☁️ Давление: ${Math.round(data.list[index + 5].main.pressure / 1.33)} мм рт.ст.`;
};

/**
 * Returns weather forecast
 * @param {String|Object} data
 * @returns {Promise<string|string>}
 */
const getWeather = async (data) => {
    const cityName = (typeof data === 'string')
        ? data
        : Object.keys(cities).filter((key) => data.text.toLowerCase().includes(cities[key]));

    if (!cityName || !cityName.length) {
        return 'Не могу найти прогноз погоды для этого места...';
    }
    try {
        // eslint-disable-next-line max-len
        const response = await axios.get(`https://api.openweathermap.org/data/2.5/forecast?q=${cityName.toString()}&appid=0500f025d3ce0673be71b4530cbc5cf5&lang=ru&units=metric`);
        return formatWeather(response.data);
    } catch (e) {
        log(e.message);
        return ERROR_MESSAGE;
    }
};

/**
 * Initiate weather functionality
 * @param bot
 */
const weatherInit = (bot) => {
    bot.hears(/погод..? (в|на) .*/i, async (ctx) => ctx.replyWithHTML(await getWeather(ctx.message)));
    bot.command('w', async (ctx) => {
        const city = ctx.message.text.split(' ').slice(1).join(' ');
        return ctx.replyWithHTML(await getWeather(city));
    });
};

module.exports = {
    getWeather,
    weatherInit,
};
