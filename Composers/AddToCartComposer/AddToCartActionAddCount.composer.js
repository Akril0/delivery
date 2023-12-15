const {Composer} = require('telegraf');
const generateMsgAddToCart = require('../../utils/generateMsgAddToCart.js');

const AddToCartActionAddCount = new Composer();

AddToCartActionAddCount.action('addCount', async (ctx) => {
    try {
        //Add one count to session
        ctx.session.addToCart.count += 1;

        //Edit message
        const messageParams = generateMsgAddToCart(ctx);
        await ctx.editMessageText(messageParams.text, messageParams.extra);
    } catch (e) {
        console.error('addToCart addCount action error\n', e);
    }
});

module.exports = AddToCartActionAddCount;