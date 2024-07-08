
 function emailHtmltemplate(resetPasswordURL) {
    return `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Reset Password</title>
        <style>
            body {
                font-family: 'Arial', sans-serif;
                background-color: #f4f4f4;
                margin: 0;
                padding: 0;
            }
    
            .container {
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                background-color: #fff;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                line-height: 1.6; /* Increased line spacing */
            }
    
            h1 {
                color: #333;
                font-size: 24px;
            }
    
            p {
                color: #666;
                font-size: 16px;
                margin: 15px 0; /* Increased space between lines */
            }
    
            a {
                color: #007BFF;
                text-decoration: none;
            }
    
            a:hover {
                text-decoration: underline;
            }
    
            .btn {
                background-color: #007BFF;
                color: #fff;
                padding: 10px 20px;
                text-decoration: none;
                border-radius: 5px;
            }
    
            .emoji {
                font-size: 24px; /* Slightly larger emojis */
                margin-right: 5px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1><span class="emoji">🔐</span> Reset Your Password</h1>
            <p>Hello,</p>
            <p><span class="emoji">🔑</span> You can reset your password by clicking the button below:</p>
            <p><a href="${resetPasswordURL}" class="btn"><span class="emoji">🔁</span> Reset Your Password</a></p>
            <p>If the above button does not work for some reason, you can copy and paste the following link into your browser:</p>
            <p><a href="${resetPasswordURL}">${resetPasswordURL}</a></p>
            <p>If you have not requested a password reset, please ignore this email.</p>
            <p><span class="emoji">🙏</span> Thank you! <span class="emoji">👋</span></p>
        </div>
    </body>
    </html>`;
  }
  module.exports=emailHtmltemplate
  