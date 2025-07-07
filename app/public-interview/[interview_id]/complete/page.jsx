'use client'
import React from 'react';
import { CheckCircle, Mail, Clock, Users, Star, Heart, Coffee, Calendar, ArrowRight } from 'lucide-react';

function CompleteInterview() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating orbs */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-r from-emerald-300 to-teal-400 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-gradient-to-r from-cyan-300 to-blue-400 rounded-full opacity-30 animate-bounce"></div>
        <div className="absolute bottom-32 left-16 w-12 h-12 bg-gradient-to-r from-green-300 to-emerald-400 rounded-full opacity-25 animate-pulse"></div>
        <div className="absolute bottom-20 right-32 w-24 h-24 bg-gradient-to-r from-teal-300 to-cyan-400 rounded-full opacity-15 animate-bounce"></div>
        
        {/* Geometric shapes */}
        <div className="absolute top-1/3 left-8 w-8 h-8 bg-emerald-200 rotate-45 opacity-30 animate-spin-slow"></div>
        <div className="absolute bottom-1/3 right-12 w-6 h-6 bg-teal-200 rounded-full opacity-40 animate-ping"></div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 20px rgba(16, 185, 129, 0.3); }
          50% { box-shadow: 0 0 40px rgba(16, 185, 129, 0.6); }
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
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-glow {
          animation: glow 3s ease-in-out infinite;
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
        
        .delay-200 { animation-delay: 0.2s; }
        .delay-400 { animation-delay: 0.4s; }
        .delay-600 { animation-delay: 0.6s; }
        .delay-800 { animation-delay: 0.8s; }
      `}</style>

      <div className="relative z-10 max-w-4xl mx-auto p-6">
        {/* Main Success Card */}
        <div className="text-center mb-12 animate-slide-in">
          {/* Success Icon with Glow Effect */}
          <div className="relative inline-flex items-center justify-center mb-8">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full blur-xl opacity-30 animate-glow"></div>
            <div className="relative w-32 h-32 bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-500 rounded-full flex items-center justify-center shadow-2xl">
              <CheckCircle className="w-16 h-16 text-white animate-bounce-gentle" />
            </div>
          </div>

          {/* Success Message */}
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 animate-slide-in delay-200">
            🎉 Interview Complete!
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed animate-slide-in delay-400">
            Congratulations! You've successfully completed your AI interview. 
            Your responses have been carefully recorded and are now being processed.
          </p>
        </div>

        {/* What Happens Next Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/50 overflow-hidden mb-8 animate-slide-in delay-600">
          <div className="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 p-8 text-white">
            <h2 className="text-2xl font-bold mb-3 flex items-center">
              <Star className="w-6 h-6 mr-3 animate-bounce-gentle" />
              What Happens Next?
            </h2>
            <p className="text-emerald-100 text-lg">
              Here's what you can expect in the coming days
            </p>
          </div>

          <div className="p-8">
            <div className="space-y-6">
              {/* Step 1 */}
              <div className="flex items-start space-x-4 group hover:transform hover:scale-105 transition-all duration-300">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Processing Your Responses
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    Our AI system is currently analyzing your interview responses and generating detailed insights. 
                    This process typically takes 10-15 minutes to ensure accuracy.
                  </p>
                  <div className="mt-3 flex items-center text-blue-600 text-sm font-medium">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse mr-2"></div>
                    Currently processing...
                  </div>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex items-start space-x-4 group hover:transform hover:scale-105 transition-all duration-300">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Email Confirmation Coming Soon
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    You'll receive a detailed email confirmation within the next 30 minutes containing your interview summary, 
                    AI-generated feedback, and performance insights.
                  </p>
                  <div className="mt-3 flex items-center text-emerald-600 text-sm font-medium">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse mr-2"></div>
                    Expected within 30 minutes
                  </div>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex items-start space-x-4 group hover:transform hover:scale-105 transition-all duration-300">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Hiring Team Review
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    Our hiring team will carefully review your interview along with the AI insights. 
                    They'll evaluate your responses, technical skills, and cultural fit.
                  </p>
                  <div className="mt-3 flex items-center text-purple-600 text-sm font-medium">
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse mr-2"></div>
                    Review in progress
                  </div>
                </div>
              </div>

              {/* Step 4 */}
              <div className="flex items-start space-x-4 group hover:transform hover:scale-105 transition-all duration-300">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Next Steps Communication
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    We'll reach out within 3-5 business days with updates on your application status. 
                    This may include next interview rounds, assessments, or final decisions.
                  </p>
                  <div className="mt-3 flex items-center text-orange-600 text-sm font-medium">
                    <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse mr-2"></div>
                    Expected within 3-5 business days
                  </div>
                </div>
              </div>
            </div>

            {/* Timeline Visual */}
            <div className="mt-8 pt-8 border-t border-gray-200">
              <div className="flex items-center justify-between text-sm text-gray-500">
                <div className="flex flex-col items-center space-y-2">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                  </div>
                  <span>Now</span>
                </div>
                <div className="flex-1 h-px bg-gradient-to-r from-blue-300 to-emerald-300 mx-4"></div>
                <div className="flex flex-col items-center space-y-2">
                  <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center">
                    <Mail className="w-4 h-4 text-white" />
                  </div>
                  <span>30 min</span>
                </div>
                <div className="flex-1 h-px bg-gradient-to-r from-emerald-300 to-purple-300 mx-4"></div>
                <div className="flex flex-col items-center space-y-2">
                  <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                    <Users className="w-4 h-4 text-white" />
                  </div>
                  <span>1-2 days</span>
                </div>
                <div className="flex-1 h-px bg-gradient-to-r from-purple-300 to-orange-300 mx-4"></div>
                <div className="flex flex-col items-center space-y-2">
                  <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                    <Calendar className="w-4 h-4 text-white" />
                  </div>
                  <span>3-5 days</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Encouragement Section */}
        <div className="bg-gradient-to-r from-pink-400 via-purple-500 to-indigo-600 rounded-3xl shadow-2xl text-white p-8 text-center animate-slide-in delay-800">
          <div className="flex items-center justify-center mb-4">
            <Heart className="w-8 h-8 text-pink-200 mr-3 animate-bounce-gentle" />
            <h3 className="text-2xl font-bold">Thank You!</h3>
            <Coffee className="w-8 h-8 text-yellow-200 ml-3 animate-bounce-gentle" />
          </div>
          <p className="text-lg text-purple-100 leading-relaxed max-w-2xl mx-auto">
            We appreciate the time and effort you put into this interview. 
            Your thoughtful responses help us understand your potential and passion. 
            We're excited about the possibility of working together!
          </p>
          <div className="mt-6 inline-flex items-center px-6 py-3 bg-white/20 backdrop-blur-sm rounded-full">
            <span className="text-white font-medium">Keep an eye on your inbox</span>
            <ArrowRight className="w-5 h-5 ml-2 animate-bounce-gentle" />
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 animate-slide-in delay-800">
          <p className="text-gray-500">
            Interview completed on {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}
          </p>
          <div className="mt-4 flex items-center justify-center space-x-2 text-gray-400">
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
            <span className="text-sm">Powered by AI Interview System</span>
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CompleteInterview;