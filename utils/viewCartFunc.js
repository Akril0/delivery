const {Extra, Markup} = require('telegraf');
const viewCartFunc = async (ctx, position) => {
    let totalPositionPrice = position.count * Number(position.price.match(/(\d+)/)[0]);
    await ctx.reply(`${position.title}\n` +
        `цена за один: ${position.price}\n` +
        `количество: ${position.count}\n` +
        `общая цена: ${totalPositionPrice}`, Extra.markup(Markup.inlineKeyboard(
        [
            [
                Markup.callbackButton('-', 'subtractCount'),
                Markup.callbackButton('+', 'addCount'),
            ],
            [
                Markup.callbackButton('❌Удалить', 'cancelPosition'),
            ],
        ],
    )));
};

module.exports = viewCartFunc;