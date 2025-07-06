"use client";

import { useRef } from 'react';

export const useScrollAnimation = (threshold = 0.1) => {
  const ref = useRef<HTMLDivElement>(null);
  
  // 暂时禁用所有动画，直接显示内容
  return { ref, isVisible: true };
};