import { areJidsSameUser } from '@whiskeysockets/baileys'

const handler = async (m, { conn, args, participants, command, text }) => {

    const memberIds = participants.map(u => u.id);

    // ===========================
    // Revisar fantasmas
    // ===========================
    let total = 0;
    let ghosts = [];

    for (let userId of memberIds) {
        const userDb = global.db.data.users[userId];
        const userInfo = m.isGroup ? participants.find(u => u.id === userId) : {};
        
        if ((!userDb || userDb.chat === 0) && !userInfo.isAdmin && !userInfo.isSuperAdmin) {
            if (userDb) {
                if (userDb.whitelist === false) {
                    total++;
                    ghosts.push(userId);
                }
            } else {
                total++;
                ghosts.push(userId);
            }
        }
    }

    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    // ===========================
    // Comandos
    // ===========================
    switch (command) {
        case 'fantasmas':
        case 'kickfantasmas':
            if (total === 0) return conn.reply(m.chat, `🎌 *Este grupo es activo, no tiene fantasmas*`, m);

            let messageText = `💥 *REVISIÓN DE FANTASMAS*\n\n⚠️ *Lista de fantasmas*\n`;
            messageText += ghosts.map(v => `@${v.split('@')[0]}`).join('\n');
            messageText += `\n\n*📝 NOTA:*\nEsto no es 100% exacto; el bot cuenta desde que se activa en este número`;

            await conn.sendMessage(m.chat, { text: messageText, mentions: ghosts });

            if (command === 'kickfantasmas') {
                await conn.sendMessage(m.chat, {
                    text: `🚨 _Eliminación de fantasmas iniciando cada 10 segundos_`,
                    mentions: ghosts
                });
                await delay(10000);

                let chat = global.db.data.chats[m.chat];
                chat.welcome = false;

                try {
                    const usersToKick = ghosts.filter(u => !areJidsSameUser(u, conn.user.jid));
                    for (let user of usersToKick) {
                        const participant = participants.find(v => areJidsSameUser(v.id, user));
                        if (user.endsWith('@s.whatsapp.net') && !(participant?.admin)) {
                            await conn.groupParticipantsUpdate(m.chat, [user], 'remove');
                            await delay(10000);
                        }
                    }
                } finally {
                    chat.welcome = true;
                }
            }
            break;
    }
};

handler.tags = ['grupo'];
handler.command = ['fantasmas', 'kickfantasmas'];
handler.group = true;
handler.botAdmin = true;
handler.admin = true;

export default handler;