# EmailJS Verification Template Setup

## Step 1: Create Verification Email Template

1. Go to https://dashboard.emailjs.com/admin/templates
2. Click **"Create New Template"**
3. Set Template ID: `template_verification`
4. Use this HTML for the email body:

```html
<div style="font-family: system-ui, sans-serif, Arial; font-size: 14px; max-width: 600px; margin: 0 auto;">
  <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
    <h1 style="color: white; margin: 0; font-size: 28px;">Email Verification</h1>
  </div>
  
  <div style="background-color: #f8f9fa; padding: 40px 30px; border-radius: 0 0 10px 10px;">
    <p style="font-size: 16px; color: #2c3e50; margin-bottom: 20px;">
      Hello <strong>{{to_name}}</strong>,
    </p>
    
    <p style="font-size: 16px; color: #2c3e50; margin-bottom: 30px;">
      You requested to send a message through the contact form. Please use the verification code below:
    </p>
    
    <div style="background-color: white; padding: 20px; border-radius: 8px; text-align: center; margin: 30px 0; border: 2px solid #667eea;">
      <div style="font-size: 14px; color: #6c757d; margin-bottom: 10px; text-transform: uppercase; letter-spacing: 2px;">
        Your Verification Code
      </div>
      <div style="font-size: 36px; font-weight: bold; color: #667eea; letter-spacing: 8px; font-family: monospace;">
        {{verification_code}}
      </div>
    </div>
    
    <p style="font-size: 14px; color: #6c757d; margin-top: 30px;">
      This code will expire in <strong>10 minutes</strong>.
    </p>
    
    <p style="font-size: 14px; color: #6c757d; margin-top: 20px;">
      If you didn't request this code, please ignore this email.
    </p>
  </div>
  
  <div style="text-align: center; padding: 20px; color: #6c757d; font-size: 12px;">
    <p>This is an automated message, please do not reply.</p>
  </div>
</div>
```

5. **Template Settings:**
   - Subject: `Your Verification Code - {{verification_code}}`
   - From Name: `NOIRUXE Portfolio`
   - Reply To: Leave empty (no reply needed)

6. **Template Variables:**
   - `{{to_name}}` - Recipient's name
   - `{{to_email}}` - Recipient's email (for To field)
   - `{{verification_code}}` - 6-digit code

7. Click **Save**

## Step 2: Update Contact Form Template (if needed)

Make sure your existing template (`template_pcw8f7h`) uses these variables correctly:
- `{{from_name}}` - Sender's name
- `{{from_email}}` - Sender's email
- `{{message}}` - Message content

Also set the **Reply-To** field in template settings to: `{{from_email}}`

## How It Works

1. User enters name and email
2. Clicks "Verify" button
3. Receives 6-digit code via email
4. Enters code in form
5. System verifies code
6. User can then send their message

## Security Features

- Code expires after 10 minutes
- Code is single-use (deleted after successful submission)
- Email must be verified before message can be sent
- 60-second cooldown between code requests
