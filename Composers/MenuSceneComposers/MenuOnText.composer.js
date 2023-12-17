const { Composer, Extra, Markup } = require('telegraf');
const sectionsList = require('../../utils/sectionsList.js');
const {
    deleteAllPositionsInChat,
    deleteMessageHandler,
    deleteAllMessages
} = require('../../utils/deleteAllPositionsInChat.js');
const menuData = require('../../data/menu.json');

const MenuOnText = new Composer();

MenuOnText.on('text', async (ctx) => {
    try {
        //Check if send a menu navigate button message
        if (sectionsList(menuData).includes(ctx.message.text)) {
            //Delete Menu
            const section = menuData.find(section => section.sectionName === ctx.session.menuSection);
            // await deleteMessageHandler(ctx, {
            //     menu: {
            //         menuIndex: ctx.session.firstMsgId,
            //         menuLength: ctx.session.firstMsgId + section.menu.length,
            //     },
            //     single: [ctx.message.message_id],
            // });


            await deleteAllMessages(ctx, [...ctx.session.sendedMsg, ctx.message.message_id]);


            //Save name of new section
            ctx.session.menuSection = ctx.message.text;

            //Entering menu scene
            await ctx.scene.enter('menu');
        }

        //Check if send a cart button message
        else if (ctx.message.text === '🛒Корзина') {

            const section = menuData.find(section => section.sectionName === ctx.session.menuSection);
            // await deleteMessageHandler(ctx, {
            //     menu: {
            //         menuIndex: ctx.session.firstMsgId,
            //         menuLength: ctx.session.firstMsgId + section.menu.length,
            //     },
            //     single: [ctx.session.keyboardMessageId, ctx.message.message_id],
            // });

            await deleteAllMessages(ctx, [...ctx.session.sendedMsg, ctx.session.keyboardMessageId, ctx.message.message_id]);

            //Entering viewCart scene
            await ctx.scene.enter('viewCart');
        }

        //Check if send a confirm button message
        else if (ctx.message.text === '✅Подтвердить заказ') {


            const section = menuData.find(section => section.sectionName === ctx.session.menuSection);
            // await deleteMessageHandler(ctx, {
            //     menu: {
            //         menuIndex: ctx.session.firstMsgId,
            //         menuLength: ctx.session.firstMsgId + section.menu.length,
            //     },
            //     single: [ctx.session.keyboardMessageId, ctx.message.message_id],
            // });

            await deleteAllMessages(ctx, [...ctx.session.sendedMsg, ctx.session.keyboardMessageId, ctx.message.message_id]);

            await ctx.scene.enter('confirmOrder');
        } else {
            await ctx.deleteMessage(ctx.message.message_id).catch(e => {
                console.log('Delete message error\n', e);
            });
        }
    } catch (e) {
        console.error('Menu on text error\n', e);
    }

});

module.exports = MenuOnText;