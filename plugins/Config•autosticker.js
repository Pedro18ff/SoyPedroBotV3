import { sticker } from '../lib/sticker.js'

let handler = m => m

handler.all = async function (m) {
  let chat = global.db.data.chats[m.chat]
  let user = global.db.data.users[m.sender]

  if (chat.autosticker && m.isGroup) {
    let q = m
    let stiker = false
    let mime = (q.msg || q).mimetype || q.mediaType || ''

    if (/webp/g.test(mime)) return

    if (/image/g.test(mime)) {
      let img = await q.download?.()
      if (!img) return
      stiker = await sticker(img, false, packname, author)

    } else if (/video/g.test(mime)) {
      if ((q.msg || q).seconds > 8)
        return await m.reply('᥀·࣭࣪̇˖🚩◗  *El video no debe de durar más de 7 segundos, intentalo de nuevo.*')

      let vid = await q.download()
      if (!vid) return
      stiker = await sticker(vid, false, packname, author)

    } else if (m.text.split(/\n| /i)[0]) {
      if (isUrl(m.text)) {
        stiker = await sticker(false, m.text.split(/\n| /i)[0], packname, author)
      } else return
    }

    if (stiker) {
      await conn.sendMessage(m.chat, {
        sticker: stiker,
        contextInfo: {
          forwardingScore: 200,
          isForwarded: false,
          externalAdReply: {
            showAdAttribution: false,
            title: packname,
            body: author,
            mediaType: 2,
            thumbnail: icons,
            sourceUrl: redes
          }
        }
      }, { quoted: m })
    }
  }

  return !0
}

export default handler

const isUrl = (text) => {
  return text.match(
    /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)(jpe?g|gif|png|mp4)/gi
  )
}