const {Extra, Markup} = require('telegraf');
const generateMsgAddToCart = (ctx) => {
    return {
        text: `${ctx.session.addToCart.title}\n` +
            `цена за один: ${ctx.session.addToCart.price}\n` +
            `количество: ${ctx.session.addToCart.count}\n` +
            `общая цена: ${ctx.session.addToCart.count * Number(ctx.session.addToCart.price.match(/(\d+)/)[0])}`,
        extra: Extra.markup(Markup.inlineKeyboard(
            [
                [
                    Markup.callbackButton('-', 'subtractCount'),
                    Markup.callbackButton('+', 'addCount'),
                ],
                [
                    Markup.callbackButton('❌Отменить', 'cancelPosition'),
                    Markup.callbackButton('✅Подтвердить', 'confirmPosition'),
                ],
            ],
        ).resize()),
    };
};

module.exports = generateMsgAddToCart;