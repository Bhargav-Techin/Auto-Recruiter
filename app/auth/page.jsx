'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { FaGoogle, FaRocket, FaChartLine, FaSearchDollar, FaUserTie } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { supabase } from '@/services/supabaseClient';
import { toast } from 'sonner';
export default function Login() {

  const publicBaseUrl = process.env.NEXT_PUBLIC_BASE_URL;


  const signInWithGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${publicBaseUrl}/dashboard`
        }
      });

      if (error) {
        console.error('Auth error:', error);
        toast.error(`Login failed: ${error.message}`);
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      toast.error('An unexpected error occurred');
    }
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      const x = e.clientX / window.innerWidth;
      const y = e.clientY / window.innerHeight;

      document.documentElement.style.setProperty('--mouse-x', x);
      document.documentElement.style.setProperty('--mouse-y', y);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 px-4 sm:px-0">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-sm w-full py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex justify-between items-center">
          <Image
            src="/logo.png"
            alt="AutoRecruit Logo"
            width={150}
            height={40}
            className="h-10 object-contain"
            priority
          />
        </div>
      </nav>

      <div className="flex flex-col md:flex-row flex-grow">
        {/* Left side - Login section */}
        <div className="w-full md:w-1/3 bg-gradient-to-br from-blue-600 to-indigo-800 text-white flex flex-col items-center justify-center p-8 md:p-12 relative overflow-hidden">
          {/* Decorative background elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-20 left-20 w-64 h-64 bg-white rounded-full opacity-5 blur-3xl"></div>
            <div className="absolute bottom-20 right-20 w-80 h-80 bg-blue-300 rounded-full opacity-10 blur-3xl"></div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-sm"
          >
            {/* Login illustration */}
            <motion.div
              className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-lg mb-8"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <Image
                src="/login.png"
                alt="Login Illustration"
                width={400}
                height={100}
                className="object-cover"
              />
            </motion.div>

            {/* Text content */}
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-3xl font-bold text-center mb-4"
            >
              Welcome to AutoRecruit
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-blue-100 text-center mb-8"
            >
              Sign in to access your intelligent recruitment platform
            </motion.p>

            {/* Sign-in button */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <Button
                className="w-full bg-white text-blue-800 hover:bg-blue-50 py-6 rounded-xl flex items-center justify-center gap-2 font-medium text-lg transition-all duration-300 shadow-md hover:shadow-lg"
                onClick={signInWithGoogle}
              >
                <FaGoogle className="text-xl" />
                Sign in with Google
              </Button>
            </motion.div>

            {/* Additional information */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="text-sm text-blue-200 mt-6 text-center"
            >
              By continuing, you agree to our Terms of Service and Privacy Policy
            </motion.p>
          </motion.div>
        </div>

        {/* Right side - Enhanced scrollable information */}
        <div className="w-full md:w-2/3 h-[calc(100vh-4rem)] overflow-y-auto bg-gradient-to-b from-blue-200 to-blue-50">
          <div className="p-6 sm:p-8 md:p-12 max-w-3xl mx-auto">
            {/* Hero section */}
            <div className="mb-12 bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100">
              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-3xl sm:text-4xl font-bold text-gray-800 mb-6"
              >
                Transform Your Hiring Process with AI-Powered Recruitment
              </motion.h2>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-lg text-gray-600 mb-8"
              >
                AutoRecruit leverages cutting-edge artificial intelligence to streamline your entire recruitment workflow,
                from application screening to candidate assessment and interview scheduling.
              </motion.p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                  className="bg-blue-50 p-6 rounded-xl shadow-sm border border-blue-100"
                >
                  <div className="flex items-center mb-3">
                    <FaRocket className="text-blue-600 text-2xl mr-3" />
                    <h3 className="text-xl font-semibold text-gray-800">Automate Screening</h3>
                  </div>
                  <p className="text-gray-600">
                    Reduce time-to-hire by 70% with AI-powered CV parsing and candidate matching.
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 }}
                  className="bg-blue-50 p-6 rounded-xl shadow-sm border border-blue-100"
                >
                  <div className="flex items-center mb-3">
                    <FaChartLine className="text-blue-600 text-2xl mr-3" />
                    <h3 className="text-xl font-semibold text-gray-800">Data-Driven Hiring</h3>
                  </div>
                  <p className="text-gray-600">
                    Make better hiring decisions with comprehensive analytics and candidate insights.
                  </p>
                </motion.div>
              </div>
            </div>

            {/* Features section */}
            <div className="mb-12 bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-3xl font-bold text-gray-800 mb-8 border-b border-gray-100 pb-4">Key Features</h2>

              <div className="space-y-8">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className="flex items-start"
                >
                  <div className="bg-blue-100 p-3 rounded-lg mr-4 flex-shrink-0">
                    <FaSearchDollar className="text-blue-600 text-xl" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">Smart Candidate Matching</h3>
                    <p className="text-gray-600">
                      Our proprietary AI algorithm matches job requirements with candidate skills, experience, and potential.
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  className="flex items-start"
                >
                  <div className="bg-blue-100 p-3 rounded-lg mr-4 flex-shrink-0">
                    <FaUserTie className="text-blue-600 text-xl" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">Automated Interview Scheduling</h3>
                    <p className="text-gray-600">
                      Eliminate email back-and-forth with our intelligent scheduling system.
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 }}
                  className="flex items-start"
                >
                  <div className="bg-blue-100 p-3 rounded-lg mr-4 flex-shrink-0">
                    <FaChartLine className="text-blue-600 text-xl" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">Recruitment Analytics Dashboard</h3>
                    <p className="text-gray-600">
                      Gain insights into your hiring process with comprehensive analytics.
                    </p>
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Testimonials */}
            <div className="mb-12 bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-3xl font-bold text-gray-800 mb-8 border-b border-gray-100 pb-4">What Our Clients Say</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.0 }}
                  className="bg-blue-50 p-6 rounded-xl shadow-sm border border-blue-100"
                >
                  <p className="text-gray-600 italic mb-4">
                    "AutoRecruit has revolutionized our hiring process. We've reduced our time-to-hire by 65%."
                  </p>
                  <p className="font-medium text-gray-800">Sarah Johnson, HR Director at TechGlobal</p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.1 }}
                  className="bg-blue-50 p-6 rounded-xl shadow-sm border border-blue-100"
                >
                  <p className="text-gray-600 italic mb-4">
                    "The AI-powered candidate matching is incredibly accurate."
                  </p>
                  <p className="font-medium text-gray-800">Michael Chen, Talent Acquisition Lead</p>
                </motion.div>
              </div>
            </div>

            {/* Pricing info */}
            <div className="mb-12 bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-3xl font-bold text-gray-800 mb-8 border-b border-gray-100 pb-4">Simple, Transparent Pricing</h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2 }}
                  className="bg-white p-6 rounded-xl shadow-md border border-gray-200 hover:shadow-lg transition-all duration-300"
                >
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-gray-800">Starter</h3>
                    <div className="text-3xl font-bold text-blue-600 mt-2">$99<span className="text-base font-normal text-gray-600">/month</span></div>
                  </div>
                  <ul className="space-y-3 mb-6">
                    <li className="flex items-center text-gray-600">
                      <svg className="w-5 h-5 mr-2 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                      </svg>
                      Up to 5 active job postings
                    </li>
                    <li className="flex items-center text-gray-600">
                      <svg className="w-5 h-5 mr-2 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                      </svg>
                      AI candidate matching
                    </li>
                  </ul>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.3 }}
                  className="bg-blue-600 p-6 rounded-xl shadow-lg border border-blue-500 transform scale-105 relative"
                >
                  <div className="absolute -top-3 right-8 bg-yellow-400 text-blue-900 text-xs font-bold px-3 py-1 rounded-full">MOST POPULAR</div>
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-white">Professional</h3>
                    <div className="text-3xl font-bold text-white mt-2">$249<span className="text-base font-normal text-blue-200">/month</span></div>
                  </div>
                  <ul className="space-y-3 mb-6">
                    <li className="flex items-center text-blue-100">
                      <svg className="w-5 h-5 mr-2 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                      </svg>
                      Unlimited job postings
                    </li>
                    <li className="flex items-center text-blue-100">
                      <svg className="w-5 h-5 mr-2 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                      </svg>
                      Advanced AI matching
                    </li>
                  </ul>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.4 }}
                  className="bg-white p-6 rounded-xl shadow-md border border-gray-200 hover:shadow-lg transition-all duration-300"
                >
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-gray-800">Enterprise</h3>
                    <div className="text-3xl font-bold text-blue-600 mt-2">Custom<span className="text-base font-normal text-gray-600"> pricing</span></div>
                  </div>
                  <ul className="space-y-3 mb-6">
                    <li className="flex items-center text-gray-600">
                      <svg className="w-5 h-5 mr-2 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                      </svg>
                      Everything in Professional
                    </li>
                    <li className="flex items-center text-gray-600">
                      <svg className="w-5 h-5 mr-2 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                      </svg>
                      Custom AI model training
                    </li>
                  </ul>
                </motion.div>
              </div>
            </div>

            {/* Footer */}
            <footer className="text-center text-gray-600 pt-8 border-t border-gray-200 pb-8">
              <p>© 2025 AutoRecruit. All rights reserved.</p>
              <div className="flex justify-center space-x-4 mt-4">
                <a href="#" className="text-gray-500 hover:text-blue-600 transition-colors">Privacy Policy</a>
                <a href="#" className="text-gray-500 hover:text-blue-600 transition-colors">Terms of Service</a>
                <a href="#" className="text-gray-500 hover:text-blue-600 transition-colors">Contact Us</a>
              </div>
            </footer>
          </div>
        </div>
      </div>
    </div>
  );
}