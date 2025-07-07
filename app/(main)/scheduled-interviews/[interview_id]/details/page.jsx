'use client'

import { Button } from '@/components/ui/button';
import { Calendar, Clock, Users, Building2, Filter, Download, User, FileText, CheckCircle, AlertCircle, Eye, View } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/services/supabaseClient';
import { toast } from 'sonner';
import { useUser } from '@/app/provider';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarInitial } from "@/components/ui/avatar";
import ViewReportDialog from './_components/ViewReportDialog'; 

function InterviewDetails() {
  const params = useParams();
  const router = useRouter();
  const { user } = useUser();
  const [interview, setInterview] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);

  const interviewId = params?.interview_id;

  const fetchInterviewDetails = async () => {
    try {
      setLoading(true);

      // Fetch interview details
      const { data: interviewData, error: interviewError } = await supabase
        .from('Interviews')
        .select('*')
        .eq('interview_id', interviewId)
        .eq('userEmail', user?.email)
        .single();

      if (interviewError) {
        console.error('Error fetching interview:', interviewError);
        toast.error('Failed to load interview details');
        return;
      }

      // Fetch candidates/feedback for this interview
      const { data: feedbackData, error: feedbackError } = await supabase
        .from('Interview-Feedback')
        .select('*')
        .eq('interview_id', interviewId)
        .order('created_at', { ascending: false });

      if (feedbackError) {
        console.error('Error fetching feedback:', feedbackError);
        toast.error('Failed to load candidates data');
        return;
      }

      setInterview(interviewData);
      setCandidates(feedbackData || []);
    } catch (error) {
      console.error('Unexpected error:', error);
      toast.error('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (interviewId && user?.email) {
      fetchInterviewDetails();
    } else {
      setLoading(false);
    }
  }, [interviewId, user]);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getInitials = (name) => {
    if (!name) return 'AN';
    return name.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2);
  };

  const getCandidateStatus = (candidate) => {
    if (candidate.feedback && Object.keys(candidate.feedback).length > 0) {
      return { status: 'completed', label: 'Completed', color: 'bg-green-100 text-green-800' };
    }
    return { status: 'pending', label: 'Pending', color: 'bg-orange-100 text-orange-800' };
  };

  const getInterviewTypes = (type) => {
    if (!type) return [];
    return type.map(t => t.trim());
  };

  const parseQuestions = (questionsList) => {
    if (!questionsList) return [];
    if (typeof questionsList === 'string') {
      try {
        return JSON.parse(questionsList);
      } catch {
        return [];
      }
    }
    return Array.isArray(questionsList) ? questionsList : [];
  };


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-500">Loading interview details...</p>
        </div>
      </div>
    );
  }

  if (!interview) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-700 mb-2">Interview Not Found</h2>
          <p className="text-gray-500 mb-4">The interview you're looking for doesn't exist or you don't have permission to view it.</p>
          <Button onClick={() => router.push('/dashboard')}>
            Go Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const questions = parseQuestions(interview.questionsList);
  const interviewTypes = getInterviewTypes(JSON.parse(interview.interviewType));

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-gray-900">Interview Details</h1>
            <div className="flex items-center space-x-3">
              <Button variant="outline" className="flex items-center space-x-2">
                <Filter className="w-4 h-4" />
                <span>Filter</span>
              </Button>
              <Button variant="outline" className="flex items-center space-x-2">
                <Download className="w-4 h-4" />
                <span>Export</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Interview Overview Card */}
        <Card className="mb-8 shadow-lg">
          <CardHeader className="pb-4">
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-2xl text-gray-900 mb-2">
                  {interview.jobPosition || 'No Title'}
                </CardTitle>
                <CardDescription className="text-lg text-gray-600">
                  {interview.organizationName || 'No Organization'}
                </CardDescription>
              </div>
              <Badge className="bg-green-100 text-green-800 px-3 py-1">
                Active
              </Badge>
            </div>
          </CardHeader>
          
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Clock className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Duration</p>
                  <p className="font-semibold">{interview.interviewDuration || 0} Minutes</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Calendar className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Created On</p>
                  <p className="font-semibold">{formatDate(interview.created_at)}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <FileText className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Type</p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {interviewTypes.map((type, index) => (
                      <span key={index} className="text-xs px-3 py-1 bg-blue-100 text-blue-700 rounded-full font-semibold">
                        {type}
                        {index < interviewTypes.length - 1 && '  '}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Job Description */}
            {interview.jobDescription && (
              <>
                <Separator className="my-6" />
                <div>
                  <h3 className="text-lg font-semibold mb-3">Job Description</h3>
                  <p className="text-gray-700 leading-relaxed">
                    {interview.jobDescription}
                  </p>
                </div>
              </>
            )}

            {/* Interview Questions */}
            {questions.length > 0 && (
              <>
                <Separator className="my-6" />
                <div>
                  <h3 className="text-lg font-semibold mb-4">Interview Questions</h3>
                  <div className="space-y-3">
                    {questions.map((question, index) => (
                      <div key={index} className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                        <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
                          {index + 1}
                        </div>
                        <p className="text-gray-700 flex-1">
                          {typeof question === 'string' ? question : question.question || 'No question text'}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Candidates Section */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl">
              Candidates ({candidates.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {candidates.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-500 text-lg mb-2">No candidates yet</p>
                <p className="text-gray-400">Share the interview link to start receiving applications</p>
              </div>
            ) : (
              <div className="space-y-4">
                {candidates.map((candidate) => {
                  const status = getCandidateStatus(candidate);
                  return (
                    <div key={candidate.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex items-center space-x-4">
                        <Avatar className="w-10 h-10">
                          <AvatarFallback className="bg-blue-100 text-blue-700 font-semibold">
                            {getInitials(candidate.intervieweeFullName)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-semibold text-gray-900">
                            {candidate.intervieweeFullName || 'Anonymous Candidate'}
                          </h4>
                          <p className="text-sm text-gray-500">
                            {status.status === 'completed' 
                              ? `Completed on ${formatDate(candidate.created_at)}`
                              : `Scheduled for ${formatDate(candidate.created_at)}`
                            }
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        {status.status === 'completed' && (
                          <div className="text-right mr-4">
                            <div className="text-lg font-bold text-green-600">8.5/10</div>
                            <div className="text-xs text-gray-500">Score</div>
                          </div>
                        )}
                        
                        <Badge className={status.color}>
                          {status.label}
                        </Badge>
                        <ViewReportDialog candidate={candidate}/>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default InterviewDetails;