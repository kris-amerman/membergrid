import React from 'react';

interface Props {
  color?: string;
  children?: React.ReactNode;  
}

const CardBadge: React.FC<Props> = ({ color = 'blue', children }) => {
  
  // This is so goofy Tailwind ... there has to be a better way (and no, literals don't work)
  const colorVariants: any = {
    gray: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
    orange: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
    yellow: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    green: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    blue: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    purple: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
    pink: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300',
    red: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
  }
  
  return (
    <div>
      <span className={`${colorVariants[color]} text-xs font-medium px-2.5 py-0.5 rounded-full`}>
        {children}
      </span>

    </div>
  );
};

export default CardBadge;