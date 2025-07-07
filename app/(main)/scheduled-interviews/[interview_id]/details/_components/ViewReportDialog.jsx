import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import React from 'react';
import { Eye, Star, StarHalf } from "lucide-react";

function ViewReportDialog({ candidate }) {
    // Parse the feedback JSON string
    const parseFeedback = () => {
        try {
            const feedbackData = candidate.feedback;
            return feedbackData.feedback || feedbackData;
        } catch (error) {
            console.error('Error parsing feedback:', error);
            return null;
        }
    };

    const feedbackData = parseFeedback();

    // Function to render star rating
    const renderStarRating = (rating, maxRating = 5) => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;
        
        for (let i = 0; i < fullStars; i++) {
            stars.push(
                <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            );
        }
        
        if (hasHalfStar) {
            stars.push(
                <StarHalf key="half" className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            );
        }
        
        const remainingStars = maxRating - Math.ceil(rating);
        for (let i = 0; i < remainingStars; i++) {
            stars.push(
                <Star key={`empty-${i}`} className="w-4 h-4 text-gray-300" />
            );
        }
        
        return stars;
    };

    // Function to get recommendation color
    const getRecommendationColor = (recommendation) => {
        switch (recommendation) {
            case 'HIRE':
                return 'text-green-600 bg-green-50 border-green-200';
            case 'DO_NOT_HIRE':
                return 'text-red-600 bg-red-50 border-red-200';
            case 'MAYBE':
                return 'text-yellow-600 bg-yellow-50 border-yellow-200';
            default:
                return 'text-gray-600 bg-gray-50 border-gray-200';
        }
    };

    return (
        <div>
            <Dialog className="w-full max-w-4xl">
                <DialogTrigger asChild>
                    <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center space-x-1"
                    >
                        <Eye className="w-4 h-4" />
                        <span>View Report</span>
                    </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-semibold">
                            Interview Feedback Report
                        </DialogTitle>
                        <DialogDescription className="text-sm text-gray-600">
                            <strong>Candidate:</strong> {candidate.intervieweeFullName}<br />
                            <strong>Email:</strong> {candidate.intervieweeEmail}<br />
                            <strong>Interview Date:</strong> {new Date(candidate.created_at).toLocaleDateString()}
                        </DialogDescription>
                    </DialogHeader>
                    
                    <div className="mt-6 space-y-6">
                        {feedbackData ? (
                            <>
                                {/* Overall Recommendation */}
                                <div className="space-y-3">
                                    <h3 className="text-lg font-semibold">Overall Recommendation</h3>
                                    <div className={`inline-flex items-center px-3 py-2 rounded-md border font-medium ${getRecommendationColor(feedbackData.recommendation)}`}>
                                        {feedbackData.recommendation?.replace('_', ' ')}
                                    </div>
                                    {feedbackData.recommendationMsg && (
                                        <p className="text-sm text-gray-700 mt-2">
                                            {feedbackData.recommendationMsg}
                                        </p>
                                    )}
                                </div>

                                {/* Rating Breakdown */}
                                {feedbackData.rating && (
                                    <div className="space-y-3">
                                        <h3 className="text-lg font-semibold">Skills Assessment</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {Object.entries(feedbackData.rating).map(([skill, rating]) => (
                                                <div key={skill} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                                    <div className="flex-1">
                                                        <span className="font-medium capitalize">
                                                            {skill.replace(/([A-Z])/g, ' $1').trim()}
                                                        </span>
                                                        <div className="flex items-center mt-1">
                                                            {renderStarRating(rating)}
                                                            <span className="ml-2 text-sm text-gray-600">
                                                                {rating}/5
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Summary */}
                                {feedbackData.summary && (
                                    <div className="space-y-3">
                                        <h3 className="text-lg font-semibold">Summary</h3>
                                        <div className="p-4 bg-gray-50 rounded-lg">
                                            <p className="text-gray-700 leading-relaxed">
                                                {feedbackData.summary}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {/* Additional feedback sections if they exist */}
                                {Object.entries(feedbackData).map(([key, value]) => {
                                    if (['rating', 'summary', 'recommendation', 'recommendationMsg'].includes(key)) {
                                        return null;
                                    }
                                    
                                    if (typeof value === 'string' && value.trim()) {
                                        return (
                                            <div key={key} className="space-y-3">
                                                <h3 className="text-lg font-semibold capitalize">
                                                    {key.replace(/([A-Z])/g, ' $1').trim()}
                                                </h3>
                                                <div className="p-4 bg-gray-50 rounded-lg">
                                                    <p className="text-gray-700 leading-relaxed">
                                                        {value}
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    }
                                    return null;
                                })}
                            </>
                        ) : (
                            <div className="text-center py-8">
                                <p className="text-gray-500">No feedback data available for this candidate.</p>
                            </div>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}

export default ViewReportDialog;