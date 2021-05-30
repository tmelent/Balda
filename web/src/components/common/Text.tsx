import * as React from 'react';

interface TextProps extends React.HTMLAttributes<HTMLParagraphElement>{

}

export const Text: React.FC<TextProps> = ({children, ...attributes}) => {
    return <p {...attributes}>{children}</p>;
};