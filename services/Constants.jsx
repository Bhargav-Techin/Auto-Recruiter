import { Calendar, LayoutDashboardIcon, List, SettingsIcon, WalletCards, Code, Brain, Group, Puzzle } from "lucide-react";

export const SideBarOptions = [

    {
        name: 'Dashboard',
        icon: LayoutDashboardIcon,
        path: '/dashboard',
    },
    {
        name: 'Scheduled Interview',
        icon: Calendar,
        path: '/scheduled-interviews',
    },
    {
        name: 'All Interviews',
        icon: List,
        path: '/all-interviews',
    },
    {
        name: 'Billing',
        icon: WalletCards,
        path: '/billing',
    },
    {
        name: 'Settings',
        icon: SettingsIcon,
        path: '/settings',
    }

]

export const InterviewType =[
    {
        title: 'Technical',
        icon: Code,
    },
    {
        title: 'Behavioral',
        icon: Brain,
    },
    {
        title: 'Coding',
        icon: Code,
    },
    {
        title: 'System Design',
        icon: Code,
    },
    {
        title: 'Leardership',
        icon: Group,
    },
    {
        title: 'Problem Solving',
        icon: Puzzle,
    }
]

export const QUESTION_PROMPT = `You are an expert technical interviewer.
Based on the following inputs, generate a well-structured list of high-quality interview questions:
Job Title: {{jobPosition}}
Job Description:{{jobDescription}}
Interview Duration: {{interviewDuration}}
Interview Type: {{interviewType}}
Your task:
Analyze the job description to identify key responsibilities, required skills, and expected experience.
Generate a list of interview questions depends on interview duration
Adjust the number and depth of questions to match the interview duration.
Ensure the questions match the tone and structure of a real-life {{interviewType}} interview.
Format your response in JSON format with array list of questions.
format: interviewQuestions=[
{
question:"",
type:'Technical/Behavioral/Experince/Problem Solving/Leaseship'
},{
......
}]
The goal is to create a structured, relevant, and time-optimized interview plan for a {{jobPosition}} role.`
