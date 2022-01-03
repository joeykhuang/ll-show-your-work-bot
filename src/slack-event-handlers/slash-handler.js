const workingDocRecordFromHackMdUrl = require(`../airtable-record-factories/working-doc-from-hackmd-link`)
const { blue, cyan, yellow, magenta, grey } = require(`../utilities/mk-utilities`)
const zk = require(`../utilities/zk-utilities`)
const actionFromCommand = require(`../airtable-record-factories/action-from-command`)

exports.show = async ({ command, ack, say }) => {
    ack();
    console.log(JSON.stringify(command, null, 4))
    console.log(`let's show this: ${command.text}`)
}

exports.saveHackMd = async ({ command, ack, say }) => {
    ack();
    console.log(JSON.stringify(command, null, 4))
    console.log(`let's archive this: ${command.text}`)
    if (isValidHackMdUrl(command.text)) {
        console.log(`looks like a valid hackmd URL`)
        const airtableResult = await workingDocRecordFromHackMdUrl(normalizeHackMdUrl(command.text))
        blue(airtableResult)
        await say(`handling that request to save HackMd. Here's your Json: \n${JSON.stringify(airtableResult, null, 4)}`)
    } else {
        console.log(`looks like this string isn't a valid HackMd URL`)
        console.log(command.text)
        await say(`unfortunately "${command.text}" doesn't look like a valid hackmd url. Don't forget to leave the https etc on the front of it. If you tried this and it still isn't working I really don't know what else to say. Sorry!`)
    }
}

exports.action = async ({ command, ack, say }) => {
    ack();
    const result = await actionFromCommand(command);
    if (result) {
        say({
            text: `got it and it's safe in airtable. click <${process.env.AIRTABLE_ACTION_LINK_PREFIX}${result.id}?blocks=hide|*here*> if you'd like to edit it or just check it out.`,
            unfurl_links: false
        })
    } else {
        say(`no luck--some sort of error happened.`)
    }
}

exports.emoji2Doc = async ({ command, ack, say }) => {
    ack();
    console.log(JSON.stringify(command, null, 4))
    console.log(`let's create an emoji from this string: ${command.text}`)
    if (isValidHttpUrl(command.text)) {
        console.log(`looks like a valid URL`)
    } else {
        console.log(`looks like this string isn't a valid URL`)
        console.log(command.text)
    }
    await say(`handling that request to save HackMd`)
}

exports.rocket = async ({ message, say }) => {
    await say(`thanks for the :rocket:, <@${message.user}>`);
}

function isValidHackMdUrl(string) {
    let url;
    try {
        url = new URL(string);
    } catch (_) {
        return false;  
    }
    return /^https:\/\/hackmd.io\//.test(string) && url.protocol === "http:" || url.protocol === "https:";
}

function isValidHttpUrl(string) {
let url;
try {
    url = new URL(string);
} catch (_) {
    return false;  
}
return url.protocol === "http:" || url.protocol === "https:";
}

function normalizeHackMdUrl(string) {
    return string.split(`?`)[0]
}

exports.corgi = zk.corgi