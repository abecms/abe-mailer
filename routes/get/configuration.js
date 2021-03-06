'use strict';

var fs = require('fs');
var path = require('path');

var route = function route(req, res, next, abe) {
  if(req.query.recipient != null){
    if(typeof abe.config.mail === 'undefined' || abe.config.mail === null) abe.config.mail = {from: 'default@mail.com', recipient: 'recipient@mail.com', subject: 'A subject', "template": "/mail/contact.html"};
    if(typeof abe.config.captcha === 'undefined' || abe.config.captcha === null) abe.config.captcha = {secret: 'YOUR_RECAPTCHA_SECRET'};
    if(typeof abe.config.smtp === 'undefined' || abe.config.smtp === null) abe.config.smtp = {"service": "mandrill", options: {auth: {apiKey: 'YOUR_API_KEY'}}}
    abe.config.mail.from = req.query.from;
    abe.config.mail.recipient = req.query.recipient;
    abe.config.mail.subject = req.query.subject;
    abe.config.captcha.secret = req.query.captcha;
    abe.config.smtp.options.auth.apiKey = req.query.mandrill_api_key;
    fs.writeFileSync(abe.config.root + '/abe.json', JSON.stringify(abe.config),{encoding: "utf8"});
    res.json({'ok': 'ok'});
    return;
  }

  var data = path.join(__dirname + '/../../partials/configuration.html')
  var html = abe.coreUtils.file.getContent(data);
  var template = abe.Handlebars.compile(html, {noEscape: true})
  var tmp = template({
    manager: {config: JSON.stringify(abe.config)},
    config: abe.config,
    user: res.user,
    isPageConfigMail: true
  })
  res.send(tmp);

  return
}

exports.default = route