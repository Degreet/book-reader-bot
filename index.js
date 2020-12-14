const { Telegraf } = require("telegraf")
const https = require("https")
const fs = require("fs")

const dotenv = require("dotenv")
dotenv.config()

const { TOKEN, KEY } = process.env
const dbName = "book-reader-bot"
const bot = new Telegraf(TOKEN)

const check = require("./modules/check.js")
const msg = require("./modules/msg.js")
const m = require("./modules/m.js")
const splitText = require("./modules/split-text.js")

const { MongoClient, ObjectId } = require('mongodb')
const uri = `mongodb+srv://Node:${KEY}@cluster0-ttfss.mongodb.net/${dbName}?retryWrites=true&w=majority`
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true })

bot.command("start", async ctx => {
  const userId = ctx.from.id
  msg.send(userId, `👋 Привет, <b>${ctx.from.first_name}</b>!`)
})

bot.on("document", async ctx => {
  const fileId = ctx.message.document.file_id
  const fileLink = await bot.telegram.getFileLink(fileId)
  https.get(fileLink, resp => {
    const file = fs.createWriteStream("_" + ctx.message.document.file_name)
    resp.pipe(file)
    file.on("end", () => {
      fs.readFile(`_${ctx.message.document.file_name}`, buffer => {
        const text = buffer.toString()
        msg.edit(ctx, text.slice(0,))
      })
    })
  })
})

client.connect(err => {
  global.users = client.db("serverdb").collection("users")
  global.bot = bot
  bot.launch()
})