import React from 'react';


export const Loading: React.FC = () => {

    return (
        <span className="flex items-center gap-2">
            <span className={`w-1.5 h-1.5 bg-current rounded-full animate-bounce`} />
            <span className={`w-1.5 h-1.5 bg-current rounded-full animate-bounce delay-75`} />
            <span className={`w-1.5 h-1.5 bg-current rounded-full animate-bounce delay-150`} />
        </span>
    );
};
