'use client'
import React, { useContext, useEffect, useState } from 'react';
import Image from 'next/image';
import { Building2, Clock, Camera, Mic, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/services/supabaseClient';
import { InterviewDetailsContext } from '@/context/InterviewDetailsContext';


function InterviewPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false); // Separate state for sending OTP
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false); // Separate state for verifying OTP
  const [loading, setLoading] = useState(true);
  const [isValidInterview, setIsValidInterview] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const { interview_id } = useParams();
  const { interviewDetails, setInterviewDetails } = useContext(InterviewDetailsContext);

  const router = useRouter()

  useEffect(() => {
    interview_id && GetInterviewDetails()
    // console.log(GetInterviewDetails())
  }, [interview_id])

  // Countdown timer for resend OTP
  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const GetInterviewDetails = async () => {
    try {
      setLoading(true);
      let { data, error } = await supabase
        .from('Interviews')
        .select('*')
        .eq('interview_id', interview_id)

      if (error) {
        console.error('Error fetching interview details:', error);
        setIsValidInterview(false);
        setLoading(false);
        return;
      }

      if (data && data.length > 0) {
        // console.log('Interview details loaded successfully:', data[0]);
        setInterviewDetails(data[0]);
        setIsValidInterview(true);
        setLoading(false);
      } else {
        console.warn('No interview found with the provided ID');
        setIsValidInterview(false);
        setLoading(false);
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      setIsValidInterview(false);
      setLoading(false);
    }
  }

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const sendOtp = async () => {
    if (!email.trim()) {
      toast.error('Please enter your email address');
      return;
    }
    if (!isValidEmail(email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    setIsSendingOtp(true); // Use separate loading state
    try {
      const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();

      const response = await fetch('/api/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email,
          otp: generatedOtp,
          interview_id: interview_id
        }),
      });

      if (response.ok) {
        setIsOtpSent(true);
        setCountdown(60);
        toast.success('OTP sent to your email address');
      } else {
        toast.error('Failed to send OTP. Please try again.');
      }
    } catch (error) {
      console.error('Error sending OTP:', error);
      toast.error('Error sending OTP. Please try again.');
    }
    setIsSendingOtp(false); // Reset separate loading state
  };

  const verifyOtp = async () => {
    if (!otp.trim()) {
      toast.error('Please enter the OTP');
      return;
    }

    setIsVerifyingOtp(true); // Use separate loading state
    try {
      const response = await fetch('/api/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email,
          otp: otp,
          interview_id: interview_id
        }),
      });

      const result = await response.json();

      if (response.ok && result.verified) {
        setIsEmailVerified(true);
        toast.success('Email verified successfully!');
      } else {
        toast.error('Invalid or expired OTP. Please try again.');
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      toast.error('Error verifying OTP. Please try again.');
    }
    setIsVerifyingOtp(false); // Reset separate loading state
  };

  const resendOtp = () => {
    if (countdown > 0) return;
    sendOtp();
  };

  const handleJoinInterview = async () => {
    if (!fullName.trim()) {
      toast.error('Please enter your full name');
      return;
    }
    if (!isEmailVerified) {
      toast.error('Please verify your email address first');
      return;
    }

    try {
      // Check if record exists in interview_feedback table (completed interviews)
      const { data: feedbackData, error: feedbackError } = await supabase
        .from('Interview-Feedback')
        .select('*')
        .eq('intervieweeEmail', email)
        .eq('interview_id', interview_id);

      if (feedbackError) {
        console.error('Error checking interview feedback:', feedbackError);
        toast.error('Error verifying interview status. Please try again.');
        return;
      }

      // Set interview details
      setInterviewDetails(prev => ({
        ...(prev || {}),
        intervieweeFullName: fullName,
        intervieweeEmail: email,
        intervieweeIsVerified: true
      }));

      console.log(interviewDetails);

      // Check if interview is already completed
      if (feedbackData && feedbackData.length > 0) {
        // Interview already completed, redirect to complete route
        toast.info('You have already completed this interview.');
        router.push('/public-interview/' + interview_id + '/complete');
      } else {
        // Interview not completed yet, go to start route
        router.push('/public-interview/' + interview_id + '/start');
      }

    } catch (err) {
      console.error('Unexpected error during interview status check:', err);
      toast.error('An unexpected error occurred. Please try again.');
    }
  };
  const handleTestAudioVideo = () => {
    // Handle audio/video test logic here
    console.log('Testing audio and video...');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl">

        {loading && (
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="p-8 text-center">
              <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Loading interview details...</p>
            </div>
          </div>
        )}

        {/* Add this invalid link section here */}
        {!loading && !isValidInterview && (
          <div className="bg-white rounded-2xl shadow-xl border border-red-200 overflow-hidden">
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 19c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-red-600 mb-2">Invalid Interview Link</h2>
              <p className="text-gray-600 mb-4">
                The interview link you're trying to access is either invalid, expired, or doesn't exist.
              </p>
              <p className="text-sm text-gray-500">
                Please check the link you received or contact the interview coordinator for assistance.
              </p>
            </div>
          </div>
        )}

        {/* Wrap the existing main card in a conditional render */}
        {isValidInterview && !loading && (<div>
          {/* Main Card */}
          < div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            {/* Illustration Section */}
            <div className="relative bg-gradient-to-br from-violet-400 via-purple-500 to-indigo-600 px-4 py-8 text-center overflow-hidden">
              {/* Animated Background Elements */}
              <div className="absolute inset-0 overflow-hidden">
                {/* Floating orbs */}
                <div className="absolute top-4 left-6 w-12 h-12 bg-gradient-to-r from-yellow-300 to-orange-400 rounded-full opacity-80 animate-pulse shadow-lg"></div>
                <div className="absolute top-8 right-8 w-8 h-8 bg-gradient-to-r from-pink-300 to-rose-400 rounded-full opacity-70 animate-bounce shadow-md"></div>
                <div className="absolute bottom-6 left-4 w-6 h-6 bg-gradient-to-r from-cyan-300 to-blue-400 rounded-full opacity-60 animate-pulse"></div>
                <div className="absolute bottom-8 right-12 w-8 h-8 bg-gradient-to-r from-emerald-300 to-green-400 rounded-full opacity-50 animate-bounce"></div>

                {/* Geometric shapes */}
                <div className="absolute top-1/4 left-4 w-4 h-4 bg-white/20 rotate-45 animate-spin-slow"></div>
                <div className="absolute bottom-1/3 right-8 w-6 h-6 bg-white/10 rounded-full animate-ping"></div>

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/5 via-transparent to-white/5"></div>
              </div>

              {/* Main Content Container */}
              <div className="relative z-10">
                {/* Main Illustration Container */}
                <div className="relative flex justify-center items-center mb-6">
                  {/* Central Monitor with Enhanced Styling */}
                  <div className="relative group">
                    {/* Glow effect behind monitor */}
                    <div className="absolute inset-0 bg-white/20 rounded-2xl blur-lg scale-105 group-hover:scale-110 transition-transform duration-500"></div>

                    {/* Monitor container */}
                    <div className="relative bg-white/95 backdrop-blur-sm rounded-xl p-3 shadow-2xl border border-white/20">
                      <Image
                        src="/interview.svg"
                        alt="AI Interview Illustration"
                        width={300}
                        height={300}
                        className="rounded-lg"
                      />

                      {/* Data flow lines */}
                      <div className="absolute top-1/2 left-1/3 transform -translate-x-1/2 -translate-y-1/2">
                        <div className="absolute w-24 h-24 border border-white/20 rounded-full animate-ping"></div>
                        <div className="absolute w-18 h-18 border border-white/30 rounded-full animate-ping animation-delay-1000"></div>
                        <div className="absolute w-12 h-12 border border-white/40 rounded-full animate-ping animation-delay-2000"></div>
                      </div>

                      {/* Screen reflection effect */}
                      <div className="absolute inset-3 bg-gradient-to-br from-white/10 via-transparent to-transparent rounded-lg pointer-events-none"></div>
                    </div>
                  </div>

                  {/* Enhanced Side Profiles */}
                  <div className="absolute -left-8 top-4 animate-float">
                    <div className="group cursor-pointer">
                      <div className="w-16 h-12 bg-gradient-to-br from-white to-gray-50 rounded-lg shadow-xl border border-white/20 flex items-center justify-center transform group-hover:scale-110 transition-all duration-300">
                        <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-violet-600 rounded-full shadow-md"></div>
                      </div>
                      {/* Connection line */}
                      <div className="absolute top-6 right-0 w-6 h-0.5 bg-gradient-to-r from-purple-400 to-transparent"></div>
                    </div>
                  </div>

                  <div className="absolute -right-8 top-4 animate-float-delayed">
                    <div className="group cursor-pointer">
                      <div className="w-16 h-12 bg-gradient-to-br from-white to-gray-50 rounded-lg shadow-xl border border-white/20 flex items-center justify-center transform group-hover:scale-110 transition-all duration-300">
                        <div className="w-6 h-6 bg-gradient-to-r from-emerald-500 to-green-600 rounded-full shadow-md"></div>
                      </div>
                      {/* Connection line */}
                      <div className="absolute top-6 left-0 w-6 h-0.5 bg-gradient-to-l from-green-400 to-transparent"></div>
                    </div>
                  </div>

                  {/* Enhanced Chat Bubbles */}
                  <div className="absolute top-0 right-0 animate-bounce-subtle">
                    <div className="w-20 h-6 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg opacity-80 shadow-lg"></div>
                  </div>

                  {/* Enhanced Floating Elements */}
                  <div className="absolute bottom-4 left-8 animate-spin-slow">
                    <div className="w-4 h-4 border-2 border-white/60 border-t-transparent rounded-full"></div>
                  </div>

                  <div className="absolute bottom-8 right-12 animate-pulse">
                    <div className="w-3 h-3 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full shadow-lg"></div>
                  </div>
                </div>
              </div>
            </div>

            <style jsx>{`
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
  }
  
  @keyframes float-delayed {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-8px); }
  }
  
  @keyframes bounce-subtle {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-5px); }
  }
  
  @keyframes bounce-subtle-delayed {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-3px); }
  }
  
  @keyframes spin-slow {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  
  .animate-float {
    animation: float 3s ease-in-out infinite;
  }
  
  .animate-float-delayed {
    animation: float-delayed 3s ease-in-out infinite;
    animation-delay: 1s;
  }
  
  .animate-bounce-subtle {
    animation: bounce-subtle 2s ease-in-out infinite;
  }
  
  .animate-bounce-subtle-delayed {
    animation: bounce-subtle-delayed 2s ease-in-out infinite;
    animation-delay: 0.5s;
  }
  
  .animate-spin-slow {
    animation: spin-slow 8s linear infinite;
  }
  
  .animation-delay-1000 {
    animation-delay: 1s;
  }
  
  .animation-delay-2000 {
    animation-delay: 2s;
  }
  
  .border-3 {
    border-width: 3px;
  }
`}</style>

            {/* Content Section */}
            <div className="p-8">
              {/* Interview Title */}
              <h2 className="text-xl font-bold text-gray-900 text-center mb-4">
                {interviewDetails?.jobPosition} interview
              </h2>

              {/* Interview Details */}
              <div className="flex items-center justify-center gap-6 mb-6 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-blue-500" />
                  <span>{interviewDetails?.organizationName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-500" />
                  <span>{interviewDetails?.interviewDuration} Minutes</span>
                </div>
              </div>

              {/* Name Input */}
              <div className="mb-6">
                <label className="block text-gray-700 font-medium mb-3">
                  Enter your full name
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g., John Smith"
                  className="w-full px-4 py-1 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50"
                />
              </div>

              {/* Email Input */}
              <div className="mb-6">
                <label className="block text-gray-700 font-medium mb-3">
                  Enter your email address
                </label>
                <div className="flex gap-3">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g., john.smith@email.com"
                    disabled={isEmailVerified}
                    className={`flex-1 px-4 py-1 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${isEmailVerified ? 'bg-green-50 border-green-200' : 'bg-gray-50'
                      }`}
                  />
                  {!isEmailVerified && (
                    <Button
                      onClick={sendOtp}
                      disabled={isSendingOtp || isOtpSent} // Use separate state
                      className={`px-6 py-3 ${isOtpSent ? 'bg-gray-100 text-gray-500 cursor-not-allowed hover:bg-gray-100' : ''
                        }`}
                    >
                      {isSendingOtp ? 'Sending...' : isOtpSent ? 'OTP Sent' : 'Send OTP'} {/* Use separate state */}
                    </Button>
                  )}
                  {isEmailVerified && (
                    <div className="flex items-center px-4 py-3 bg-green-100 text-green-700 rounded-lg">
                      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Verified
                    </div>
                  )}
                </div>
              </div>

              {/* OTP Input */}
              {isOtpSent && !isEmailVerified && (
                <div className="mb-6">
                  <label className="block text-gray-700 font-medium mb-3">
                    Enter OTP sent to your email
                  </label>
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      placeholder="Enter 6-digit OTP"
                      maxLength="6"
                      className="flex-1 px-4 py-1 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 text-center font-mono text-lg"
                    />
                    <Button
                      onClick={verifyOtp}
                      disabled={isVerifyingOtp || otp.length !== 6} // Use separate state
                      className={`px-6 py-3 ${otp.length !== 6 ? 'bg-gray-100 text-gray-500 cursor-not-allowed hover:bg-gray-100' : 'bg-green-600 hover:bg-green-700'
                        }`}
                    >
                      {isVerifyingOtp ? 'Verifying...' : 'Verify'} {/* Use separate state */}
                    </Button>
                  </div>

                  <div className="mt-3 text-center">
                    <button
                      onClick={resendOtp}
                      disabled={countdown > 0}
                      className={`text-sm ${countdown > 0
                        ? 'text-gray-500 cursor-not-allowed'
                        : 'text-blue-600 hover:text-blue-700'
                        }`}
                    >
                      {countdown > 0 ? `Resend OTP in ${countdown}s` : 'Resend OTP'}
                    </button>
                  </div>
                </div>
              )}

              {/* Instructions */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-blue-900 mb-2">Before you begin</h3>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• Ensure you have a stable internet connection</li>
                      <li>• Test your camera and microphone</li>
                      <li>• Find a quiet place for the interview</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button
                  onClick={handleJoinInterview}
                  disabled={!isEmailVerified || !fullName.trim()}
                  className={`w-full font-semibold text-md py-3 px-6 ${!isEmailVerified || !fullName.trim()
                    ? 'bg-gray-400 border border-blue-300 cursor-not-allowed hover:bg-gray-100'
                    : ''
                    }`}
                >
                  <Camera className="w-5 h-5" />
                  Join Interview
                </Button>

                <Button
                  onClick={handleTestAudioVideo}
                  variant="outline"
                  className="w-full font-semibold text-md py-3 px-6"
                >
                  <Mic className="w-5 h-5" />
                  Test Audio & Video
                </Button>
              </div>
            </div>
          </div>
        </div>)}

      </div>
    </div >
  );
}

export default InterviewPage;