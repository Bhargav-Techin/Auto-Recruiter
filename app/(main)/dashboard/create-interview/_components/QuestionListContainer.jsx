import React from 'react'

function QuestionListContainer({ questionsList }) {
    return (
        <div className='flex flex-col gap-2'>
            <h2 className='font-semibold text-lg text-center m-2'>Generated interview questions</h2>
            {questionsList.map((item, index) => (
                <div
                    key={index}
                    className="group relative p-6 bg-gradient-to-br from-card via-card to-card/80 border border-border/40 rounded-2xl hover:border-primary/40 hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 hover:-translate-y-1"
                >
                    {/* Header Row: Q number + Type Badge */}
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-[11px] font-semibold uppercase tracking-wide text-primary bg-primary/10 px-2 py-1 rounded-md">
                            Q{index + 1}
                        </span>
                        <span className="inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full bg-primary/10 text-primary border border-primary/20 backdrop-blur-sm">
                            <span className="w-1.5 h-1.5 rounded-full mr-2 bg-primary"></span>
                            <span className="text-gray-500">Type:</span>&nbsp;{item.type}
                        </span>
                    </div>

                    {/* Question Content */}
                    <div className="pr-12">
                        <h3 className="text-sm font-medium text-foreground/90 leading-relaxed">
                            {item.question}
                        </h3>
                    </div>

                    {/* Decorative Elements */}
                    <div className="absolute bottom-2 right-2 opacity-20 group-hover:opacity-40 transition-opacity duration-300">
                        <div className="relative w-8 h-8 border-2 border-primary/20 rounded-full">
                            <div className="absolute top-1 left-1 w-6 h-6 bg-primary/10 rounded-full"></div>
                        </div>
                    </div>

                    {/* Hover Overlay Glow */}
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/0 via-primary/5 to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                </div>
            ))}


        </div>
    )
}

export default QuestionListContainer