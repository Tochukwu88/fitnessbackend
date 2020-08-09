
let API_KEY = process.env.MAILGUN_API_KEY;
let DOMAIN = process.env.APP_URL;
let mailgun = require('mailgun-js')({apiKey: API_KEY, domain: DOMAIN});




exports.contactForm = (req,res) =>{
    const {email, name, message} = req.body
    const data = {
        from: email,
        to: process.env.EMAIL_TO,
        subject: `Contact form - ${process.env.APP_NAME}`,
        text: `Email received from contact from \n send name:${name} \n sender email: ${email} \n sender message: ${message}`,

        html:`
               <h4>Email received from contact form:</h4>
               <p>sender name:${name}</p>
               <p>sender email:${email}</p>
               <p>sender message:  ${message}</P>
               <hr/>
               <p>This email may contain sensitive information </p>
               <p>https://realFit.com</p>

             `
      };
      
      mailgun.messages().send(data, (error, body) => {
          console.log(data)
        console.log(body)
        console.log(error)
       return  res.json({
            success:true
        })
      });
   
}
exports.contactBlogAuthorForm = (req,res) =>{
    const {authorEmail,email, name, message} = req.body
    const data = {
        from: email,
        to: authorEmail,
        subject: `someone messaged you from - ${process.env.APP_NAME}`,
        text: `Email received from contact from \n send name:${name} \n sender email: ${email} \n sender message: ${message}`,

        html:`
               <h4>message receive:</h4>
               <p> name:${name}</p>
               <p> email:${email}</p>
               <p> message:  ${message}</P>
               <hr/>
               <p>This email may contain sensitive information </p>
               <p>https://realFit.com</p>

             `
      };
      
      mailgun.messages().send(data, (error, body) => {
          console.log(data)
        console.log(body)
        console.log(error)
       return  res.json({
            success:true
        })
      });
   
}