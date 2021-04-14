const Base64 = require('js-base64').Base64
const md5 = require('js-md5')
const qs = require('qs')
const http = require('http')
const mp3FilePath = require('./const').mp3FilePath
const resUrl = require('./const').resUrl
const fs = require('fs') // 调用写入的库

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
            // host: 'api.xfyun.cn',
            // path: '/v1/service/v1/tts',
            host: 'wss://tts-api.xfyun.cn',
            path: '/v2/tts',
            method: 'POST',
            headers
        }
        // 创建request请求,将options传入进去
    const request = http.request(options, response => {
        // console.log(response)
        let mp3 = '' // 创建的MP3文件存储服务器返回的响应的内容
        const contentLength = response.headers['content-length']
            // console.log(contentLength)
        response.setEncoding('binary') // 设置编码格式为二进制
            // data就是我们拿到的MP3的语音文件
        response.on('data', data => {
                mp3 += data
                const process = data.length / contentLength * 100
                    // 转化为百分比并转化为两位小数
                const percent = parseInt(process.toFixed(2))
                    // console.log(percent)
            })
            // 执行end这个回调，然后表示我们的数据都接受好了
        response.on('end', () => {
            console.log(response.headers)
            console.log(mp3)
                // 判断获取的文件类型是否为MP3的文件内容
            const contentType = response.headers['content-type']
            if (contentType === 'text/html') {
                res.send(mp3)
            } else {
                // 将不重复的时间戳作为文件名
                const fileName = new Date().getTime()
                    // 创建一个文件路径来统一的保存语音文件
                const filePath = `${mp3FilePath}/${fileName}.mp3`
                    // 上面是本地存储的路径，下面是实际下载的路径
                const downloadUrl = `${resUrl}/mp3/${fileName}.mp3`
                fs.writeFile(filePath, mp3, 'binary', err => {
                        if (err) {
                            res.json({
                                error: 1,
                                msg: '下载失败'
                            })
                        } else {
                            res.json({
                                error: 0,
                                msg: '下载成功',
                                path: downloadUrl
                            })
                        }
                    })
                    // console.log(filePath, downloadUrl)
            } // end if else
        })
    })

    request.write(data)
    request.end()
}
// 返回
module.exports = createVoice