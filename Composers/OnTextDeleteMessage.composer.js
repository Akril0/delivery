const {Composer} = require('telegraf');

const OnTextDeleteMessageComposer = new Composer();

OnTextDeleteMessageComposer.on('text', async (ctx) => {
    try {
        await ctx.deleteMessage(ctx.message.message_id).catch(e => {
            console.log('Delete message error\n', e);
        });
    } catch (e) {
        console.error('viewCart text error\n', e);
    }
});

module.exports = OnTextDeleteMessageComposer;