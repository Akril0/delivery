const { BaseScene, Extra, Markup } = require('telegraf');
const { generateKeyboard } = require('../../utils/generateKeyboardSize.js');
const generateAndSendKeyBoard = require('../../utils/generateAndSendKeyboard.js');
const viewCartFunc = require('../../utils/viewCartFunc.js');
const deleteAllPositionsInChat = require('../../utils/deleteAllPositionsInChat.js');
const OnTextDeleteMessage = require('../../Composers/OnTextDeleteMessage.composer.js');
const ViewCartHearsBack = require('../../Composers/ViewCartComposer/ViewCartHearsBack.composer.js');
const menuData = require('../../data/menu.json');


const viewCart = new BaseScene('viewCart');
viewCart.enter(async ctx => {
    try { //Send message with keyboard
        await ctx.reply('Корзина:', Extra.markup(Markup.keyboard(
            [['⬅️Назад']],
        ).resize())).then(
            res => ctx.session.keyboardMessageId = res.message_id,
        );

        //Check if cart is empty
        if (ctx.session.userData.cart.length === 0) {
            await ctx.reply('Корзина пуста').then(res => {
                ctx.session.sendedMsg.push(res.message_id)
            });
            return;
        }

        //View cart
        let totalCartPrice = 0;
        for (const position of ctx.session.userData.cart) {
            let totalPositionPrice = position.count * Number(position.price.match(/(\d+)/)[0]);
            totalCartPrice += totalPositionPrice;
            const message = viewCartFunc(position);
            await ctx.reply(message.text, message.markup).then(res => {
                ctx.session.sendedMsg.push(res.message_id)
            })
        }
        await ctx.reply(`Общаяя сумма: ${totalCartPrice}`).then(
            res => {
                ctx.session.sendedMsg.push(res.message_id)
            }
        );
    } catch (e) {
        console.error('viewCart enter error\n', e);
    }
});

viewCart.command('home', async (ctx) => {
    try {
        await ctx.deleteMessage(ctx.message.message_id).catch(e => {
            console.log('Delete message error\n', e);
        });

        await deleteAllPositionsInChat(ctx, ctx.session.userData.cart.length + 1);

        await generateAndSendKeyBoard(ctx);

        //Entering menu scene
        await ctx.scene.enter('menu');
    } catch (e) {
        console.error('viewCart /home error\n', e);
    }
});


viewCart.use(ViewCartHearsBack);

viewCart.use(OnTextDeleteMessage);

module.exports = viewCart;
