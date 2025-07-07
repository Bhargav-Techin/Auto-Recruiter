'use client'
import React, { useContext, useEffect, useState, useRef } from 'react'
import { Timer, User, Play, Square, Mic, MicOff, Video, VideoOff } from 'lucide-react'
import Image from 'next/image'
import Vapi from '@vapi-ai/web';
import { assistantOptions } from '@/services/Constants'
import AlertConfirmation from './_components/AlertConfirmation';
import { toast } from 'sonner'
import axios from 'axios';
import { supabase } from '@/services/supabaseClient';
import { useParams, useRouter } from 'next/navigation';
// import { InterviewDetailsContext } from '@/context/InterviewDetailsContext';


function StartInterview() {
  // const { interviewDetails, setInterviewDetails } = useContext(InterviewDetailsContext)
  const [vapi, setVapi] = useState(null);
  const [isVapiReady, setIsVapiReady] = useState(false);

  const interviewDetails = {
    "interview_id": "0767d384-9285-4989-970a-bd5ebb3f0ef2",
    "created_at": "2025-06-13T06:50:09.20125+00:00",
    "jobPosition": "Full Stack Web Developer",
    "jobDescription": "We are seeking a passionate Full Stack Developer to join our dynamic product team. The ideal candidate should have experience in both front-end and back-end development and a good understanding of modern web frameworks. 🔹Responsibilities: Design and build responsive web applications. Work closely with UI/UX designers and product managers. Develop RESTful APIs and integrate with databases. Write clean, maintainable, and efficient code. 🔹 Required Skills: HTML, CSS, JavaScript React.js Node.js, Express.js MongoDB or MySQL Git, REST APIs",
    "interviewDuration": 5,
    "interviewType": [
      "Behavioral",
      "Coding",
      "Technical"
    ],
    "jobPrompt": "focus on mainly the overview. dont ask for detailed explaination and generated 4-5 question only",
    "questionsList": [
      {
        "question": "Tell me about a time you had to learn a new technology or framework quickly to meet a project deadline. What was your approach, and what were the biggest challenges you faced?",
        "type": "Behavioral"
      },
      {
        "question": "Describe your experience with React.js. What are some of the key benefits of using React, and what are some potential drawbacks?",
        "type": "Technical"
      },
      {
        "question": "Explain your understanding of RESTful APIs. What are the core principles that guide the design of a good RESTful API?",
        "type": "Technical"
      },
      {
        "question": "How do you approach structuring a full-stack web application, from initial design to deployment? What are some considerations you make regarding scalability and maintainability?",
        "type": "Technical"
      }
    ],
    "userEmail": "bhargavprasaddas342@gmail.com",
    "organizationName": "TechNova Solutions Pvt. Ltd.",
    "intervieweeFullName": "John Anderson",
    "intervieweeEmail": "john.andeson@gmail.com",
    "intervieweeIsVerified": true
  };

  const [timer, setTimer] = useState('00:00:00')
  const [seconds, setSeconds] = useState(0)
  const [isInterviewStarted, setIsInterviewStarted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [stream, setStream] = useState(null)
  const [aiStatus, setAiStatus] = useState('idle') // 'idle', 'speaking', 'listening', 'connecting', 'processing'
  const [userStatus, setUserStatus] = useState('idle') // 'idle', 'speaking', 'listening'
  const [cameraPermissionDenied, setCameraPermissionDenied] = useState(false)
  const [isEnding, setIsEnding] = useState(false)
  const [conversation, setConversation] = useState();
  const router = useRouter();
  const { interview_id } = useParams();
  const [isGeneratingFeedback, setIsGeneratingFeedback] = useState(false);
  const [feedbackProgress, setFeedbackProgress] = useState('');
  const videoRef = useRef(null)

  useEffect(() => {
    if (!interview_id || !interviewDetails?.intervieweeEmail) return;

    const checkInterviewCompletion = async () => {
      try {
        const { data: feedbackData, error: feedbackError } = await supabase
          .from('Interview-Feedback')
          .select('*')
          .eq('intervieweeEmail', interviewDetails.intervieweeEmail)
          .eq('interview_id', interview_id);

        if (feedbackError) {
          console.error('Error checking interview feedback:', feedbackError);
          toast.error('Error verifying interview status. Please try again.');
          return;
        }

        if (feedbackData && feedbackData.length > 0) {
          toast.info('You have already completed this interview. Redirecting to results...', {
            duration: 4000,
            position: 'top-center'
          });

          setTimeout(() => {
            router.push(`/public-interview/${interview_id}/complete`);
          }, 2000);
        }

      } catch (err) {
        console.error('Unexpected error during interview status check:', err);
        toast.error('An unexpected error occurred while checking interview status.');
      }
    };

    // ✅ Safe call without returning a promise to React
    void checkInterviewCompletion();
  }, [interview_id, interviewDetails?.intervieweeEmail]);


  // Initialize Vapi instance
  useEffect(() => {
    const vapiInstance = new Vapi(process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY);
    setVapi(vapiInstance);
    setIsVapiReady(true);

    return () => {
      if (vapiInstance) {
        try {
          vapiInstance.stop(); // assume it's synchronous
        } catch (err) {
          console.error("Error stopping Vapi:", err);
        }
        vapiInstance.removeAllListeners();
      }
    };

  }, []);

  // Timer functionality
  useEffect(() => {
    let interval
    if (isInterviewStarted) {
      interval = setInterval(() => {
        setSeconds(prev => prev + 1)
      }, 1000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isInterviewStarted])

  // Format timer display
  useEffect(() => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    setTimer(
      `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    )
  }, [seconds])

  // Auto-end interview when time limit reached
  useEffect(() => {
    if (isInterviewStarted && seconds >= (interviewDetails.interviewDuration * 60)) {
      console.log('Interview time limit reached, auto-ending...');
      toast.warning('Time limit reached! Interview is ending automatically.', {
        duration: 3000,
        position: 'top-center'
      });
      handleEndInterview();
    }
  }, [seconds, isInterviewStarted, interviewDetails.interviewDuration]);

  // Show warning when 2 minutes remaining
  useEffect(() => {
    const totalDurationSeconds = interviewDetails.interviewDuration * 60;
    const remainingSeconds = totalDurationSeconds - seconds;

    if (isInterviewStarted && remainingSeconds === 120) { // 2 minutes warning
      toast.warning('⏰ 2 minutes remaining in your interview!', {
        duration: 4000,
        position: 'top-center'
      });
    }

    if (isInterviewStarted && remainingSeconds === 60) { // 1 minute warning
      toast.error('⚠️ 1 minute remaining in your interview!', {
        duration: 4000,
        position: 'top-center'
      });
    }
  }, [seconds, isInterviewStarted, interviewDetails.interviewDuration]);

  // Get user media on component mount
  useEffect(() => {
    const getUserMedia = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true
        })
        setStream(mediaStream)
        setCameraPermissionDenied(false)
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream
        }
      } catch (error) {
        console.error('Error accessing camera/microphone:', error)
        setCameraPermissionDenied(true)
        // Don't show alert, just handle gracefully
      }
    }

    getUserMedia()

    // Cleanup function
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => {
          track.stop()
        })
      }
    }
  }, [])

  // Update video ref when stream changes
  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream
    }
  }, [stream])

  // Setup VAPI event listeners - only when interview starts
  useEffect(() => {
    if (!isInterviewStarted || !vapi) return;

    const onCallStart = () => {
      console.log('Call has started');
      setAiStatus('listening');
      setUserStatus('idle');

      // Add this toast
      toast.success('🎙️ Interview started successfully! Good luck!', {
        duration: 4000,
        position: 'top-center'
      });
    };

    const onError = (e) => {
      console.error('VAPI Error:', e);
      setAiStatus('idle');
      setUserStatus('idle');

      // Add this toast
      toast.error('Interview connection error. Please try again.', {
        duration: 4000,
        position: 'top-center'
      });
    };

    const onCallEnd = () => {
      console.log('Call has stopped');
      setAiStatus('idle');
      setUserStatus('idle');
      setIsInterviewStarted(false);
      setSeconds(0);
      setTimer('00:00:00');
    };

    const onSpeechStart = () => {
      console.log('AI Speech has started');
      setAiStatus('speaking');
      setUserStatus('listening');
    };

    const onSpeechEnd = () => {
      console.log('AI Speech has ended');
      setAiStatus('listening');
      setUserStatus('idle');
    };

    const onMessage = (message) => {
      setConversation(message?.conversation);

      if (message.type === 'transcript') {
        if (message.transcriptType === 'partial' && message.transcript?.trim()) {
          setUserStatus('speaking');
          setAiStatus('listening');
        } else if (message.transcriptType === 'final' && message.transcript?.trim()) {
          setUserStatus('idle');
          setAiStatus('processing');
          setTimeout(() => setAiStatus('speaking'), 500);
        }
      }
    };

    const onVolumeLevel = (volume) => {
      console.log(`Assistant volume level: ${volume}`);
    };

    vapi.on('call-start', onCallStart);
    vapi.on('call-end', onCallEnd);
    vapi.on('speech-start', onSpeechStart);
    vapi.on('speech-end', onSpeechEnd);
    vapi.on('message', onMessage);
    vapi.on('error', onError);
    vapi.on('volume-level', onVolumeLevel);

    return () => {
      vapi.off('call-start', onCallStart);
      vapi.off('call-end', onCallEnd);
      vapi.off('speech-start', onSpeechStart);
      vapi.off('speech-end', onSpeechEnd);
      vapi.off('message', onMessage);
      vapi.off('error', onError);
      vapi.off('volume-level', onVolumeLevel);
    };
  }, [isInterviewStarted, vapi])

  // Calculate remaining time for display
  const getRemainingTime = () => {
    const totalDurationSeconds = interviewDetails.interviewDuration * 60;
    const remainingSeconds = Math.max(0, totalDurationSeconds - seconds);
    const hours = Math.floor(remainingSeconds / 3600);
    const minutes = Math.floor((remainingSeconds % 3600) / 60);
    const secs = remainingSeconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const generateFeedback = async () => {
    try {
      setIsGeneratingFeedback(true);
      setFeedbackProgress('Analyzing interview responses...');

      const result = await axios.post('/api/ai-feedback', {
        conversation,
      });

      setFeedbackProgress('Processing AI feedback...');

      let feedback = result.data.message;

      // Defensive: remove code block wrappers in case AI still returns them
      const cleanedFeedback = feedback.replace(/```json|```/g, '').trim();

      setFeedbackProgress('Saving feedback to database...');

      // Save to Supabase
      const { data, error } = await supabase
        .from('Interview-Feedback')
        .insert([
          {
            intervieweeFullName: interviewDetails.intervieweeFullName,
            intervieweeEmail: interviewDetails.intervieweeEmail,
            interview_id: interviewDetails.interview_id,
            feedback: JSON.parse(cleanedFeedback), // JSON object
          },
        ])
        .select();

      if (error) {
        console.error("Error saving feedback:", error.message);
        throw new Error("Failed to save feedback to database");
      } else {
        console.log("Feedback saved successfully:", data);
        setFeedbackProgress('Feedback saved successfully!');
      }
    } catch (error) {
      console.error("Feedback generation failed:", error?.response?.data || error.message);
      setFeedbackProgress('Error generating feedback');
      throw error; // Re-throw to be caught by handleEndInterview
    } finally {
      setIsGeneratingFeedback(false);
      setFeedbackProgress('');
    }
  };



  const handleStartInterview = async () => {
    if (!vapi || !isVapiReady) return;

    setIsLoading(true)
    setAiStatus('connecting')


    if (interviewDetails) {
      const questionsList = interviewDetails?.questionsList
        .map((item, index) => `${index + 1}. ${item.question}`)
        .join("\n");

      console.log(questionsList);
    }

    const finalAssistantOptions = {
      ...assistantOptions,
      firstMessage: assistantOptions.firstMessage
        .replace('{{jobPosition}}', interviewDetails.jobPosition)
        .replace('{{intervieweeFullName}}', interviewDetails.intervieweeFullName),

      model: {
        ...assistantOptions.model,
        messages: [
          {
            ...assistantOptions.model.messages[0],
            content: assistantOptions.model.messages[0].content
              .replace('{{jobPosition}}', interviewDetails.jobPosition)
              .replace('{{intervieweeFullName}}', interviewDetails.intervieweeFullName)
              .replace('{{questionsList}}', interviewDetails.questionsList),
          },
        ],
      },
    };

    try {
      vapi.start(finalAssistantOptions);
      setIsInterviewStarted(true)
      setIsLoading(false)

      toast.dismiss('interview-init');
      toast.success('🚀 Interview session started!', {
        duration: 3000,
        position: 'top-center'
      });
    } catch (error) {
      console.error('Error starting interview:', error);
      setIsLoading(false)
      setAiStatus('idle')

      toast.dismiss('interview-init');
      toast.error('Failed to start interview. Please try again.', {
        duration: 4000,
        position: 'top-center'
      });
    }
  }

  const handleEndInterview = async () => {
    if (!vapi) return;

    setIsLoading(true);
    setIsEnding(true);

    try {
      // Stop VAPI and cleanup
      await vapi.stop();
      vapi.removeAllListeners();

      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      setStream(null);

      setIsInterviewStarted(false);
      setAiStatus('idle');
      setUserStatus('idle');
      setSeconds(0);
      setTimer('00:00:00');

      // Show processing toast
      toast.loading('Processing interview completion...', {
        id: 'interview-completion',
        duration: Infinity, // Keep showing until we dismiss it
      });

      // Generate feedback with loading states
      await generateFeedback();

      // Success - dismiss loading toast and show success
      toast.dismiss('interview-completion');
      toast.success('✅ Interview completed successfully! Redirecting to summary...', {
        duration: 3000,
        position: 'top-center'
      });

      // Redirect to complete page
      router.push(`/public-interview/${interview_id}/complete`);

    } catch (error) {
      console.error('Error generating feedback:', error);

      // Dismiss loading toast and show error
      toast.dismiss('interview-completion');
      toast.error('Interview completed but feedback generation failed. Redirecting...', {
        duration: 3000,
        position: 'top-center'
      });

      // Redirect to failed page
      router.push(`/public-interview/${interview_id}/failed`);

    } finally {
      setIsLoading(false);
      setIsEnding(false);
    }
  };

  const getStatusDisplay = (status) => {
    switch (status) {
      case 'speaking':
        return {
          text: 'Speaking',
          color: 'bg-green-500',
          icon: <Mic className="w-3 h-3 text-white" />
        }
      case 'listening':
        return {
          text: 'Listening',
          color: 'bg-blue-500',
          icon: <div className="w-3 h-3 bg-white rounded-full animate-pulse" />
        }
      case 'processing':
        return {
          text: 'Processing',
          color: 'bg-purple-500',
          icon: <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin" />
        }
      case 'connecting':
        return {
          text: 'Connecting',
          color: 'bg-yellow-500',
          icon: <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin" />
        }
      case 'idle':
      default:
        return {
          text: 'Ready',
          color: 'bg-gray-400',
          icon: <div className="w-3 h-3 bg-white rounded-full" />
        }
    }
  }

  if (!interviewDetails) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">No Interview Details Found</h2>
          <p className="text-gray-600 mb-6">Please start a new interview session to continue.</p>
          <button
            onClick={() => window.history.back()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200"
          >
            Go Back
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 text-gray-900 relative overflow-hidden">
      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes speakingPulse {
          0%, 100% {
            transform: scale(1);
            opacity: 0.2;
          }
          50% {
            transform: scale(1.3);
            opacity: 0.5;
          }
        }
        
        @keyframes ripple {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          100% {
            transform: scale(2.5);
            opacity: 0;
          }
        }
        
        .speaking-pulse {
          animation: speakingPulse 1.5s ease-in-out infinite;
        }
        
        .ripple-effect {
          animation: ripple 1.5s ease-out infinite;
        }

        .mirror-video {
          transform: scaleX(-1);
        }
      `}</style>

      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 p-6">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-800">AI Interview Session</h1>
          <div className="flex items-center space-x-4">
            {/* Current Timer */}
            <div className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm border border-gray-200">
              <Timer className="w-4 h-4 text-blue-600" />
              <span className="font-mono text-sm text-gray-700">{timer}</span>
            </div>
            {/* Remaining Time (only show during interview) */}
            {isInterviewStarted && (
              <div className="flex items-center space-x-2 bg-red-50/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm border border-red-200">
                <Timer className="w-4 h-4 text-red-600" />
                <span className="font-mono text-sm text-red-700">Remaining: {getRemainingTime()}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Video Grid */}
      <div className="flex items-center justify-center p-6 pt-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1 gap-8 w-full max-w-6xl">

          {/* AI Interviewer Section */}
          <div className="space-y-4">
            {/* Company Info Header */}
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                    <span className="text-sm font-bold text-white">
                      {interviewDetails.organizationName.split(' ').map(word => word[0]).join('').slice(0, 2)}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">{interviewDetails.organizationName}</h3>
                    <p className="text-sm text-gray-600">AI Interviewer</p>
                  </div>
                </div>
                {/* AI Status Indicator */}
                <div className="flex items-center space-x-2">
                  <div className={`${getStatusDisplay(aiStatus).color} rounded-full px-3 py-1 flex items-center space-x-2`}>
                    {getStatusDisplay(aiStatus).icon}
                    <span className="text-white text-xs font-medium">{getStatusDisplay(aiStatus).text}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* AI Interviewer Video */}
            <div className="relative aspect-video bg-white rounded-2xl overflow-hidden shadow-xl border border-gray-200">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-100/30 to-purple-100/30"></div>

              {/* Speaking Animation Background */}
              {aiStatus === 'speaking' && (
                <div className="absolute inset-0 flex items-center justify-center z-0">
                  <div className="w-40 h-40 bg-blue-500/20 rounded-full ripple-effect"></div>
                  <div className="absolute w-32 h-32 bg-blue-500/30 rounded-full ripple-effect" style={{ animationDelay: '0.5s' }}></div>
                  <div className="absolute w-24 h-24 bg-blue-500/40 rounded-full ripple-effect" style={{ animationDelay: '1s' }}></div>
                  <div className="absolute w-56 h-56 bg-blue-400/15 rounded-full speaking-pulse"></div>
                </div>
              )}

              <div className="relative w-full h-full flex items-center justify-center z-10">
                <Image
                  src="/ai_recruiter.png"
                  alt="AI Interviewer"
                  width={200}
                  height={200}
                  className="object-cover"
                />
              </div>
              <div className="absolute bottom-4 left-4">
                <span className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium text-gray-700 shadow-sm border border-gray-200">
                  AI Interviewer
                </span>
              </div>
            </div>
          </div>

          {/* User Section */}
          <div className="space-y-4">
            {/* User Info Header */}
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-blue-600 rounded-lg flex items-center justify-center">
                    <span className="text-sm font-bold text-white">
                      {interviewDetails.intervieweeFullName.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">{interviewDetails.intervieweeFullName}</h3>
                    <p className="text-sm text-gray-600">Candidate - {interviewDetails.jobPosition}</p>
                  </div>
                </div>
                {/* User Status Indicator - Only show when interview is active */}
                {isInterviewStarted && (
                  <div className="flex items-center space-x-2">
                    <div className={`${getStatusDisplay(userStatus).color} rounded-full px-3 py-1 flex items-center space-x-2`}>
                      {getStatusDisplay(userStatus).icon}
                      <span className="text-white text-xs font-medium">{getStatusDisplay(userStatus).text}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* User Video */}
            <div className="relative aspect-video bg-white rounded-2xl overflow-hidden shadow-xl border border-gray-200">
              <div className="absolute inset-0 bg-gradient-to-br from-teal-100/30 to-blue-100/30"></div>

              {/* Video Element */}
              {stream && !cameraPermissionDenied && (
                <video
                  ref={videoRef}
                  autoPlay
                  muted
                  playsInline
                  className="w-full h-full object-cover mirror-video"
                />
              )}

              {/* Fallback when no video stream or camera denied */}
              {(!stream || cameraPermissionDenied) && (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6">
                  <div className="w-32 h-32 bg-gradient-to-br from-teal-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg mb-6">
                    <span className="text-3xl font-bold text-white">
                      {interviewDetails.intervieweeFullName.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div className="text-center space-y-2">
                    <h3 className="text-xl font-semibold text-gray-800">
                      {interviewDetails.intervieweeFullName}
                    </h3>
                    <p className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                      {interviewDetails.intervieweeEmail}
                    </p>
                    <div className="flex items-center justify-center space-x-2 mt-4">
                      {cameraPermissionDenied ? (
                        <>
                          <VideoOff className="w-4 h-4 text-red-500" />
                          <span className="text-sm text-red-600">Camera access denied</span>
                        </>
                      ) : (
                        <>
                          <Video className="w-4 h-4 text-blue-500" />
                          <span className="text-sm text-blue-600">Connecting to camera...</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              )}

              <div className="absolute bottom-4 left-4">
                <span className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium text-gray-700 shadow-sm border border-gray-200">
                  You
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Controls */}
      <div className="p-6">
        <div className="flex flex-col items-center space-y-4">

          {/* Interview Control Buttons */}
          {!isEnding && !isGeneratingFeedback && (
            <div className="flex items-center space-x-4">
              {!isInterviewStarted ? (
                <button
                  onClick={handleStartInterview}
                  disabled={isLoading || !isVapiReady}
                  className={`px-8 py-4 rounded-full font-semibold text-lg transition-all duration-200 shadow-lg flex items-center space-x-3 ${isLoading || !isVapiReady
                    ? 'bg-gray-400 cursor-not-allowed text-white'
                    : 'bg-green-500 hover:bg-green-600 text-white hover:shadow-xl transform hover:scale-105'
                    }`}
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Initializing...</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-6 h-6" />
                      <span>Start Interview</span>
                    </>
                  )}
                </button>
              ) : (
                <div>
                  <AlertConfirmation
                    onConfirm={handleEndInterview}
                    isLoading={isLoading}
                  >
                    <button
                      disabled={isLoading}
                      className={`px-8 py-4 rounded-full font-semibold text-lg transition-all duration-200 shadow-lg flex items-center space-x-3 ${isLoading
                        ? 'bg-gray-400 cursor-not-allowed text-white'
                        : 'bg-red-500 hover:bg-red-600 text-white hover:shadow-xl'
                        }`}
                    >
                      {isLoading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Ending...</span>
                        </>
                      ) : (
                        <>
                          <Square className="w-6 h-6" />
                          <span>End Interview</span>
                        </>
                      )}
                    </button>
                  </AlertConfirmation>
                </div>
              )}
            </div>
          )}

          {/* Status Text */}
          {/* // Update the status text to show feedback generation status */}
          {!isEnding && !isGeneratingFeedback ? (
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl px-6 py-4 shadow-lg border border-gray-200 max-w-md mx-auto">
              <div className="text-center">
                {!isInterviewStarted ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-center space-x-2">
                      {cameraPermissionDenied ? (
                        <>
                          <div className="w-3 h-3 bg-orange-400 rounded-full"></div>
                          <p className="text-gray-700 text-sm font-medium">
                            Camera access denied - continuing with audio only
                          </p>
                        </>
                      ) : !stream ? (
                        <>
                          <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
                          <p className="text-gray-700 text-sm font-medium">
                            Requesting camera and microphone access...
                          </p>
                        </>
                      ) : (
                        <>
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                          <p className="text-gray-700 text-sm font-medium">
                            Ready to start your interview
                          </p>
                        </>
                      )}
                    </div>

                    {(stream || cameraPermissionDenied) && (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                        <div className="flex items-center justify-center space-x-2">
                          <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <p className="text-green-700 text-sm font-medium">
                            {stream ? 'Camera and microphone connected' : 'Audio connected - ready to proceed'}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                      <p className="text-gray-700 text-sm font-medium">Interview in progress...</p>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                        <p className="text-blue-700 text-sm font-medium">
                          {stream ? 'Recording audio and video' : 'Recording audio'}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : isGeneratingFeedback ? (
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl px-6 py-4 shadow-lg border border-gray-200 max-w-md mx-auto">
              <div className="text-center">
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse"></div>
                  <p className="text-gray-700 text-sm font-medium">
                    {feedbackProgress || 'Processing interview completion...'}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl px-6 py-4 shadow-lg border border-gray-200 max-w-md mx-auto">
              <div className="text-center">Interview Ended</div>
            </div>
          )}
        </div>
      </div>
      {/* Loading Overlay for Feedback Generation */}
      {isGeneratingFeedback && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4">
            <div className="text-center">
              {/* Loading Animation */}
              <div className="relative w-20 h-20 mx-auto mb-6">
                <div className="absolute inset-0 border-4 border-blue-200 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <div className="absolute inset-2 bg-blue-50 rounded-full flex items-center justify-center">
                  <div className="w-8 h-8 bg-blue-600 rounded-full animate-pulse"></div>
                </div>
              </div>

              {/* Progress Text */}
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Processing Your Interview
              </h3>
              <p className="text-gray-600 mb-4">
                {feedbackProgress || 'Please wait while we generate your feedback...'}
              </p>

              {/* Progress Steps */}
              <div className="space-y-2 text-left">
                <div className={`flex items-center space-x-3 p-2 rounded-lg transition-colors ${feedbackProgress.includes('Analyzing') ? 'bg-blue-50 text-blue-700' :
                  feedbackProgress.includes('Processing') || feedbackProgress.includes('Saving') || feedbackProgress.includes('successfully') ? 'bg-green-50 text-green-700' : 'text-gray-400'
                  }`}>
                  <div className={`w-2 h-2 rounded-full ${feedbackProgress.includes('Analyzing') ? 'bg-blue-500 animate-pulse' :
                    feedbackProgress.includes('Processing') || feedbackProgress.includes('Saving') || feedbackProgress.includes('successfully') ? 'bg-green-500' : 'bg-gray-300'
                    }`}></div>
                  <span className="text-sm font-medium">Analyzing your responses</span>
                </div>

                <div className={`flex items-center space-x-3 p-2 rounded-lg transition-colors ${feedbackProgress.includes('Processing') ? 'bg-blue-50 text-blue-700' :
                  feedbackProgress.includes('Saving') || feedbackProgress.includes('successfully') ? 'bg-green-50 text-green-700' : 'text-gray-400'
                  }`}>
                  <div className={`w-2 h-2 rounded-full ${feedbackProgress.includes('Processing') ? 'bg-blue-500 animate-pulse' :
                    feedbackProgress.includes('Saving') || feedbackProgress.includes('successfully') ? 'bg-green-500' : 'bg-gray-300'
                    }`}></div>
                  <span className="text-sm font-medium">Generating AI feedback</span>
                </div>

                <div className={`flex items-center space-x-3 p-2 rounded-lg transition-colors ${feedbackProgress.includes('Saving') ? 'bg-blue-50 text-blue-700' :
                  feedbackProgress.includes('successfully') ? 'bg-green-50 text-green-700' : 'text-gray-400'
                  }`}>
                  <div className={`w-2 h-2 rounded-full ${feedbackProgress.includes('Saving') ? 'bg-blue-500 animate-pulse' :
                    feedbackProgress.includes('successfully') ? 'bg-green-500' : 'bg-gray-300'
                    }`}></div>
                  <span className="text-sm font-medium">Finalizing your results</span>
                </div>
              </div>

              {/* Additional Info */}
              <div className="mt-6 text-xs text-gray-500 bg-gray-50 p-3 rounded-lg">
                This process usually takes 10-30 seconds. Please don't close this window.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default StartInterview