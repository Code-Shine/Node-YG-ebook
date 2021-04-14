const Base64 = require('js-base64').Base64
const md5 = require('js-md5')
const qs = require('qs')
const http = require('http')
const mp3FilePath = require('./const').mp3FilePath
const resUrl = require('./const').resUrl
const fs = require('fs')

function createVoice(req, res) {
    // const text = req.query.text
    // const lang = req.query.lang
    const text = '测试科大讯飞在线语音合成api的功能，比如说，我们输入一段话，科大讯飞api会在线实时生成语音返回给客户端'
    const lang = 'cn'

    let engineType = 'intp65' // 科大讯飞的中文引擎
    if (lang.toLowerCase() === 'en') { // 如果是英文则是英文的引擎
        engineType = 'intp65_en'
    }
    // 科大讯飞的业务参数
    const speed = '30'
    const voiceParam = {
        auf: 'audio/L16;rate=16000', // 返回语音格式的压缩率
        aue: 'lame',
        voice_name: 'aisjiuxu',
        speed,
        volume: '50',
        pitch: '50',
        engine_type: engineType,
        text_type: 'text'
    }

    const currentTime = Math.floor(new Date().getTime() / 1000)
    const appId = 'df1d8d92'
    const apiKey = '45bc3eaa866c45e53da8998f68ddf973'
    const xParam = Base64.encode(JSON.stringify(voiceParam))
    const checkSum = md5(apiKey + currentTime + xParam)
    const headers = {}
    headers['Content-Type'] = 'application/x-www-form-urlencoded; charset=utf-8'
    headers['X-Param'] = xParam
    headers['X-Appid'] = appId
    headers['X-CurTime'] = currentTime
    headers['X-CheckSum'] = checkSum
    headers['X-Real-Ip'] = '127.0.0.1'
    const data = qs.stringify({
        text: text
    })
    const options = {
            host: 'api.xfyun.cn',
            // path: '/v1/service/v1/tts',
            path: '//tts-api.xfyun.cn/v2/tts',
            method: 'POST',
            headers
        }
        // 创建request请求,将options传入进去
    const request = http.request(options, response => {
        console.log(response)
            // let mp3 = ''
            // const contentLength = response.headers['content-length']
            // response.setEncoding('binary')
            // response.on('data', data => {
            //     mp3 += data
            //     const process = data.length / contentLength * 100
            //     const percent = parseInt(process.toFixed(2))
            //         // console.log(percent)
            // })
            // response.on('end', () => {
            //     // console.log(response.headers)
            //     // console.log(mp3)
            //     const contentType = response.headers['content-type']
            //     if (contentType === 'text/html') {
            //         res.send(mp3)
            //     } else if (contentType === 'text/plain') {
            //         res.send(mp3)
            //     } else {
            //         const fileName = new Date().getTime()
            //         const filePath = `${mp3FilePath}/${fileName}.mp3`
            //         const downloadUrl = `${resUrl}/mp3/${fileName}.mp3`
            //             // console.log(filePath, downloadUrl)
            //         fs.writeFile(filePath, mp3, 'binary', err => {
            //             if (err) {
            //                 res.json({
            //                     error: 1,
            //                     msg: '下载失败'
            //                 })
            //             } else {
            //                 res.json({
            //                     error: 0,
            //                     msg: '下载成功',
            //                     path: downloadUrl
            //                 })
            //             }
            //         })
            //     }
            // })
    })
    request.write(data)
    request.end()
}
// 返回
module.exports = createVoice