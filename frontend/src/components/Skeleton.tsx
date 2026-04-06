import React from 'react';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'rect' | 'circle';
  width?: string | number;
  height?: string | number;
}

const Skeleton: React.FC<SkeletonProps> = ({ 
  className = '', 
  variant = 'rect', 
  width, 
  height 
}) => {
  const variantClass = variant === 'circle' ? 'rounded-full' : 'rounded-lg';
  
  return (
    <div 
      className={`skeleton-shimmer ${variantClass} ${className}`}
      style={{ width, height }}
    />
  );
};

export default Skeleton;
