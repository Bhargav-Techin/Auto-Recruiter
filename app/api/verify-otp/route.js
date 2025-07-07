// app/api/verify-otp/route.js
import { NextResponse } from 'next/server';
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

    // Get OTP record from database
    const { data, error } = await supabase
      .from('otp_verifications')
      .select('*')
      .eq('email', email)
      .eq('interview_id', interview_id)
      .eq('otp', otp)
      .single();

    if (error || !data) {
      return NextResponse.json(
        { verified: false, error: 'Invalid OTP' },
        { status: 400 }
      );
    }

    // Check if OTP is expired
    const now = new Date();
    const expiresAt = new Date(data.expires_at);
    
    if (now > expiresAt) {
      return NextResponse.json(
        { verified: false, error: 'OTP has expired' },
        { status: 400 }
      );
    }

    // Check if already verified
    if (data.is_verified) {
      return NextResponse.json(
        { verified: true, message: 'Email already verified' },
        { status: 200 }
      );
    }

    // Mark as verified
    const { error: updateError } = await supabase
      .from('otp_verifications')
      .update({
        is_verified: true,
        verified_at: new Date().toISOString()
      })
      .eq('email', email)
      .eq('interview_id', interview_id);

    if (updateError) {
      console.error('Error updating verification status:', updateError);
      return NextResponse.json(
        { verified: false, error: 'Failed to verify OTP' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { verified: true, message: 'Email verified successfully' },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error verifying OTP:', error);
    return NextResponse.json(
      { verified: false, error: 'Failed to verify OTP' },
      { status: 500 }
    );
  }
}