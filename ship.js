const Telegraf = require('telegraf');

// Telegram bot token'ını buraya ekleyin veya .env dosyasından alın
const BOT_TOKEN = '6761753644:AAGfrsu3AEL4NN26UW1SIDACwWAsrgV93vE';

// Telegram bot nesnesini oluşturun
const bot = new Telegraf(BOT_TOKEN);

// Kullanıcılar ve ilişkilerin saklandığı bir sözlük
const relationships = {};

// "ship" komutunu işle
bot.command('ship', (ctx) => {
    const userId = ctx.from.id;
    
    // Eğer kullanıcı zaten bir ilişkideyse
    if (userId in relationships) {
        ctx.reply("Zaten bir ilişkiniz var.");
    } else {
        const otherUserId = getOtherUserId(ctx);
        
        // Eğer diğer kullanıcı yoksa
        if (!otherUserId) {
            ctx.reply("Kiminle bir ilişki kurmak istediğini belirtmelisin.");
        } else {
            // İlişkiyi kaydet
            relationships[userId] = otherUserId;
            relationships[otherUserId] = userId;
            ctx.reply("İlişki başarıyla oluşturuldu!");
        }
    }
});

// Verilen mesajdan diğer kullanıcının ID'sini al
function getOtherUserId(ctx) {
    const args = ctx.message.text.split(' ').slice(1);
    const otherUserArg = args[0];
    
    // Eğer argüman bir username ise
    if (otherUserArg.startsWith('@')) {
        const user = bot.telegram.getChat(otherUserArg);
        return user ? user.id : null;
    } 
    // Eğer argüman bir ID ise
    else if (!isNaN(otherUserArg)) {
        return parseInt(otherUserArg);
    } 
    // Geçersiz argüman
    else {
        return null;
    }
}

// Botu başlat
bot.launch();
