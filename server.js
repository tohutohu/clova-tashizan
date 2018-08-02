const clova = require('@line/clova-cek-sdk-nodejs');
const express = require('express');

const clovaSkillHandler = clova.Client
  .configureSkill()
  .onLaunchRequest(responseHelper => {
    responseHelper.responseObject.sessionAttributes.count = 0;
    responseHelper.setSimpleSpeech({
      lang: 'ja',
      type: 'PlainText',
      value: '足し算を起動しました。現在の値は0です。',
    });
  })
  .onIntentRequest(async responseHelper => {
    console.log(responseHelper)
    const intent = responseHelper.getIntentName();
    const sessionId = responseHelper.getSessionId();

    switch (intent) {
      case 'plus':
        const number = Number(responseHelper.getSlot('number') || 0);
        responseHelper.responseObject.sessionAttributes.count = Number(responseHelper.requestObject.session.sessionAttributes.count) + number;
        responseHelper.setSimpleSpeech(
          clova.SpeechBuilder.createSpeechText(`${number}足しました。現在の値は${responseHelper.responseObject.sessionAttributes.count}です。`)
        );
        break
      case 'Clova.CancelIntent':
        responseHelper.responseObject.response.shouldEndSession = true;
        responseHelper.setSimpleSpeech(
          clova.SpeechBuilder.createSpeechText(`足し算を終了します。最後の値は${responseHelper.responseObject.sessionAttributes.count}でした。`)
        );
        break;
    }
  })
  .onSessionEndedRequest(responseHelper => {
    const sessionId = responseHelper.getSessionId();

    // Do something on session end
  })
  .handle();

const app = new express();
const clovaMiddleware = clova.Middleware({ applicationId: "com.to-hutohu.tashizan" });
// Use `clovaMiddleware` if you want to verify signature and applicationId.
// Please note `applicationId` is required when using this middleware.
app.post('/', clovaMiddleware, clovaSkillHandler);

app.get('/ping', (req, res) => {
  console.log(req)
  res.send('pong')
})

app.get('*', (req, res) => {
  res.send(req.originalUrl)
})

app.post('*', (req, res) => {
  res.send(req.originalUrl)
})

app.listen(8080);

