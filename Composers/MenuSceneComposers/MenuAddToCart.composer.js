const { Composer } = require('telegraf');
const menuData = require('../../data/menu.json');
const generateMsgAddToCart = require('../../utils/generateMsgAddToCart.js');
const { deleteMessageHandler, deleteAllMessages } = require('../../utils/deleteAllPositionsInChat.js');

const MenuAddToCart = new Composer();

MenuAddToCart.action(/^add_to_cart:/, async (ctx) => {
    try {
        const positionId = ctx.update.callback_query.data.split(':')[1];

        //Delete Menu
        const section = menuData.find(section => section.sectionName === ctx.session.menuSection);
        // for (let i = ctx.session.firstMsgId; i <= ctx.session.firstMsgId + section.menu.length; i++) {
        //     await ctx.deleteMessage(i).catch(e => {
        //         console.log('Delete message error\n', e);
        //     });
        // }
        //
        // //Delete message with keyboard
        // await ctx.deleteMessage(ctx.session.keyboardMessageId).catch(e => {
        //     console.log('Delete message error\n', e);
        // });

        // await deleteMessageHandler(ctx, {
        //     menu: {
        //         menuIndex: ctx.session.firstMsgId,
        //         menuLength: ctx.session.firstMsgId + section.menu.length,
        //     },
        //     single: [ctx.session.keyboardMessageId],
        // });

        await deleteAllMessages(ctx, [...ctx.session.sendedMsg, ctx.session.keyboardMessageId]);

        //Adding position data to session
        const position = section.menu.find(position => position.id.toString() === positionId);
        ctx.session.addToCart = {
            ...position,
            count: 1,
        };

        //Send message with confirming addToCart
        const messageParams = generateMsgAddToCart(ctx);
        await ctx.reply(messageParams.text, messageParams.extra)
            .then(res => {
                //Set new first message
                ctx.session.sendedMsg.push(res.message_id);
            },
            );

        //Entering addToCart scene
        await ctx.scene.enter('addToCart');

    } catch (e) {
        console.error('Menu action error\n', e);
    }
});

module.exports = MenuAddToCart;
