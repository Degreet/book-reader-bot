module.exports = {
  send(userId, msg, extra) {
    bot.telegram.sendMessage(userId, msg, { parse_mode: "html", ...extra })
  },

  edit(ctx, msg, extra) {
    ctx.deleteMessage()
    ctx.replyWithHTML(msg, extra)
  },

  delLast(ctx) {
    ctx.deleteMessage()
  }
}