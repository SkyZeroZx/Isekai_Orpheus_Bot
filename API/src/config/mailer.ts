 
  import nodemailer = require('nodemailer');
  export const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,  
    auth: {
      user: "nodetestui@gmail.com",  
      pass: "boxykxbxxutrqitw" 
    },
  });
  


  transporter.verify().then(() => {
      console.log('Ready for sending emails')
  })
 