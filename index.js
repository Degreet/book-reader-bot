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

  check.candidate({ userId }, () => { }, async () => {
    await users.insertOne({
      userId
    })
  })
})

bot.on("document", async ctx => {
  const userId = ctx.from.id

  check.candidate({ userId }, async user => {
    if (user.inRead) {
      msg.edit(ctx, "Для начала дочитайте книгу, или отмените её чтение!")
    } else {
      const fileId = ctx.message.document.file_id
      const fileLink = await bot.telegram.getFileLink(fileId)
      https.get(fileLink, resp => {
        const file = fs.createWriteStream("books/_" + ctx.message.document.file_name)
        resp.pipe(file)
        resp.on("end", () => {
          fs.readFile(`books/_${ctx.message.document.file_name}`, async (err, buffer) => {
            const text = buffer.toString()
            const parts = splitText(text, 1000)

            await books.insertOne({
              userId,
              parts: parts.map((part, i) => ({
                part,
                id: i
              }))
            })

            await users.updateOne({ userId }, {
              $set: {
                inRead: true
              }
            })

            msg.edit(ctx, parts[0], m.build([m.cbb("Далее", `next_2`)]))
          })
        })
      })
    }
  }, ctx)
})

client.connect(err => {
  global.users = client.db(dbName).collection("users")
  global.books = client.db(dbName).collection("books")
  global.bot = bot
  bot.launch()
})