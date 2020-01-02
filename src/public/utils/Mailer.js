const nodemailer = require('nodemailer');

export const testAccount = () => {
    let testAccount = nodemailer.createTestAccount();
    return testAccount
}

export const getTransport = (user, pass, isTest) => {
    if(isTest) {
        const testAccount = testTransport()
        return {
            transport: nodemailer.createTransport({
                host: 'smtp.ethereal.email',
                port: 587,
                secure: false, // true for 465, false for other ports
                auth: {
                    user: testAccount.user, // generated ethereal user
                    pass: testAccount.pass // generated ethereal password
                }
            }),
            account: testAccount
        }
    } else {
        return {
            transport: nodemailer.createTransport({
                host: 'smtp.goodytray.com',
                port: 465,
                secure: true, // true for 465, false for other ports
                auth: {
                    user: user, // generated ethereal user
                    pass: pass // generated ethereal password
                }
            }),
            account: {user: user, pass: pass}
        }
    }

}

export const from = function(name, email) {
    return !name || name.length == 0? email.trim : name.trim() + " <" + email.trim() + ">"
}

export const mail = (user, pass, sender_name, to, subject, body, mime) => {
    const transportData = getTransport(user, pass, true)
    const data = mime == "text/html"? {
        from: from(sender_name, transportData.account.user), //'"Fred Foo 👻" <foo@example.com>'
        to: to, //'bar@example.com, baz@example.com'
        subject: subject, //'Hello ✔'
        html: body  //'<b>Hello world?</b>'
    } : {
        from: from, //'"Fred Foo 👻" <foo@example.com>'
        to: to, //'bar@example.com, baz@example.com'
        subject: subject, //'Hello ✔'
        text: body  //'Hello world?'
    }

    let info = transportData.transport.sendMail(data);
    return info
}