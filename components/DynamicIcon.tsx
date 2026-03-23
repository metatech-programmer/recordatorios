'use client';

import React from 'react';
import * as LucideIcons from 'lucide-react';

export const DynamicIcon = ({ name, className }: { name: string, className?: string }) => {
  const isLegacyEmoji = name ? name.length <= 4 : true;
  const Icon = isLegacyEmoji ? LucideIcons.Activity : ((LucideIcons as any)[name] || LucideIcons.Activity);
  
  return <Icon className={className} />;
};