const {BaseScene, Extra, Markup} = require('telegraf');
const generateAndSendKeyBoard = require('../../utils/generateAndSendKeyboard.js');
const OnTextDeleteMessage = require('../../Composers/OnTextDeleteMessage.composer.js');
const ConfirmOrderHearsBack = require('../../Composers/ConfirmSceneComposer/ConfirmOrderHearsBack.composer.js');

const confirmOrder = new BaseScene('confirmOrder');

confirmOrder.enter(async ctx => {
    try {
        ctx.session.userData.cart = [];
        await ctx.reply('Закак подтвержден', Extra.markup(Markup.keyboard(
            [['⬅️Вернуться к меню']],
        ).resize())).then(
            res => {
                ctx.session.keyboardMessageId = res.message_id;
            },
        );
    } catch (e) {
        console.error('confirmOrder enter error\n', e);
    }
});

confirmOrder.command('home', async (ctx) => {

    try {
        await ctx.deleteMessage(ctx.message.message_id).catch(e => {
            console.log('Delete message error\n', e);
        });

        await ctx.deleteMessage(ctx.session.keyboardMessageId).catch(e => {
            console.log('Delete message error\n', e);
        });

        await generateAndSendKeyBoard(ctx);

        //Entering menu scene
        await ctx.scene.enter('menu');
    } catch (e) {
        console.error('confirmOrder /home error\n', e);
    }
});

confirmOrder.use(ConfirmOrderHearsBack);

confirmOrder.use(OnTextDeleteMessage);

module.exports = confirmOrder;