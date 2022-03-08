const {
    WAConnection,
    MessageType,
    Presence,
    Mimetype,
    GroupSettingChange
} = require('@adiwajshing/baileys')
const fs = require('fs')
const { banner, start, success } = require('./lib/functions')
const { color } = require('./lib/color')
const set = JSON.parse(fs.readFileSync('./app.json'))
const sesName = set.sesionName

require('./RDev.js')
nocache('./RDev.js', module => console.log(`${module} is now updated!`))

const starts = async (rdev = new WAConnection()) => {
    rdev.version = [2, 2143, 3];
    rdev.browserDescription = ["R - Dev Team", "safari", "windows 10"];
    rdev.logger.level = 'warn'
    console.log(banner.string)
    rdev.on('qr', () => {
        console.log(color('[','white'), color('!','red'), color(']','white'), color(' Scan QR...'))
    })

    fs.existsSync(`./session.json`) && rdev.loadAuthInfo(`./session.json`)
    rdev.on('connecting', () => {
        start('2', 'Connecting...')
    })
    rdev.on('open', () => {
        success('2', 'Connected')
    })
    await rdev.connect({timeoutMs: 30*1000})
        fs.writeFileSync(`.session.json`, JSON.stringify(rdev.base64EncodedAuthInfo(), null, '\t'))

    rdev.on('chat-update', async (message) => {
        require('./RDev.js')(rdev, message)
    })
}

/**
 * Uncache if there is file change
 * @param {string} module Module name or path
 * @param {function} cb <optional> 
 */
function nocache(module, cb = () => { }) {
    console.log('Module', `'${module}'`, 'is now being watched for changes')
    fs.watchFile(require.resolve(module), async () => {
        await uncache(require.resolve(module))
        cb(module)
    })
}

/**
 * Uncache a module
 * @param {string} module Module name or path
 */
function uncache(module = 'R') {
    return new Promise((resolve, reject) => {
        try {
            delete require.cache[require.resolve(module)]
            resolve()
        } catch (e) {
            reject(e)
        }
    })
}

starts()
