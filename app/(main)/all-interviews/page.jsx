"use client"

import { Button } from '@/components/ui/button';
import { Plus, Calendar, Clock, Users, Building2, Eye, Share2, Briefcase, X, MapPin, FileText, Mail, MessageSquare } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/services/supabaseClient';
import { toast } from 'sonner';
import { useUser } from '@/app/provider';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

function AllInterview() {
  const router = useRouter();
  const [interviewList, setInterviewList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedInterview, setSelectedInterview] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const { user } = useUser();

  const publicBaseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

  useEffect(() => {
    // Get user email from useUser hook
    if (user?.email) {
      fetchAllInterviews(user.email);
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchAllInterviews = async (email) => {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from('Interviews')
        .select('*')
        .eq('userEmail', email)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching interviews:', error);
        toast.error('Failed to load interviews');
        return;
      }

      setInterviewList(data || []);
    } catch (error) {
      console.error('Unexpected error:', error);
      toast.error('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatDetailedDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getInterviewTypeColors = (types) => {
    const colors = {
      'Technical': 'bg-blue-100 text-blue-800 border-blue-200',
      'Behavioral': 'bg-green-100 text-green-800 border-green-200',
      'Coding': 'bg-purple-100 text-purple-800 border-purple-200',
      'System Design': 'bg-orange-100 text-orange-800 border-orange-200',
      'Cultural': 'bg-pink-100 text-pink-800 border-pink-200'
    };

    let typeArray = [];
    if (Array.isArray(types)) {
      typeArray = types;
    } else if (typeof types === 'string') {
      try {
        typeArray = JSON.parse(types);
      } catch {
        typeArray = types.includes(',') ? types.split(',').map(t => t.trim()) : [types];
      }
    }

    return typeArray.map(type => colors[type] || 'bg-gray-100 text-gray-800 border-gray-200');
  };

  const parseInterviewTypes = (types) => {
    if (Array.isArray(types)) {
      return types;
    } else if (typeof types === 'string') {
      try {
        return JSON.parse(types);
      } catch {
        return types.includes(',') ? types.split(',').map(t => t.trim()) : [types];
      }
    }
    return [];
  };

  const handleViewInterview = (interview) => {
    console.log('Selected interview:', interview);
    setSelectedInterview(interview);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setTimeout(() => {
      setSelectedInterview(null);
    }, 200);
  };

  const handleShareInterview = (interviewId) => {
    if (typeof window !== 'undefined') {
      const shareUrl = `${publicBaseUrl}/public-interview/${interviewId}`;
      navigator.clipboard.writeText(shareUrl);
      toast.success('Interview link copied to clipboard!');
    }
  };

  const handleCopyInterviewLink = (interviewId) => {
    if (typeof window !== 'undefined') {
      const shareUrl = `${publicBaseUrl}/public-interview/${interviewId}`;
      navigator.clipboard.writeText(shareUrl);
      toast.success('Interview Link Copied to Clipboard');
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleShareVia = (platform, interviewId) => {
    if (typeof window === 'undefined') return;

    const shareUrl = `${publicBaseUrl}/public-interview/${interviewId}`;
    const message = "Please complete your AI interview using this link: " + shareUrl;

    switch (platform) {
      case 'email':
        window.open(`mailto:?subject=AI Interview Link&body=${encodeURIComponent(message)}`);
        break;
      case 'slack':
        navigator.clipboard.writeText(message);
        toast.success('Message copied to clipboard for Slack sharing');
        break;
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(message)}`);
        break;
    }
  };

  const LoadingSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
        <Card key={i} className="animate-pulse">
          <CardHeader>
            <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </CardHeader>
          <CardContent>
            <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </CardContent>
          <CardFooter>
            <div className="h-8 bg-gray-200 rounded w-20 mr-2"></div>
            <div className="h-8 bg-gray-200 rounded w-16"></div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );

  return (
    <div className='my-4'>
      <div className='py-4 border-b'>
        <div className="flex items-center justify-between">
          <h2 className='text-2xl font-bold my-4'>All Previously Created Interviews</h2>
          <Button
            className='bg-primary text-white hover:shadow-lg hover:shadow-primary/10 transition-shadow duration-200'
            onClick={() => router.push('/dashboard/create-interview')}
          >
            <Plus className='w-4 h-4 mr-2' />
            Create New Interview
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="mt-6">
          <LoadingSkeleton />
        </div>
      ) : interviewList?.length === 0 ? (
        <div className='text-muted-foreground text-center bg-card rounded-lg p-8 mt-6 shadow-sm hover:shadow-md transition-shadow duration-200'>
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Briefcase className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">No Interviews Yet</h3>
          <p className="text-gray-500 mb-6">
            {user?.email ?
              `Welcome ${user.name}! You haven't created any interviews yet. Get started by creating your first interview.` :
              "Please log in to view your interviews."
            }
          </p>
          {user?.email && (
            <Button
              className='bg-primary text-white hover:shadow-lg hover:shadow-primary/10 transition-shadow duration-200'
              onClick={() => router.push('/dashboard/create-interview')}
            >
              <Plus className='w-4 h-4 mr-2' />
              Create Your First Interview
            </Button>
          )}
        </div>
      ) : (
        <>
          {/* Interview Cards Grid */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {interviewList.map((interview) => (
              <Card key={interview.interview_id} className="group hover:shadow-lg transition-all duration-200 cursor-pointer border-2 hover:border-primary/20">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg group-hover:text-primary transition-colors line-clamp-1">
                    {interview.jobPosition || 'No Title'}
                  </CardTitle>
                  <CardDescription className="flex items-center space-x-2">
                    <Building2 className="w-3 h-3" />
                    <span className="line-clamp-1">{interview.organizationName || 'No Organization'}</span>
                  </CardDescription>
                </CardHeader>

                <CardContent className="pb-3">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>{interview.interviewDuration || 0} min</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Users className="w-3 h-3" />
                        <span>{Array.isArray(interview.questionsList) ? interview.questionsList.length : 0} questions</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {parseInterviewTypes(interview.interviewType).slice(0, 2).map((type, index) => {
                        const colorClasses = getInterviewTypeColors(interview.interviewType);
                        return (
                          <Badge
                            key={index}
                            variant="secondary"
                            className={`text-xs ${colorClasses[index] || 'bg-gray-100 text-gray-800'}`}
                          >
                            {type}
                          </Badge>
                        );
                      })}
                      {parseInterviewTypes(interview.interviewType).length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{parseInterviewTypes(interview.interviewType).length - 2}
                        </Badge>
                      )}
                    </div>

                    <p className="text-xs text-gray-500 flex items-center space-x-1">
                      <Calendar className="w-3 h-3" />
                      <span>Created {formatDate(interview.created_at)}</span>
                    </p>
                  </div>
                </CardContent>

                <CardFooter className="pt-3 flex justify-between">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleShareInterview(interview.interview_id);
                    }}
                    className="flex items-center space-x-1"
                  >
                    <Share2 className="w-3 h-3" />
                    <span>Share</span>
                  </Button>
                  <Button
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleViewInterview(interview);
                    }}
                    className="flex items-center space-x-1"
                  >
                    <Eye className="w-3 h-3" />
                    <span>View</span>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          {/* Beautiful Interview Details Modal */}
          <Dialog open={isDialogOpen} onOpenChange={handleCloseDialog}>
            <DialogContent className="max-w-[95vw] max-h-[95vh] p-0 bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
              {selectedInterview ? (
                <div className="flex flex-col h-full max-h-[95vh]">
                  {/* Beautiful Header with Gradient */}
                  <div className="flex-shrink-0 p-8 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 relative overflow-hidden">
                    <DialogHeader className="relative z-10">
                      <DialogTitle className="text-2xl font-bold flex items-center space-x-3 mb-4">
                        <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-xl">
                          <Briefcase className="w-8 h-8 text-primary" />
                        </div>
                        <span>{selectedInterview.jobPosition || 'No Title'}</span>
                      </DialogTitle>

                      <div className="flex flex-wrap items-center gap-4 text-base text-gray-700 dark:text-gray-300">
                        <span className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded-lg">
                          <Building2 className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                          <span>{selectedInterview.organizationName || 'No Organization'}</span>
                        </span>
                        <span className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded-lg">
                          <Calendar className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                          <span>{formatDetailedDate(selectedInterview.created_at)}</span>
                        </span>
                      </div>
                    </DialogHeader>
                  </div>

                  {/* Beautiful Scrollable Content */}
                  <div className="flex-1 overflow-y-auto p-8 bg-white/50 backdrop-blur-sm">
                    <div className="space-y-8">
                      {/* Interview Overview - Enhanced */}
                      <div className="space-y-6">
                        <h3 className="text-xl font-bold flex items-center space-x-3 text-gray-800">
                          <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl text-white shadow-lg">
                            <Clock className="w-6 h-6" />
                          </div>
                          <span>Interview Overview</span>
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100/50 hover:shadow-xl transition-all duration-300">
                            <CardContent className="p-6 text-center">
                              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                                <Clock className="w-8 h-8 text-white" />
                              </div>
                              <p className="text-sm font-medium text-blue-700 mb-1">Duration</p>
                              <p className="text-2xl font-bold text-blue-900">{selectedInterview.interviewDuration || 0} <span className="text-sm font-medium">min</span></p>
                            </CardContent>
                          </Card>
                          <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-emerald-100/50 hover:shadow-xl transition-all duration-300">
                            <CardContent className="p-6 text-center">
                              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                                <Users className="w-8 h-8 text-white" />
                              </div>
                              <p className="text-sm font-medium text-green-700 mb-1">Questions</p>
                              <p className="text-2xl font-bold text-green-900">
                                {Array.isArray(selectedInterview.questionsList) ? selectedInterview.questionsList.length : 0}
                              </p>
                            </CardContent>
                          </Card>
                          <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100/50 hover:shadow-xl transition-all duration-300">
                            <CardContent className="p-6 text-center">
                              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                                <FileText className="w-8 h-8 text-white" />
                              </div>
                              <p className="text-sm font-medium text-purple-700 mb-1">Interview ID</p>
                              <p className="font-mono text-sm text-purple-900 bg-purple-100/50 px-2 py-1 rounded-lg">
                                {selectedInterview.interview_id?.substring(0, 8) || 'N/A'}...
                              </p>
                            </CardContent>
                          </Card>
                        </div>
                      </div>

                      <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>

                      {/* Interview Link Section - Enhanced */}
                      <div className="space-y-6">
                        <h3 className="text-xl font-bold flex items-center space-x-3 text-gray-800">
                          <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl text-white shadow-lg">
                            <Share2 className="w-6 h-6" />
                          </div>
                          <span>Interview Link</span>
                        </h3>

                        <div className="relative p-6 bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50 border border-indigo-200/60 rounded-2xl shadow-lg overflow-hidden">
                          {/* Background decoration */}
                          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-200/30 to-purple-200/30 rounded-full blur-2xl"></div>
                          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-blue-200/30 to-indigo-200/30 rounded-full blur-xl"></div>

                          <div className="relative z-10">
                            <div className="flex items-center justify-between mb-4">
                              <span className="text-base font-bold text-indigo-900">Shareable Interview Link</span>
                              <span className="inline-flex items-center px-3 py-1.5 text-sm font-semibold rounded-full bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg">
                                <span className="w-2 h-2 rounded-full mr-2 bg-white animate-pulse"></span>
                                Active
                              </span>
                            </div>

                            <div className="flex items-center gap-4 mb-4">
                              <div className="flex-1 bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-indigo-200/40 shadow-sm">
                                <code className="text-sm text-gray-700 break-all font-mono">
                                  {typeof window !== 'undefined' ? `${publicBaseUrl}/public-interview/${selectedInterview.interview_id}` : `[domain]/public-interview/${selectedInterview.interview_id}`}
                                </code>
                              </div>
                              <Button
                                onClick={() => handleCopyInterviewLink(selectedInterview.interview_id)}
                                size="lg"
                                className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                              >
                                <Share2 className="w-4 h-4 mr-2" />
                                {copied ? 'Copied!' : 'Copy Link'}
                              </Button>
                            </div>

                            {/* Enhanced Share Buttons */}
                            <div className="space-y-3">
                              <p className="text-sm font-semibold text-indigo-800">Share via:</p>
                              <div className="grid grid-cols-3 gap-3">
                                <Button
                                  onClick={() => handleShareVia('email', selectedInterview.interview_id)}
                                  variant="outline"
                                  className="bg-white/70 hover:bg-gradient-to-r hover:from-orange-400 hover:to-red-500 text-gray-700 hover:text-white border-indigo-200/50 hover:border-orange-500 transition-all duration-300 transform hover:scale-105 shadow-sm hover:shadow-lg"
                                >
                                  <Mail className="w-4 h-4 mr-2" />
                                  Email
                                </Button>
                                <Button
                                  onClick={() => handleShareVia('slack', selectedInterview.interview_id)}
                                  variant="outline"
                                  className="bg-white/70 hover:bg-gradient-to-r hover:from-purple-500 hover:to-purple-700 text-gray-700 hover:text-white border-indigo-200/50 hover:border-purple-700 transition-all duration-300 transform hover:scale-105 shadow-sm hover:shadow-lg"
                                >
                                  <MessageSquare className="w-4 h-4 mr-2" />
                                  Slack
                                </Button>
                                <Button
                                  onClick={() => handleShareVia('whatsapp', selectedInterview.interview_id)}
                                  variant="outline"
                                  className="bg-white/70 hover:bg-gradient-to-r hover:from-green-400 hover:to-green-600 text-gray-700 hover:text-white border-indigo-200/50 hover:border-green-600 transition-all duration-300 transform hover:scale-105 shadow-sm hover:shadow-lg"
                                >
                                  <MessageSquare className="w-4 h-4 mr-2" />
                                  WhatsApp
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>

                      {/* Interview Types - Enhanced */}
                      <div className="space-y-4">
                        <h3 className="text-xl font-bold flex items-center space-x-3 text-gray-800">
                          <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl text-white shadow-lg">
                            <Users className="w-6 h-6" />
                          </div>
                          <span>Interview Types</span>
                        </h3>
                        <div className="flex flex-wrap gap-3">
                          {parseInterviewTypes(selectedInterview.interviewType).map((type, index) => {
                            const colorClasses = getInterviewTypeColors(selectedInterview.interviewType);
                            return (
                              <Badge
                                key={index}
                                className={`px-4 py-2 text-sm font-medium shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 ${colorClasses[index] || 'bg-gray-100 text-gray-800'}`}
                              >
                                {type}
                              </Badge>
                            );
                          })}
                        </div>
                      </div>

                      <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>

                      {/* Job Description - Enhanced */}
                      <div className="space-y-4">
                        <h3 className="text-xl font-bold flex items-center space-x-3 text-gray-800">
                          <div className="p-2 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl text-white shadow-lg">
                            <FileText className="w-6 h-6" />
                          </div>
                          <span>Job Description</span>
                        </h3>
                        <div className="bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-2xl p-6 border border-gray-200/50 shadow-lg">
                          <p className="text-gray-700 leading-relaxed whitespace-pre-wrap text-base">
                            {selectedInterview.jobDescription || 'No job description provided.'}
                          </p>
                        </div>
                      </div>

                      {/* Job Prompt - Enhanced */}
                      {selectedInterview.jobPrompt && (
                        <>
                          <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
                          <div className="space-y-4">
                            <h3 className="text-xl font-bold flex items-center space-x-3 text-gray-800">
                              <div className="p-2 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl text-white shadow-lg">
                                <MessageSquare className="w-6 h-6" />
                              </div>
                              <span>Interview Instructions</span>
                            </h3>
                            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6 border border-blue-200/60 shadow-lg">
                              <p className="text-blue-800 leading-relaxed text-base font-medium">
                                {selectedInterview.jobPrompt}
                              </p>
                            </div>
                          </div>
                        </>
                      )}

                      <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>

                      {/* Questions List - Enhanced */}
                      <div className="space-y-6">
                        <h3 className="text-xl font-bold flex items-center space-x-3 text-gray-800">
                          <div className="p-2 bg-gradient-to-br from-rose-500 to-pink-600 rounded-xl text-white shadow-lg">
                            <MessageSquare className="w-6 h-6" />
                          </div>
                          <span>Interview Questions</span>
                        </h3>
                        <div className="space-y-4">
                          {Array.isArray(selectedInterview.questionsList) && selectedInterview.questionsList.length > 0 ? (
                            selectedInterview.questionsList.map((question, index) => (
                              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 border-l-4 border-l-gradient-to-b from-rose-500 to-pink-600 bg-gradient-to-br from-white to-rose-50/30">
                                <CardContent className="p-6">
                                  <div className="flex items-start justify-between mb-3">
                                    <span className="inline-flex items-center px-3 py-1 text-sm font-bold rounded-full bg-gradient-to-r from-rose-500 to-pink-600 text-white shadow-lg">
                                      Q{index + 1}
                                    </span>
                                    {question.type && (
                                      <Badge variant="outline" className="text-xs font-medium border-rose-300 text-rose-700 bg-rose-50">
                                        {question.type}
                                      </Badge>
                                    )}
                                  </div>
                                  <p className="text-gray-700 leading-relaxed text-base font-medium">
                                    {typeof question === 'string' ? question : question.question}
                                  </p>
                                </CardContent>
                              </Card>
                            ))
                          ) : (
                            <div className="text-center py-12">
                              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                                <MessageSquare className="w-8 h-8 text-gray-400" />
                              </div>
                              <p className="text-gray-500 italic text-lg">No questions defined for this interview.</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-96">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-gray-500">Loading interview details...</p>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </>
      )}
    </div>
  );
}

export default AllInterview;