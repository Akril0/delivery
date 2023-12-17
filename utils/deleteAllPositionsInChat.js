const menuData = require('../data/menu.json');

const deleteAllPositionsInChat = async (ctx, firstMsgId, length) => {
    for (let i = firstMsgId; i <= length; i++) {
        await ctx.deleteMessage(i).catch(e => {
            console.log('Delete message error\n', e);
        });
    }
};

const deleteOneMessage = async (ctx, index) => {
    await ctx.deleteMessage(index).catch(e => {
        console.log('Delete message error\n', e);
    });
};

const deleteMessageHandler = async (ctx, params = {
    menu: {
        menuIndex: Number,
        menuLength: Number,
    },
    single: []
}) => {
    await deleteAllPositionsInChat(ctx, params.menu.menuIndex, params.menu.menuLength)
    for (let i = 0; i < params.single.length; i++) {
        await deleteOneMessage(ctx, params.single[i])
    }
};

const deleteAllMessages = async (ctx, arrOfId) => {
    arrOfId.forEach(async (id) => {
        await ctx.deleteMessage(id).catch(e => {
            console.log('Delete message error\n', e);
        });
    });
    ctx.session.sendedMsg = [];
}


module.exports.deleteAllPositionsInChat = deleteAllPositionsInChat
module.exports.deleteOneMessage = deleteOneMessage
module.exports.deleteMessageHandler = deleteMessageHandler
module.exports.deleteAllMessages = deleteAllMessages
