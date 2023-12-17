const { Composer } = require('telegraf');
const viewCartFunc = require('../../utils/viewCartFunc');

const ViewCartActionAddCount = new Composer()

ViewCartActionAddCount.action(/^add_to_cart:/, async (ctx) => {
   try {

      const positionId = ctx.update.callback_query.data.split(':')[1];
      const position = ctx.session.userData.cart(position => position.id.toString() === positionId);
      //Add one count to session
      ctx.session.addToCart.count += 1;


      //Edit message
      const messageParams = viewCartFunc(position);
      await ctx.editMessageText(messageParams.text, messageParams.extra);


      let totalCartPrice = 0;
      for (const position of ctx.session.userData.cart) {
         let totalPositionPrice = position.count * Number(position.price.match(/(\d+)/)[0]);
         totalCartPrice += totalPositionPrice;
      }
      await ctx.telegram.editMessageText(ctx.chat.id,
         ctx.session.sendedMsg[sendedMsg.length - 1],
         null,
         `Общаяя сумма: ${totalCartPrice}`
      );

   } catch (e) {
      console.error('addToCart addCount action error\n', e);
   }
});

module.exports = ViewCartActionAddCount