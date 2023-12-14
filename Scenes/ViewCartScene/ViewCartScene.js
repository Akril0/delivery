const {BaseScene, Extra, Markup} = require('telegraf');
const {generateKeyboard} = require('../../utils/generateKeyboard.js');
const sectionsList = require('../../utils/categoriesList.js');
const viewCartFunc = require('../../utils/viewCartFunc.js');
const OnTextDeleteMessage = require('../../Composers/OnTextDeleteMessage.composer.js');
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
            await ctx.reply('Корзина пуста');
            return;
        }

        //View cart
        let totalCartPrice = 0;
        for (const position of ctx.session.userData.cart) {
            let totalPositionPrice = position.count * Number(position.price.match(/(\d+)/)[0]);
            totalCartPrice += totalPositionPrice;
            await viewCartFunc(ctx, position);
        }
        await ctx.reply(`Общаяя сумма: ${totalCartPrice}`);
    } catch (e) {
        console.error('viewCart enter error\n', e);
    }
});

viewCart.command('home', async (ctx) => {
    try {
        await ctx.deleteMessage(ctx.message.message_id).catch(e => {
            console.log('Delete message error\n', e);
        });

        //Delete all view cart
        for (let i = ctx.session.keyboardMessageId; i <= ctx.session.keyboardMessageId + ctx.session.userData.cart.length + 1; i++) {
            await ctx.deleteMessage(i).catch(e => {
                console.log('Delete message error\n', e);
            });
        }

        //Creating keyboard
        const keyboard = generateKeyboard(sectionsList(menuData));
        keyboard.push(['✅Подтвердить заказ', '🛒Корзина']);

        //Send keyboard and name of scene
        await ctx.reply('МЕНЮ', Extra.markup(
            Markup.keyboard(
                keyboard,
            ).resize())).then(res => ctx.session.keyboardMessageId = res.message_id);

        //Entering menu scene
        await ctx.scene.enter('menu');
    } catch (e) {
        console.error('viewCart /home error\n', e);
    }
});


viewCart.hears('⬅️Назад', async (ctx) => {
    try {
        await ctx.deleteMessage(ctx.message.message_id).catch(e => {
            console.log('Delete message error\n', e);
        });

        //Delete all view cart
        for (let i = ctx.session.keyboardMessageId; i <= ctx.session.keyboardMessageId + ctx.session.userData.cart.length + 1; i++) {
            await ctx.deleteMessage(i).catch(e => {
                console.log('Delete message error\n', e);
            });
        }


        //Creating keyboard
        const keyboard = generateKeyboard(sectionsList(menuData));
        keyboard.push(['✅Подтвердить заказ', '🛒Корзина']);

        //Send keyboard and name of scene
        await ctx.reply('МЕНЮ', Extra.markup(
            Markup.keyboard(
                keyboard,
            ).resize())).then(res => ctx.session.keyboardMessageId = res.message_id);

        //Entering menu scene
        await ctx.scene.enter('menu');
    } catch (e) {
        console.error('viewCart hears error\n', e);
    }

});

viewCart.use(OnTextDeleteMessage);

module.exports = viewCart;
