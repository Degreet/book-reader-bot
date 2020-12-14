module.exports = {
  send(userId, msg, extra) {
    bot.telegram.sendMessage(userId, msg, { parse_mode: "html", ...extra })
  },

  edit(ctx, msg, extra) {
    ctx.editMessageText(msg, { parse_mode: "html", ...extra })
  },

  delLast(ctx) {
    ctx.deleteMessage()
  }
}