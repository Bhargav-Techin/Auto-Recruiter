// app/api/send-otp/route.js
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { supabase } from '@/services/supabaseClient';

export async function POST(request) {
  try {
    const { email, otp, interview_id } = await request.json();

    // Validate input
    if (!email || !otp || !interview_id) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Store OTP in database with expiration (10 minutes)
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();
    
    const { error: dbError } = await supabase
      .from('otp_verifications')
      .upsert({
        email,
        otp,
        interview_id,
        expires_at: expiresAt,
        is_verified: false,
        created_at: new Date().toISOString()
      }, {
        onConflict: 'email,interview_id'
      });

    if (dbError) {
      console.error('Database error:', dbError);
      return NextResponse.json(
        { error: 'Failed to store OTP' },
        { status: 500 }
      );
    }

    // Create transporter using Gmail
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_EMAIL,
        pass: process.env.GMAIL_APP_PASSWORD, // Use App Password, not regular password
      },
    });

    // Email template
    const mailOptions = {
      from: {
        name: 'Interview Platform',
        address: process.env.GMAIL_EMAIL
      },
      to: email,
      subject: 'Your Interview Verification Code',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Verification Code</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
          <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 20px;">
            <div style="text-align: center; padding: 20px 0;">
              <h1 style="color: #333; margin: 0;">Interview Verification</h1>
            </div>
            
            <div style="padding: 20px; background-color: #f8fafc; border-radius: 8px; margin: 20px 0;">
              <h2 style="color: #333; margin-top: 0;">Your Verification Code</h2>
              <p style="color: #666; font-size: 16px; line-height: 1.5;">
                Use the following code to verify your email address for the interview:
              </p>
              
              <div style="text-align: center; margin: 30px 0;">
                <div style="display: inline-block; background-color: #3b82f6; color: white; padding: 15px 30px; border-radius: 8px; font-size: 32px; font-weight: bold; letter-spacing: 8px;">
                  ${otp}
                </div>
              </div>
              
              <p style="color: #666; font-size: 14px; margin-bottom: 0;">
                <strong>This code will expire in 10 minutes.</strong>
              </p>
            </div>
            
            <div style="padding: 20px 0; border-top: 1px solid #eee; margin-top: 30px;">
              <p style="color: #999; font-size: 12px; margin: 0; text-align: center;">
                If you didn't request this verification code, please ignore this email.
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `Your verification code for the interview is: ${otp}. This code will expire in 10 minutes.`
    };

    // Send email
    await transporter.sendMail(mailOptions);

    return NextResponse.json(
      { message: 'OTP sent successfully' },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error sending OTP:', error);
    return NextResponse.json(
      { error: 'Failed to send OTP' },
      { status: 500 }
    );
  }
}