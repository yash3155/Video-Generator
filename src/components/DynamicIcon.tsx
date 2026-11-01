import React from 'react';
import * as Icons from 'lucide-react';

interface DynamicIconProps {
  name?: string;
  className?: string;
  size?: number;
  color?: string;
}

export const DynamicIcon: React.FC<DynamicIconProps> = ({
  name,
  className = 'w-6 h-6',
  size = 24,
  color,
}) => {
  if (!name) {
    return <Icons.Sparkles size={size} className={className} color={color} />;
  }

  // Lucide exports icons in PascalCase (e.g. TrendingUp, BarChart2, BookOpen)
  const IconComponent = (Icons as Record<string, any>)[name] || Icons.Sparkles;

  return <IconComponent size={size} className={className} color={color} />;
};

