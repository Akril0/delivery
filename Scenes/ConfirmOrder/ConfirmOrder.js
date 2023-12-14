const {BaseScene, Extra, Markup} = require('telegraf');
const {generateKeyboard} = require('../../utils/generateKeyboard.js');
const sectionsList = require('../../utils/categoriesList.js');
const menuData = require('../../data/menu.json');
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

confirmOrder.command('home',async (ctx) => {

    try{
        await ctx.deleteMessage(ctx.message.message_id).catch(e=>{
            console.log('Delete message error\n', e)
        });

        await ctx.deleteMessage(ctx.session.keyboardMessageId).catch(e=>{
            console.log('Delete message error\n', e)
        });

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
    }catch (e) {
        console.error('confirmOrder /home error\n', e);
    }
});

confirmOrder.hears('⬅️Вернуться к меню', async ctx => {
    try {

        await ctx.deleteMessage(ctx.message.message_id).catch(e=>{
            console.log('Delete message error\n', e)
        });

        await ctx.deleteMessage(ctx.session.keyboardMessageId).catch(e=>{
            console.log('Delete message error\n', e)
        });

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
        console.error('confirmOrder hears error\n', e);
    }
});

confirmOrder.on('text', async (ctx) => {
    try{
        await ctx.deleteMessage(ctx.message.message_id).catch(e=>{
            console.log('Delete message error\n', e)
        });
    } catch (e) {
        console.error('confirmOrder text error\n', e);
    }
});

module.exports = confirmOrder;