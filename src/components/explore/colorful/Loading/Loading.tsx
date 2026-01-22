import React from 'react';


export const Loading: React.FC = () => {
    return (
        <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-white rounded-full animate-bounce" />
            <div className="w-2 h-2 bg-white rounded-full animate-bounce delay-100" />
            <div className="w-2 h-2 bg-white rounded-full animate-bounce delay-200" />
        </div>
    );
};
