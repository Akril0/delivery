const { Composer } = require('telegraf');
const generateMsgAddToCart = require('../../utils/generateMsgAddToCart.js');

const AddToCartHearsNumberComposer = new Composer();

AddToCartHearsNumberComposer.hears(/(\d+)/, async (ctx) => {
    try {
        //Rewrite count to new value
        ctx.session.addToCart.count = Number(ctx.message.text);

        //Delete user message
        await ctx.deleteMessage(ctx.message.message_id).catch(e => {
            console.log('Delete message error\n', e);
        });

        //Edit message
        const messageParams = generateMsgAddToCart(ctx);
        await ctx.telegram.editMessageText(ctx.chat.id,
            ctx.session.session[0],
            null,
            messageParams.text,
            messageParams.extra);

    } catch (e) {
        console.error('addToCart hears error\n', e);
    }
});

module.exports = AddToCartHearsNumberComposer;