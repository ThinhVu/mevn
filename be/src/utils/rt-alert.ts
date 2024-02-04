import {getDiscordBot} from "./discord-bot";
import dayjs from 'dayjs';

export function alert(title: string, content: string) {
  const discordBot = getDiscordBot()
  const body = {
    pid: process.pid,
    pod: process.env.POD_NAME,
    message: content,
    _time: dayjs().format('YYYY-MM-DD HH:mm:ss')
  }
  discordBot.send({
    content: `[${title}]\r\n${JSON.stringify(body)}`
  })
}