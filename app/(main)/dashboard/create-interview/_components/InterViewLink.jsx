import React, { useState } from 'react';
import { Check, Clock, HelpCircle, Calendar, Copy, Mail, MessageSquare, ArrowLeft, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { toast } from 'sonner';

function InterViewLink({ interview_id, formData, questionsList }) {
    const [copied, setCopied] = useState(false);

    const interviewLink = process.env.NEXT_PUBLIC_HOST_URL + '/' + interview_id;

    const handleCopyLink = () => {
        navigator.clipboard.writeText(interviewLink);
        toast.success('Interview Link Copied to Clipboard');
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleShare = (platform) => {
        const message = "Please complete your AI interview using this link: " + interviewLink;

        switch (platform) {
            case 'email':
                window.open(`mailto:?subject=AI Interview Link&body=${encodeURIComponent(message)}`);
                break;
            case 'slack':
                // In a real app, you'd integrate with Slack API
                console.log('Share to Slack:', message);
                break;
            case 'whatsapp':
                window.open(`https://wa.me/?text=${encodeURIComponent(message)}`);
                break;
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4">
            <div className="max-w-2xl mx-auto">
                {/* Success Icon and Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full mb-4 shadow-lg shadow-green-500/25">
                        <Check className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-2">
                        Your AI Interview is Ready!
                    </h1>
                    <p className="text-gray-600 text-lg">
                        Share this link with your candidates to start the interview process
                    </p>
                </div>

                {/* Interview Link Card */}
                <div className="group relative p-6 bg-gradient-to-br from-white via-white to-white/80 border border-gray-200/40 rounded-2xl shadow-lg hover:border-blue-500/40 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 mb-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-gray-900">Interview Link</h2>
                        <span className="inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full bg-blue-500/10 text-blue-600 border border-blue-500/20 backdrop-blur-sm">
                            <span className="w-1.5 h-1.5 rounded-full mr-2 bg-blue-500"></span>
                            Valid for 30 days
                        </span>
                    </div>

                    <div className="flex items-center gap-3 mb-4">
                        <div className="flex-1 bg-gray-50/50 p-3 rounded-lg border border-gray-200/50 backdrop-blur-sm">
                            <code className="text-sm text-gray-700 break-all font-mono">
                                {interviewLink}
                            </code>
                        </div>
                        <Button
                            onClick={handleCopyLink}
                            className="text-white shadow-lg hover:shadow-blue-500/25 transition-all duration-300 hover:-translate-y-1"
                        >
                            <Copy className="w-4 h-4 mr-2" />
                            {copied ? 'Copied!' : 'Copy Link'}
                        </Button>
                    </div>

                    {/* Interview Details */}
                    <div className="flex items-center gap-6 text-sm text-gray-500">
                        <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-blue-500" />
                            <span>{formData?.interviewDuration || 'N/A'} Minutes</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <HelpCircle className="w-4 h-4 text-blue-500" />
                            <span>{questionsList.length || 'N/A'} Questions</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-blue-500" />
                            <span>Expires: Nov 20, 2025</span>
                        </div>
                    </div>

                    {/* Hover Overlay Glow */}
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500/0 via-blue-500/5 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                </div>

                {/* Share Options */}
                <div className="group relative p-6 bg-gradient-to-br from-white via-white to-white/80 border border-gray-200/40 rounded-2xl shadow-lg hover:border-blue-500/40 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 hover:-translate-y-1 mb-8">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Share via</h3>
                    <div className="flex gap-4">
                        <Button
                            onClick={() => handleShare('email')}
                            variant="outline"
                            className="flex-1 bg-gray-50/50 hover:bg-orange-400 text-gray-700 hover:text-white border-gray-200/50 hover:border-orange-500 transition-all duration-300 hover:shadow-lg hover:shadow-red-500/25 backdrop-blur-sm"
                        >
                            <Mail className="w-5 h-5 mr-2" />
                            Email
                        </Button>
                        <Button
                            onClick={() => handleShare('slack')}
                            variant="outline"
                            className="flex-1 bg-gray-50/50 hover:bg-purple-600 text-gray-700 hover:text-white border-gray-200/50 hover:border-purple-700 transition-all duration-300 hover:shadow-lg hover:shadow-purple-600/25 backdrop-blur-sm"
                        >
                            <MessageSquare className="w-5 h-5 mr-2" />
                            Slack
                        </Button>
                        <Button
                            onClick={() => handleShare('whatsapp')}
                            variant="outline"
                            className="flex-1 bg-gray-50/50 hover:bg-green-500 text-gray-700 hover:text-white border-gray-200/50 hover:border-green-600 transition-all duration-300 hover:shadow-lg hover:shadow-green-500/25 backdrop-blur-sm"
                        >
                            <MessageSquare className="w-5 h-5 mr-2" />
                            WhatsApp
                        </Button>
                    </div>

                    {/* Hover Overlay Glow */}
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500/0 via-blue-500/5 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                </div>

                {/* Bottom Actions */}
                <div className="flex gap-4">
                    <Link href="/dashboard" className="flex-1/3">
                        <Button
                            variant="outline"
                            className="w-full bg-white/50 hover:bg-gray-50/50 border-gray-200/50 text-gray-600 hover:text-gray-800 transition-all duration-300 hover:shadow-md hover:shadow-gray-500/10 backdrop-blur-sm"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Dashboard
                        </Button>
                    </Link>
                    <Link href="/dashboard/create-interview" className="flex-1/2">
                        <Button
                            className="w-full hover:shadow-md hover:shadow-gray-500/10 backdrop-blur-sm"
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Create New Interview
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default InterViewLink;