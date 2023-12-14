const viewCartFunc = async (ctx, position) => {
    let totalPositionPrice = position.count * Number(position.price.match(/(\d+)/)[0]);
    await ctx.reply(`${position.title}\n` +
        `цена за один: ${position.price}\n` +
        `количество: ${position.count}\n` +
        `общая цена: ${totalPositionPrice}`);
}

module.exports = viewCartFunc;