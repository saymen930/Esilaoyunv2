////////////////////////////////////////
// Başka github hesabına yükləməy olmaz
// Reponu öz adına çıxaran peysərdi...!!!


require("dotenv").config();

const { Telegraf, Telegram } = require("telegraf")

const TOKEN = "6416839013:AAG3WiQYyzjNvbaw_Kwi3iSn3ZMzsUuKjBI";

const ID_BOT = "6416839013"


const config = require("./config")
const db = require("./veritabani/db")
const fs = require("fs")
const {randomResim, Degisken, ArtiEksi, HusnuEhedov, kullaniciProfil} = require("./eklenti")
const telegram = new Telegram("6416839013:AAG3WiQYyzjNvbaw_Kwi3iSn3ZMzsUuKjBI")
const bot = new Telegraf("6416839013:AAG3WiQYyzjNvbaw_Kwi3iSn3ZMzsUuKjBI")
const path = require("path")
const dbfile = path.resolve(__dirname, "./veritabani/db.json")

let oyunDurumuHusnuEhedov = {}

/// /// /// /// /// /// ///  <!-- VERİTABANI SUPERGROUP(-100) İD ÇEKME --> /// /// /// /// /// /// /// /// /// /// /// /// /// /// /// /// /// /// 

bot.command("txt", async (ctx) => {
    fs.readFile(dbfile, 'utf8', async function(err, doc) {
        var comments = doc.match(/-\d+/g);
        var comments = doc.match(/-100\d+/g);
        if (comments && comments.length > 0) {
            const arr = [];
            for (let i in comments) {
                ctx.telegram.getChat(comments[i]).then(async function (result) {
                    const Usercount = await ctx.telegram.getChatMembersCount(result.id)
                    const text = JSON.stringify(`${result.title} | ${result.id} | UserSayı: ${Usercount}`).replace(/"/g, '')
                    arr.push(text);
                    const stream = fs.createWriteStream('./gruplar.txt');
                    stream.write(arr.join('\n'))
                })
            }
            await bot.telegram.sendDocument(ctx.chat.id, {
                source: './gruplar.txt'
            }, {
                filename: 'gruplar.txt',
                caption: `<b>Grup Döküman:  ${comments.length}</b>`,
                parse_mode: 'HTML'
            })
        } else {
            ctx.reply('Botta henüz oyun oynanmadı.')
        }
    })
});

bot.command("grupsayi", async (ctx) => {
    fs.readFile(dbfile, 'utf8', async function(err, doc) {
        var comments = doc.match(/-100\d+/g);
        if (comments && comments.length > 0) {
            await ctx.replyWithHTML(`<i>Grup sayısı:  ${comments.length}</i>`)
        } else {
            ctx.reply('Botta henüz oyun oynanmadı.')
        }
    })
});


/// /// /// /// /// /// ///  <!-- CONST SABİT TANIMLANANLAR --> /// /// /// /// /// /// /// /// /// /// /// /// /// /// /// /// /// /// /// 

const OyunYaratHusnuEhedov = chatId => {
	oyunDurumuHusnuEhedov[chatId] = {
		timeouts: {},
		guessMessage: null,
		currentRound: null,
		currentTime: 0, 
		answersOrder: []
	}
	return oyunDurumuHusnuEhedov[chatId]
}

const ozelMesaj = isGroup => Degisken(`
    *Merhaba, ben yaş tahmin oyun botuyum 😆*\n\n_Grubuna ekle ve eğlenmeye başla:D_ ~👇Komutlar tuşu aşağıda👇~
    ${isGroup ? "" : ""}
`)


const YasOyunBaslat = () => {  // OYUN RESİM ALMASI GEREK DOSYA KONUM 
	let imagePath = "./resimler"
	let fimeName = randomResim(fs.readdirSync(imagePath))
	let age = Number(fimeName.match(/^(\d+)/)[1])
	return {
		age: age,
		photo: `${imagePath}/${fimeName}`
	}
}
const NesneYenileHusnuEhedov = (obj, f) => {
	let index = 0
	for (let key in obj) {
		f(key, obj[key], index)
		index++
	}
}
const dbChatAlHusnuEhedov = chatId => {  // CHAT ID ALMASI
	let data = {
		isPlaying: true,
		members: {}
	}
	db.insert(chatId, data)
}
const dbUserAlHusnuEhedov = firstName => {  // KULLANICI ADI, PUAN ALMASI
	return {
		firstName: firstName,
		isPlaying: true,
		answer: null,
		gameScore: 0,
		totalScore: 0
	}
}
const getChat = chatId => {
	return db.get(chatId)
}
const OyunDurdurHusnuEhedov = (ctx, chatId) => {
	let chat = getChat(chatId)
	if (chat && chat.isPlaying) {
		if (oyunDurumuHusnuEhedov[chatId] && oyunDurumuHusnuEhedov[chatId].timeouts) {
			for (let key in oyunDurumuHusnuEhedov[chatId].timeouts) {
				clearTimeout(oyunDurumuHusnuEhedov[chatId].timeouts[key])
			}
		}
		chat.isPlaying = false
		let top = []
		NesneYenileHusnuEhedov(chat.members, (memberId, member, memberIndex) => {
			if (member.isPlaying) {
				top.push({
					firstName: member.firstName,
					score: member.gameScore
				})

				Object.assign(member, {
					answer: null,
					isPlaying: false,
					gameScore: 0
				})
			}
		})
		db.update(chatId, ch => chat)
		if (top.length > 0) {
			ctx.replyWithMarkdown(Degisken(`
				*🌟 Kazananlar Sıralaması:*

				${top.sort((a, b) => b.score - a.score).map((member, index) => `${["🥇","🎖","🏅"][index] || "🔸"} ${index + 1}. *${member.firstName}*: ${member.score} ${HusnuEhedov(member.score, "puan 🎁", "puan 🎁", "puan 🎁")}`).join("\n")}
			`))
		}
	}
	else {
		ctx.reply("🆘 Oyun başlamadı... 🙅🏻\nOyunu Başlat ➡️  /game")
	}
}
const RaundMesajHusnuEhedov = (chatId, round, time) => {
	let chat = getChat(chatId)
	let answers = []
	NesneYenileHusnuEhedov(chat.members, (memberId, member, memberIndex) => {
		if (member.isPlaying && member.answer !== null) {
			answers.push({
				answer: member.answer,
				firstName: member.firstName,
				memberId: Number(memberId)
			})
		}
	})
	answers = answers.sort((a, b) => oyunDurumuHusnuEhedov[chatId].answersOrder.indexOf(a.memberId) - oyunDurumuHusnuEhedov[chatId].answersOrder.indexOf(b.memberId))

	return Degisken(`
		*🔹 Raund ${round + 1}/10*
		❓ Sizce bu kişi kaç yaşında
		${answers.length > 0 ? 
			`\n${answers.map((member, index) => `${index + 1}. *${member.firstName}*: ${member.answer}`).join("\n")}\n`
			:
			""
		}
		${"◾️".repeat(time)}${"▫️".repeat(config.emojiSaniye - time)}
	`)
}
const OyunHusnuEhedov = (ctx, chatId) => {
	let gameState = OyunYaratHusnuEhedov(chatId)
	let startRound = async round => {
		let person = YasOyunBaslat()
		let rightAnswer = person.age
		let guessMessage = await ctx.replyWithPhoto({
			source: person.photo,
		}, {
			caption: RaundMesajHusnuEhedov(chatId, round, 0),
			parse_mode: "Markdown"
		})
		gameState.currentTime = 0
		gameState.guessMessageId = guessMessage.message_id
		gameState.currentRound = round

		let time = 1
		gameState.timeouts.timer = setInterval(() => {
			gameState.currentTime = time
			telegram.editMessageCaption(
				ctx.chat.id,
				guessMessage.message_id,
				null,
				RaundMesajHusnuEhedov(chatId, round, time),
				{
					parse_mode: "Markdown"
				}
			)
			time++
			if (time >= (config.emojiSaniye + 1)) clearInterval(gameState.timeouts.timer)
		}, 30000 / (config.emojiSaniye + 1))
		
		gameState.timeouts.round = setTimeout(() => {
			let chat = getChat(chatId)
			let top = []
			NesneYenileHusnuEhedov(chat.members, (memberId, member, memberIndex) => {
				if (member.isPlaying) {
					let addScore = member.answer === null ? 0 : rightAnswer - Math.abs(rightAnswer - member.answer)
					chat.members[memberId].gameScore += addScore
					chat.members[memberId].totalScore += addScore
					top.push({
						firstName: member.firstName,
						addScore: addScore,
						answer: member.answer
					})
					member.answer = null
					db.update(chatId, ch => chat)
				}
			})
			db.update(chatId, ch => chat)
			
			if (!top.every(member => member.answer === null)) {
				ctx.replyWithMarkdown(
					Degisken(`
						✅ Fotoğraftaki Kişi: *${rightAnswer} ${HusnuEhedov(rightAnswer, "yaşında", "yaşında", "yaşında")}*\n*⭐️Puan Kazananlar:*

						${top.sort((a, b) => b.addScore - a.addScore).map((member, index) => `${["🥇","🎖","🏅"][index] || "🔸"} ${index + 1}. *${member.firstName}*: ${ArtiEksi(member.addScore)}`).join("\n")}
					`),
					{
						reply_to_message_id: guessMessage.message_id,
					}
				)
			}
			else {
				ctx.reply("Cevap verilmedi, Oyun Durduruldu❕")
				OyunDurdurHusnuEhedov(ctx, chatId)
				return
			}

			if (round === 10 - 1) {
				gameState.timeouts.OyunDurdurHusnuEhedov = setTimeout(() => {
					OyunDurdurHusnuEhedov(ctx, chatId)
				}, 1000)
			}
			else {
				gameState.answersOrder = []
				gameState.timeouts.afterRound = setTimeout(() => {
					startRound(++round)
				}, 2500)
			}
		}, 30000)
	}
	gameState.timeouts.beforeGame = setTimeout(() => {
		startRound(0)
	}, 1000)
}
/// /// /// /// /// /// ///  <!-- CONST SABİT TANIMLANANLAR SON--> /// /// /// /// /// /// /// /// /// /// /// /// /// /// /// /// /// /// /// 





bot.command("game", (ctx) => {
	let message = ctx.update.message
	if (message.chat.id < 0) {
		let chatId = message.chat.id
		let chat = getChat(chatId)
		if (chat) {
			if (chat.isPlaying) {
				return ctx.reply("❗️ Oyun şuan aktif, durdurmak için /stop.")
			}
			else {
				chat.isPlaying = true
				for (let key in chat.members) {
					let member = chat.members[key]
					member.gameScore = 0
				}
				db.update(chatId, ch => chat)
			}
		}
		else {
			dbChatAlHusnuEhedov(chatId)
		}
		ctx.replyWithHTML(`<b><a href="tg://user?id=${ctx.from.id}">${ctx.from.first_name}</a> Tarafından,\n\nYaş Tahmin Oyunu Başladı 🎉</b>`)
		OyunHusnuEhedov(ctx, chatId)
	}
	else {
		ctx.reply("🛑 Bu komut gruplar için geçerli")
	}
})



bot.command("stop", (ctx) => {
    let message = ctx.update.message
    if (message.chat.id < 0) {
        let chatId = message.chat.id
        OyunDurdurHusnuEhedov(ctx, chatId)
    }
    else {
        ctx.reply("🛑 Bu komut gruplar için geçerli")
    }
})


/// /// /// /// /// /// ///  <!-- GRUB KULLANICI RATING --> /// /// /// /// /// /// /// /// /// /// /// /// /// /// /// /// /// /// /// 

bot.command("top", (ctx) => {
	let message = ctx.update.message
	if (message.chat.id < 0) {
		let chatId = message.chat.id
		let chat = getChat(chatId)
		if (chat) {
			let top = []
			NesneYenileHusnuEhedov(chat.members, (memberId, member, memberIndex) => {
				top.push({
					firstName: member.firstName,
					score: member.totalScore
				})

				Object.assign(member, {
					answer: null,
					isPlaying: false,
					gameScore: 0
				})
			})
			if (top.length > 0) {
				ctx.replyWithMarkdown(Degisken(`
*✅ Grup En İyi TOP 20 Oyuncu:*

${top.sort((a, b) => b.score - a.score).slice(0, 20).map((member, index) => `${["","",""][index] || ""} ${index + 1}) *${member.firstName}*: ${member.score} ${HusnuEhedov(member.score, "puan🎁", "puan🎁", "puan🎁")}`).join("\n")}
				`))
			}
			else {
				ctx.reply("❗️ Bu grupta hiç oyun oynamadınız")
			}
		}
		else {
			ctx.reply("🛑 Bu komut gruplar için geçerli")
		}
	}
	else {
		ctx.reply("🛑 Bu komut gruplar için geçerli")
	}
})
/// /// /// /// /// /// ///  <!-- GRUB KULLANICI RATING SON --> /// /// /// /// /// /// /// /// /// /// /// /// /// /// /// /// /// /// /// 





/// /// /// /// /// /// ///  <!-- GLOBAL KULLANICI RATING --> /// /// /// /// /// /// /// /// /// /// /// /// /// /// /// /// /// /// /// 
bot.command("g", (ctx) => {
    fs.readFile(dbfile, 'utf8', async function(err, doc) {
        var comments = doc.match(/-100\d+/g)
        let top = []
        if (comments && comments.length > 0) {
            for (let i in comments) {
                let chatId = comments[i]
                let chat = getChat(chatId)
                NesneYenileHusnuEhedov(chat.members, (memberId, member, memberIndex) => {
                    top.push({
                        firstName: member.firstName,
                        score: member.totalScore
                    })

                    Object.assign(member, {
                        answer: null,
                        isPlaying: true,
                        gameScore: 0
                    })
                })
            }
            if (top.length > 0) {
                ctx.replyWithHTML(Degisken(`
     <b>🎖Gruplar Üzre En İyi Top-20</b>\n
${(top).sort((a, b) => b.score - a.score).slice(0, 20).map((member, index) => `${["🥇","🥈","🥉"][index] || "🎲"} ${index + 1}) <b><i>${member.firstName} → ${member.score} ${HusnuEhedov(member.score, "puan", "puan", "puan")}</i></b>`).join("\n")}
                `))
            }
        }
    })
})
/// /// /// /// /// /// ///  <!-- GLOBAL KULLANICI RATING SON --> /// /// /// /// /// /// /// /// /// /// /// /// /// /// /// /// /// /// /// 



bot.command("yardim", (ctx) => {
    return ctx.replyWithMarkdown(Degisken(`
        `))
})

bot.command("kullanici", async (ctx) => {
    const Id = ctx.message.reply_to_message ? ctx.message.reply_to_message.from.id : ctx.message.from.id;
    const messageId = ctx.message.reply_to_message ? ctx.message.reply_to_message.message_id : null;
    const photoInfo = await ctx.telegram.getUserProfilePhotos(Id);
    
    const getUserInfo = await ctx.telegram.getChat(Id);
    const getUser = [getUserInfo].map(kullaniciProfil).join(', ')
    if (photoId) {
        return ctx.replyWithPhoto(photoId, { caption: getUser, parse_mode: 'HTML', reply_to_message_id: messageId  })
    } else {
        return ctx.replyWithHTML(getUser,  { reply_to_message_id: messageId })
    }
});

bot.command('id', async (ctx, next) => {
	if (ctx.chat.type !== "supergroup") return null;
    const chatBio = ctx.chat.description
    await ctx.telegram.sendMessage(ctx.chat.id, `<b>Grup</b>\n🆔:<code>${ctx.chat.id}</code>\nİsim: <code>${ctx.chat.title}</code>`, { parse_mode: 'HTML' }) 
    return next();
});



/// /// /// /// /// /// ///  <!-- BOT START MENÜ --> /// /// /// /// /// /// /// /// /// /// /// /// /// /// /// /// /// ///

bot.start(async (ctx) => {
    await ctx.replyWithMarkdown(ozelMesaj(ctx.update.message.chat.id < 0),{
        reply_markup:{
            inline_keyboard:[
                [{text:'Botu Gruba Ekle ✅', url:`https://t.me/yarrakbot?startgroup=true`}],
                [{text:'Resmi Kanalımız 📣', callback_data:`kanals`},{text:'KOMUTLAR 💎', callback_data:'vip'}]
            ]
        }
    })
})

bot.action('start', ctx=>{
    
    ctx.editMessageText(`*Merhaba, ben yaş tahmin oyun botuyum 😆*\n\n_Grubuna ekle ve eğlenmeye başla:D_ ~👇Komutlar tuşu aşağıda👇~
        `,{
        parse_mode: "Markdown",
        reply_markup:{
            inline_keyboard:[
                [{text:'Botu Gruba Ekle ✅', url:`t.me/yarrakbot?startgroup=true`}],
                [{text:'Resmi Kanalımız 📣', callback_data:`kanals`},{text:'KOMUTLAR 💎', callback_data:'vip'}]
            ]
        }
    })
})

bot.action('kanals', (ctx) => {
    ctx.editMessageText(`*Resmi kanallarımız😉*`,{
   
        parse_mode: "Markdown",
        reply_markup:{
            inline_keyboard:[
                [{text:'Kanal 🇹🇷', url:`t.me/yasgamerobotchannel`}],
                [{text:'Chat 🇹🇷', url:`t.me/yasgamerobotchat`}],
                [{text:'Azerbaycan Kanalları 🇦🇿', callback_data:`azer`}],
                [{text:'Geri 🔙', callback_data:`start`}]
                ]}})
});

bot.action('azer', (ctx) => {
    ctx.editMessageText(`*AZERBAYCAN KANALLARI*\n\n_Şuan da mevcut değil_`,{
        parse_mode: "Markdown",
        reply_markup:{
            inline_keyboard:[
                [{text:'Türkiye kanalları 🇹🇷', callback_data:`kanals`}],
                [{text:'Ana menü ⬅️', callback_data:`start`}]]}})
})
bot.action('vip', ctx=>{
    
    ctx.editMessageText(`*Merhaba! "Tahmin" oyunu için
        oluşturulmuş bir botum🤖*
        🆘*Bot yalnızca gruplar için tasarlanmıştır!*
        
        _ℹ️Kurallar budur : Sana resimler atıyorum ve sen kategoriye uygun rakamlarla tahmin etmelisin🕵🏼‍♂️,İlk olarak gruba ekle ve Grupda medya izni açık olsun unutma! veya Botu yönetici yapın_🗣
        _Sonra Komutlarla oyunu başlatın_🎯
        
          *Temel Komutların Listesi👇🏻*
          
          🎲 /game - _Oyunu Başlat_
          ⛔️ /stop - _Oyunu durdurmak_
          📊 /top - _Oyuncuların puanı gösterir_
         _🌍 /g - Global Puanlar_
          👤 /kullanici - _Kullanıcı hakkında bilgi_
          🆔 /id - _Grup infosu_\n\n*MEDYA İZNİ VEYA YÖNETİCİLİK OLMALI*`,{
        parse_mode: "Markdown",
        reply_markup:{
            inline_keyboard:[
                
                [{text:'🔙 Geri', callback_data:'start'}]
            ]
        }
    })
})


/// /// /// /// /// /// ///  <!-- BOT START MENÜ SON --> /// /// /// /// /// /// /// /// /// /// /// /// /// /// /// /// /// /// /// 





bot.on("message", async (ctx) => {
	let message = ctx.update.message
	if (message.chat.id < 0) {
		let chatId = message.chat.id
		let fromId = message.from.id
		let chat = getChat(chatId)
		if (
			chat && 
			chat.isPlaying && 
			(chat.members[fromId] === undefined || chat.members[fromId].answer === null) && 
			oyunDurumuHusnuEhedov && 
			/^-?\d+$/.test(message.text)
		) {
			let firstName = message.from.first_name
			let answer = Number(message.text)
			if (answer <= 0 || answer > 100) {
				return ctx.reply(
					"Geçersiz! 1 -100",
					{
						reply_to_message_id: ctx.message.message_id,
					}
				)
			}
			if (!chat.members[fromId]) { 
				chat.members[fromId] = dbUserAlHusnuEhedov(firstName)
			}
			Object.assign(chat.members[fromId], {
				isPlaying: true,
				answer: answer,
				firstName: firstName
			})
			oyunDurumuHusnuEhedov[chatId].answersOrder.push(fromId)

			db.update(chatId, ch => chat)

			telegram.editMessageCaption(
				chatId,
				oyunDurumuHusnuEhedov[chatId].guessMessageId,
				null,
				RaundMesajHusnuEhedov(chatId, oyunDurumuHusnuEhedov[chatId].currentRound, oyunDurumuHusnuEhedov[chatId].currentTime),
				{
					parse_mode: "Markdown"
				}
			)
		}
		else if (message.new_chat_member && message.new_chat_member.id === 6609532867) { /// Bot Yeni Qruba Eklendi Mesaj
			ctx.replyWithMarkdown(ozelMesaj(true))
		}
	}
})


// Olumsuz Hata versede çalışmaya devam eder
bot.catch((err) => {
    console.log('Error: ', err)
})

// Botun nickname alan kod
bot.telegram.getMe().then(botInfo => {
    bot.options.username = botInfo.username
    console.log(`Sistem Aktifleşti => @${bot.options.username}`)
})

bot.launch();
