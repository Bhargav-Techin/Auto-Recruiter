'use client'
import React from 'react';
import { AlertTriangle, Mail, Phone, Clock, Users, Shield, Heart, ArrowRight, CheckCircle, Headphones } from 'lucide-react';

function CompleteFailedInterview() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating orbs */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-r from-orange-300 to-red-400 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-gradient-to-r from-pink-300 to-rose-400 rounded-full opacity-30 animate-bounce"></div>
        <div className="absolute bottom-32 left-16 w-12 h-12 bg-gradient-to-r from-amber-300 to-orange-400 rounded-full opacity-25 animate-pulse"></div>
        <div className="absolute bottom-20 right-32 w-24 h-24 bg-gradient-to-r from-red-300 to-pink-400 rounded-full opacity-15 animate-bounce"></div>
        
        {/* Geometric shapes */}
        <div className="absolute top-1/3 left-8 w-8 h-8 bg-orange-200 rotate-45 opacity-30 animate-spin-slow"></div>
        <div className="absolute bottom-1/3 right-12 w-6 h-6 bg-red-200 rounded-full opacity-40 animate-ping"></div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        
        @keyframes glow-orange {
          0%, 100% { box-shadow: 0 0 20px rgba(251, 146, 60, 0.4); }
          50% { box-shadow: 0 0 40px rgba(251, 146, 60, 0.7); }
        }
        
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0px); }
        }
        
        @keyframes bounce-gentle {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes wiggle {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(-3deg); }
          75% { transform: rotate(3deg); }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-glow-orange {
          animation: glow-orange 3s ease-in-out infinite;
        }
        
        .animate-slide-in {
          animation: slideIn 0.8s ease-out forwards;
        }
        
        .animate-bounce-gentle {
          animation: bounce-gentle 2s ease-in-out infinite;
        }
        
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
        
        .animate-wiggle {
          animation: wiggle 2s ease-in-out infinite;
        }
        
        .delay-200 { animation-delay: 0.2s; }
        .delay-400 { animation-delay: 0.4s; }
        .delay-600 { animation-delay: 0.6s; }
        .delay-800 { animation-delay: 0.8s; }
      `}</style>

      <div className="relative z-10 max-w-4xl mx-auto p-6">
        {/* Main Issue Header */}
        <div className="text-center mb-12 animate-slide-in">
          {/* Warning Icon with Glow Effect */}
          <div className="relative inline-flex items-center justify-center mb-8">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-red-500 rounded-full blur-xl opacity-30 animate-glow-orange"></div>
            <div className="relative w-32 h-32 bg-gradient-to-br from-orange-400 via-red-500 to-pink-500 rounded-full flex items-center justify-center shadow-2xl">
              <AlertTriangle className="w-16 h-16 text-white animate-wiggle" />
            </div>
          </div>

          {/* Issue Message */}
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 animate-slide-in delay-200">
            ⚠️ Technical Issue Detected
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed animate-slide-in delay-400">
            Your interview was completed successfully! However, we encountered a technical issue while 
            processing your feedback. Don't worry - your responses are safely stored.
          </p>
        </div>

        {/* Status Update Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/50 overflow-hidden mb-8 animate-slide-in delay-600">
          <div className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 p-8 text-white">
            <h2 className="text-2xl font-bold mb-3 flex items-center">
              <Shield className="w-6 h-6 mr-3 animate-bounce-gentle" />
              Your Interview is Safe & Complete
            </h2>
            <p className="text-orange-100 text-lg">
              Here's what we want you to know about the situation
            </p>
          </div>

          <div className="p-8">
            <div className="space-y-6">
              {/* Status 1 - Interview Completed */}
              <div className="flex items-start space-x-4 group hover:transform hover:scale-105 transition-all duration-300">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    ✅ Interview Successfully Completed
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    Your interview responses have been successfully recorded and securely stored in our system. 
                    All your answers, including technical discussions and behavioral questions, are completely safe.
                  </p>
                  <div className="mt-3 flex items-center text-green-600 text-sm font-medium">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    All responses safely stored
                  </div>
                </div>
              </div>

              {/* Status 2 - Technical Issue */}
              <div className="flex items-start space-x-4 group hover:transform hover:scale-105 transition-all duration-300">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
                  <AlertTriangle className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    ⚠️ Feedback Processing Issue
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    Our AI feedback generation system experienced a temporary technical issue. This is a minor setback 
                    that doesn't affect your interview results or application status in any way.
                  </p>
                  <div className="mt-3 flex items-center text-orange-600 text-sm font-medium">
                    <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse mr-2"></div>
                    Technical team has been notified
                  </div>
                </div>
              </div>

              {/* Status 3 - HR Team Contact */}
              <div className="flex items-start space-x-4 group hover:transform hover:scale-105 transition-all duration-300">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    👥 HR Team Will Contact You
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    Our HR team has been automatically notified about this technical issue. They will personally 
                    review your interview and provide feedback manually within the next 24-48 hours.
                  </p>
                  <div className="mt-3 flex items-center text-blue-600 text-sm font-medium">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse mr-2"></div>
                    HR team notified automatically
                  </div>
                </div>
              </div>

              {/* Status 4 - No Impact on Application */}
              <div className="flex items-start space-x-4 group hover:transform hover:scale-105 transition-all duration-300">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    💜 Your Application Continues Normally
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    This technical issue does not affect your candidacy or application process. Your interview 
                    performance will be evaluated with the same care and attention as all other candidates.
                  </p>
                  <div className="mt-3 flex items-center text-purple-600 text-sm font-medium">
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse mr-2"></div>
                    Application process unaffected
                  </div>
                </div>
              </div>
            </div>

            {/* What to Expect Timeline */}
            <div className="mt-8 pt-8 border-t border-gray-200">
              <h4 className="text-lg font-semibold text-gray-900 mb-4 text-center">Expected Timeline</h4>
              <div className="flex items-center justify-between text-sm text-gray-500">
                <div className="flex flex-col items-center space-y-2">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-center">Interview<br/>Completed</span>
                </div>
                <div className="flex-1 h-px bg-gradient-to-r from-green-300 to-blue-300 mx-4"></div>
                <div className="flex flex-col items-center space-y-2">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <Users className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-center">HR Review<br/>24-48 hours</span>
                </div>
                <div className="flex-1 h-px bg-gradient-to-r from-blue-300 to-purple-300 mx-4"></div>
                <div className="flex flex-col items-center space-y-2">
                  <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                    <Mail className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-center">Personal<br/>Feedback</span>
                </div>
                <div className="flex-1 h-px bg-gradient-to-r from-purple-300 to-pink-300 mx-4"></div>
                <div className="flex flex-col items-center space-y-2">
                  <div className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center">
                    <ArrowRight className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-center">Next Steps<br/>3-5 days</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Support Section */}
        <div className="bg-gradient-to-r from-blue-500 via-indigo-600 to-purple-700 rounded-3xl shadow-2xl text-white p-8 mb-8 animate-slide-in delay-800">
          <div className="text-center mb-6">
            <div className="flex items-center justify-center mb-4">
              <Headphones className="w-8 h-8 text-blue-200 mr-3 animate-bounce-gentle" />
              <h3 className="text-2xl font-bold">Need Immediate Help?</h3>
            </div>
            <p className="text-lg text-blue-100 leading-relaxed max-w-2xl mx-auto">
              While our HR team will contact you automatically, feel free to reach out if you have any immediate concerns.
            </p>
          </div>

          {/* Contact Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/20 transition-all duration-300 group">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-lg">Email Support</h4>
                  <p className="text-blue-200">hr-support@company.com</p>
                  <p className="text-blue-300 text-sm">Response within 2-4 hours</p>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/20 transition-all duration-300 group">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Phone className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-lg">Phone Support</h4>
                  <p className="text-blue-200">+1 (555) 123-4567</p>
                  <p className="text-blue-300 text-sm">Mon-Fri 9AM-5PM EST</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 text-center">
            <div className="inline-flex items-center px-6 py-3 bg-white/20 backdrop-blur-sm rounded-full">
              <span className="text-white font-medium">Reference ID: INT-{Math.random().toString(36).substring(2, 15).toUpperCase()}</span>
            </div>
          </div>
        </div>

        {/* Reassurance Message */}
        <div className="bg-gradient-to-r from-emerald-400 via-teal-500 to-cyan-600 rounded-3xl shadow-2xl text-white p-8 text-center animate-slide-in delay-800">
          <div className="flex items-center justify-center mb-4">
            <Heart className="w-8 h-8 text-emerald-200 mr-3 animate-bounce-gentle" />
            <h3 className="text-2xl font-bold">Everything is Under Control!</h3>
          </div>
          <p className="text-lg text-emerald-100 leading-relaxed max-w-3xl mx-auto mb-6">
            Technical hiccups happen, but your interview success is our priority. Our HR team will ensure you receive 
            personalized attention and detailed feedback. Thank you for your patience and understanding.
          </p>
          <div className="inline-flex items-center px-8 py-4 bg-white/20 backdrop-blur-sm rounded-full">
            <span className="text-white font-medium text-lg">Your interview matters to us</span>
            <Heart className="w-5 h-5 ml-2 text-pink-200 animate-bounce-gentle" />
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 animate-slide-in delay-800">
          <p className="text-gray-500 mb-2">
            Technical issue reported on {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}
          </p>
          <div className="flex items-center justify-center space-x-2 text-gray-400">
            <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
            <span className="text-sm">HR team automatically notified • Personal review in progress</span>
            <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CompleteFailedInterview;