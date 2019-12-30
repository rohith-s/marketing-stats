"use strict";
var  mm = require('mail-merger')
// import { MailMerger } from 'mail-merger';
var fs = require('fs');
// import {readFileSync} from 'fs';
async function sendTestEmail() {
    console.log("sendTestEmail");
    const opts = {
        smtp: {
            host: "smtp.office365.com",
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: 'rohith.s@congruentglobal.com', // generated ethereal user
                pass: '' // generated ethereal password
            },
            secureConnection: false,
            debug: true,
            logger:true,
            tls: {
                ciphers:'SSLv3'
            }
        }
        ,
        mail: {
            subject: "Test"
        },
        // context: {
        //     key: "",
        //     merge: true,
        //     arrayIndicator: "",
        // }
    };
    var context = "/home/rohith/Files/DRB/Git/private/marketing-stats/sampleData/data.csv"; //csv/json or extracted one
    // NodeMailer.SendMailOptions
var mailOpts ={
    from: 'rohith.s@congruentglobal.com'
};
   var html =  fs.readFileSync('/home/rohith/Files/DRB/Git/private/marketing-stats/sampleData/sample.html');
    var template = {html:html.toString()};
// refer to `defaults.ts` for all details of the options
    const merger = new mm.MailMerger(opts);
// refer to `mail-merger.spec.ts` for more details
    const summary = await merger.send(context, template, mailOpts);
    console.info(`[${summary.sent}] out of [${summary.total}] emails were sent out successfully!`);
}

module.exports = (function () {
    return {
        sendTestEmail:sendTestEmail
    }
})();
