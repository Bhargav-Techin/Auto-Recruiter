import React from 'react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

function AlertConfirmation({ children, onConfirm, isLoading = false }) {
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                {children}
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>End Interview Confirmation</AlertDialogTitle>
                    <AlertDialogDescription>
                        Are you sure you want to end this interview session? This action will stop the recording 
                        and you will be redirected to the interview summary page. The interview progress will be saved.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isLoading}>
                        Continue Interview
                    </AlertDialogCancel>
                    <AlertDialogAction 
                        onClick={onConfirm}
                        disabled={isLoading}
                        className="bg-red-500 hover:bg-red-600 focus:ring-red-500"
                    >
                        {isLoading ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                Ending...
                            </>
                        ) : (
                            'End Interview'
                        )}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default AlertConfirmation