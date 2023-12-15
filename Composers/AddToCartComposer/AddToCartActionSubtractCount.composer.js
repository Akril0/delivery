const {Composer} = require('telegraf');
const generateMsgAddToCart = require('../../utils/generateMsgAddToCart.js');

const AddToCartActionSubtractCount = new Composer();

AddToCartActionSubtractCount.action('subtractCount', async (ctx) => {
    try {
        //Subtract one count from session
        if (ctx.session.addToCart.count !== 1) {
            ctx.session.addToCart.count -= 1;
        }

        //Edit message
        const messageParams = generateMsgAddToCart(ctx);
        await ctx.editMessageText(messageParams.text, messageParams.extra);
    } catch (e) {
        console.error('addToCart subtractCount action error\n', e);
    }
});

module.exports = AddToCartActionSubtractCount;