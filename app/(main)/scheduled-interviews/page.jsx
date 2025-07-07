'use client'

import { Button } from '@/components/ui/button';
import { Calendar, Clock, Users, Building2, Eye, Briefcase, Mail, MessageSquare, User, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/services/supabaseClient';
import { toast } from 'sonner';
import { useUser } from '@/app/provider';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

function ScheduledInterview() {
  const router = useRouter();
  const [interviewList, setInterviewList] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useUser();

  const GetInterviewList = async () => {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from('Interviews')
        .select(`
          jobPosition, 
          interviewDuration, 
          interview_id, 
          created_at,
          organizationName,
          jobDescription,
          interviewType,
          Interview-Feedback(
            intervieweeFullName,
            intervieweeEmail,
            feedback,
            created_at
          )
        `)
        .eq('userEmail', user?.email)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching interviews:', error);
        toast.error('Failed to load scheduled interviews');
        return;
      }

      console.log('Interview data:', data);
      setInterviewList(data || []);
    } catch (error) {
      console.error('Unexpected error:', error);
      toast.error('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.email) {
      GetInterviewList();
    } else {
      setLoading(false);
    }
  }, [user]);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getInterviewStatus = (feedbackData) => {
    if (!feedbackData || feedbackData.length === 0) {
      return { status: 'pending', label: 'Pending', color: 'bg-yellow-100 text-yellow-800', icon: AlertCircle };
    }
    return { status: 'completed', label: 'Completed', color: 'bg-green-100 text-green-800', icon: CheckCircle };
  };

  const handleViewDetails = (interviewId) => {
    // Redirect to interview details page
    router.push(`/scheduled-interviews/${interviewId}/details`);
  };

  const LoadingSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3, 4, 5, 6].map((i) => (
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
          <div>
            <h2 className='text-2xl font-bold my-4'>Scheduled Interviews</h2>
            <p className='text-gray-600'>Track and manage your interview sessions</p>
          </div>
          <Button
            className='bg-primary text-white hover:shadow-lg hover:shadow-primary/10 transition-shadow duration-200'
            onClick={() => router.push('/dashboard/create-interview')}
          >
            <Calendar className='w-4 h-4 mr-2' />
            Schedule New Interview
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
            <Calendar className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">No Scheduled Interviews</h3>
          <p className="text-gray-500 mb-6">
            {user?.email ?
              "You haven't scheduled any interviews yet. Create your first interview to get started." :
              "Please log in to view your scheduled interviews."
            }
          </p>
          {user?.email && (
            <Button
              className='bg-primary text-white hover:shadow-lg hover:shadow-primary/10 transition-shadow duration-200'
              onClick={() => router.push('/dashboard/create-interview')}
            >
              <Calendar className='w-4 h-4 mr-2' />
              Schedule Your First Interview
            </Button>
          )}
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {interviewList.map((interview) => {
            const status = getInterviewStatus(interview['Interview-Feedback']);
            const StatusIcon = status.icon;
            const candidatesCount = interview['Interview-Feedback']?.length || 0;
            
            return (
              <Card key={interview.interview_id} className="group hover:shadow-lg transition-all duration-200 cursor-pointer border-2 hover:border-primary/20">
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <CardTitle className="text-lg group-hover:text-primary transition-colors line-clamp-1">
                      {interview.jobPosition || 'No Title'}
                    </CardTitle>
                    <Badge className={`${status.color} flex items-center gap-1`}>
                      <StatusIcon className="w-3 h-3" />
                      {status.label}
                    </Badge>
                  </div>
                  <CardDescription className="flex items-center space-x-2">
                    <Building2 className="w-3 h-3" />
                    <span className="line-clamp-1">{interview.organizationName || 'No Organization'}</span>
                  </CardDescription>
                </CardHeader>

                <CardContent className="pb-3">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>{interview.interviewDuration || 0} min</span>
                      </div>
                    </div>

                    <p className="text-xs text-gray-500 flex items-center space-x-1">
                      <Calendar className="w-3 h-3" />
                      <span>Created {formatDate(interview.created_at)}</span>
                    </p>

                    {/* Show candidates who completed interviews */}
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-3 border border-green-100">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                            <Users className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-green-900">
                              {candidatesCount} {candidatesCount === 1 ? 'Candidate' : 'Candidates'}
                            </p>
                            <p className="text-xs text-green-600">
                              {candidatesCount > 0 ? 'Successfully completed' : 'No interviews yet'}
                            </p>
                          </div>
                        </div>
                        {candidatesCount > 0 && (
                          <div className="text-right">
                            <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                              <CheckCircle className="w-3 h-3 text-green-600" />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>


                  </div>
                </CardContent>

                <CardFooter className="pt-3">
                  <Button
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleViewDetails(interview.interview_id);
                    }}
                    className="w-full flex items-center justify-center space-x-1"
                  >
                    <Eye className="w-3 h-3" />
                    <span>View Details</span>
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default ScheduledInterview;