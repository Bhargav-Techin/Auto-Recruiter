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
Job Description: {{jobDescription}}  
Interview Duration: {{interviewDuration}}  
Interview Type: {{interviewType}}  
Job Prompt: {{jobPrompt}}

Instructions:
1. If a Job Prompt ({{jobPrompt}}) is provided:
   - Prioritize analyzing the prompt to understand the focus areas, experience level (e.g., fresher, intermediate, advanced), and expectations.
   - Use it to guide the theme, difficulty, and types of questions.
   - Align the number and depth of questions with the interview duration.

2. If no Job Prompt is provided:
   - Analyze the Job Description ({{jobDescription}}) to identify key responsibilities, required skills, and experience level.
   - Generate questions based on your expert judgment and adjust the total to fit within the {{interviewDuration}}.

3. Always align with the Interview Type ({{interviewType}}):
   - For example, technical interviews should include coding, system design, or domain-specific challenges.
   - Behavioral interviews should include scenario-based or STAR-method questions.

4. Assume:
   - ~1–2 minutes per behavioral question
   - ~5–10 minutes per technical/problem-solving question

Format the output as a JSON array of interview questions:

interviewQuestions = [
  {
    question: "",
    type: "Technical | Behavioral | Experience | Problem Solving | Leadership"
  },
  ...
]

Goal: Create a structured, relevant, and time-optimized interview plan tailored for the {{jobPosition}} role.`
