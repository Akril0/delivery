const { Extra, Markup } = require('telegraf');
const viewCartFunc = (position) => {
    // let totalPositionPrice = position.count * Number(position.price.match(/(\d+)/)[0]);
    // await ctx.reply(`${position.title}\n` +
    //     `цена за один: ${position.price}\n` +
    //     `количество: ${position.count}\n` +
    //     `общая цена: ${totalPositionPrice}`, Extra.markup(Markup.inlineKeyboard(
    //         [
    //             [
    //                 Markup.callbackButton('-', 'subtractCount'),
    //                 Markup.callbackButton('+', 'addCount'),
    //             ],
    //             [
    //                 Markup.callbackButton('❌Удалить', 'cancelPosition'),
    //             ],
    //         ],
    //     ))).then(res => {
    //         ctx.session.sendedMsg.push(res.message_id)
    //     });

    return {
        text: `${position.title}\n` +
            `цена за один: ${position.price}\n` +
            `количество: ${position.count}\n` +
            `общая цена: ${position.count * Number(position.price.match(/(\d+)/)[0])}`,
        extra: Extra.markup(Markup.inlineKeyboard(
            [
                [
                    Markup.callbackButton('-', 'subtractCount'),
                    Markup.callbackButton('+', 'addCount'),
                ],
                [
                    Markup.callbackButton('❌Удалить', 'cancelPosition'),
                ],
            ],
        ).resize()),
    };
};

module.exports = viewCartFunc;

return {
    text: `${position.title}\n` +
        `цена за один: ${position.price}\n` +
        `количество: ${position.count}\n` +
        `общая цена: ${position.count * Number(position.price.match(/(\d+)/)[0])}`,
    extra: Extra.markup(Markup.inlineKeyboard(
        [
            [
                Markup.callbackButton('-', 'subtractCount'),
                Markup.callbackButton('+', 'addCount'),
            ],
            [
                Markup.callbackButton('❌Удалить', 'cancelPosition'),
            ],
        ],
    ).resize()),
};