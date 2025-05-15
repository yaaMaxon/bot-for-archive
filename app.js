const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors');
const app = express()

const port = 3004

const bot = require("./botInstance");

app.use(bodyParser.json());


app.use(cors());
//add cors checking
app.options('*', cors());

//add this part of code
app.post(`/bot${process.env.TG_BOT_TOKEN}`, (req, res) => {
  bot.processUpdate(req.body);
  res.sendStatus(200);
});

bot.on('message', (msg) => {
  console.log("Your chat ID is:", msg.chat.id);
});

app.post('/requests', (req, res) => {
   const { name, phone, message } = req.body;

  if (!name || !phone || !message) {
    return res.status(400).send('Missing required fields');
  }
const text = `
📬 *Новий запит на послуги*

━━━━━━━━━━━━━━━━━━━━
👤 *Ім’я:* ${name}
📞 *Телефон:* ${phone}
📝 *Повідомлення:*
${message}
━━━━━━━━━━━━━━━━━━━━
⏰ _Надіслано автоматично через сайт_
`;


  const chatId = process.env.CHAT_ID 

  bot.sendMessage(chatId, text, { parse_mode: 'Markdown' })
    .then(() => res.send('Message sent to Telegram!'))
    .catch((err) => {
      console.error('Telegram error:', err.message);
      res.status(500).send('Failed to send message');
    });
})

// setInterval(() => {
//   https.get("https://bot-for-archive.onrender.com");
// }, 45000);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})


