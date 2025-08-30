import axios from 'axios'
const { generateWAMessageContent, generateWAMessageFromContent, proto } = (await import('@whiskeysockets/baileys')).default

let handler = async (m, { conn }) => {
  const proses = '> *_🍁 Obteniendo información de los creadores..._*'
  await conn.sendMessage(m.chat, { text: proses }, { quoted: m })

  async function createImage(url) {
    const msg = await generateWAMessageContent({ image: { url } }, {
      upload: conn.waUploadToServer
    })
    return msg.imageMessage
  }

  const owners = [
    {
      name: 'Ado',
      desc: 'Creador Principal de 𝖠𝖨 | Pedro 🧃',
      image: 'https://iili.io/KJXfhmJ.jpg',
      buttons: [
        { name: '🌴 WhatsApp', url: 'https://wa.me/51994884471' },
        { name: '🥞 Canal OFC', url: 'https://whatsapp.com/channel/0029Vb6pxnHJf05UZAFuVX2P' },
        { name: '🧃 Grupo', url: 'https://chat.whatsapp.com/Jbi0UN57afA7rN8RyvqwDX' },
        { name: '🍂 API', url: 'https://myapiadonix.vercel.app' }
      ]
    },
    {
      name: 'Pedro S Torres',
      desc: 'Colaborador de 𝖠𝖨 | Pedro1M 🧃',
      image: 'https://iili.io/KJXfymb.jpg',
      buttons: [
        { name: '🦖 WhatsApp', url: 'https://wa.me/51994884471' },
        { name: '💎 Github', url: 'https://github.com/Pedro18ff' }
      ]
    }
  ]

  let cards = []

  for (let owner of owners) {
    const imageMsg = await createImage(owner.image)

    let formattedButtons = owner.buttons.map(btn => ({
      name: 'cta_url',
      buttonParamsJson: JSON.stringify({
        display_text: btn.name,
        url: btn.url
      })
    }))

    cards.push({
      body: proto.Message.InteractiveMessage.Body.fromObject({
        text: `🦞 *${owner.name}*\n${owner.desc}`
      }),
      footer: proto.Message.InteractiveMessage.Footer.fromObject({
        text: '> 🍿 Conoce más sobre nuestros creadores siguiendo sus redes sociales. Haz clic en cualquier botón para acceder a sus perfiles.\nSi te gustaría apoyarlos, puedes dejar tu estrellita en el repo: github.com/Pedro18ff/SoyPedroBotV3'
      }),
      header: proto.Message.InteractiveMessage.Header.fromObject({
        hasMediaAttachment: true,
        imageMessage: imageMsg
      }),
      nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({
        buttons: formattedButtons
      })
    })
  }

  const slideMessage = generateWAMessageFromContent(m.chat, {
    viewOnceMessage: {
      message: {
        messageContextInfo: {
          deviceListMetadata: {},
          deviceListMetadataVersion: 2
        },
        interactiveMessage: proto.Message.InteractiveMessage.fromObject({
          body: proto.Message.InteractiveMessage.Body.create({
            text: '🙀 Creadores de 𝖠𝖨 | Pedro 🧃 ⚘️'
          }),
          footer: proto.Message.InteractiveMessage.Footer.create({
            text: '🎋 Conoce a los desarrolladores de PedroBot'
          }),
          carouselMessage: proto.Message.InteractiveMessage.CarouselMessage.fromObject({
            cards
          })
        })
      }
    }
  }, {})

  await conn.relayMessage(m.chat, slideMessage.message, { messageId: slideMessage.key.id })
}

handler.help = ['creador']
handler.tags = ['info']
handler.command = ['creador', 'owner', 'creadores', 'owners']

export default handler