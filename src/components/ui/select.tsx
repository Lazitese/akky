'use client';

import * as React from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SelectContextType {
  value: string;
  onValueChange?: (value: string) => void;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  labels: Record<string, React.ReactNode>;
  registerLabel: (val: string, label: React.ReactNode) => void;
}

const SelectContext = React.createContext<SelectContextType | undefined>(undefined);

interface SelectProps {
  value: string;
  onValueChange?: (value: string) => void;
  children: React.ReactNode;
}

export function Select({ value, onValueChange, children }: SelectProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [labels, setLabels] = React.useState<Record<string, React.ReactNode>>({});
  const selectRef = React.useRef<HTMLDivElement>(null);

  const registerLabel = React.useCallback((val: string, label: React.ReactNode) => {
    setLabels((prev) => {
      if (prev[val] === label) return prev;
      return { ...prev, [val]: label };
    });
  }, []);

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  return (
    <SelectContext.Provider value={{ value, onValueChange, isOpen, setIsOpen, labels, registerLabel }}>
      <div ref={selectRef} className="relative inline-block text-left">
        {children}
      </div>
    </SelectContext.Provider>
  );
}

interface SelectTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
}

export const SelectTrigger = React.forwardRef<HTMLButtonElement, SelectTriggerProps>(
  ({ className, children, ...props }, ref) => {
    const ctx = React.useContext(SelectContext);
    if (!ctx) throw new Error('SelectTrigger must be used within Select');

    return (
      <button
        ref={ref}
        type="button"
        onClick={() => ctx.setIsOpen((prev) => !prev)}
        className={cn(
          'flex h-9 items-center justify-between gap-2 rounded-xl border border-slate-200/90 bg-white px-3 py-1.5 text-xs font-semibold text-slate-800 shadow-xs hover:bg-slate-50 focus:outline-none focus:ring-1 focus:ring-[#22177a] transition-all',
          className
        )}
        {...props}
      >
        {children}
        <ChevronDown className={cn('h-3.5 w-3.5 text-slate-500 transition-transform duration-200', ctx.isOpen && 'rotate-180')} />
      </button>
    );
  }
);
SelectTrigger.displayName = 'SelectTrigger';

interface SelectValueProps {
  placeholder?: string;
}

export function SelectValue({ placeholder }: SelectValueProps) {
  const ctx = React.useContext(SelectContext);
  if (!ctx) throw new Error('SelectValue must be used within Select');

  const selectedLabel = ctx.labels[ctx.value];
  return <span>{selectedLabel ?? placeholder ?? ctx.value}</span>;
}

interface SelectContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const SelectContent = React.forwardRef<HTMLDivElement, SelectContentProps>(
  ({ className, children, ...props }, ref) => {
    const ctx = React.useContext(SelectContext);
    if (!ctx) throw new Error('SelectContent must be used within Select');

    if (!ctx.isOpen) return null;

    return (
      <div
        ref={ref}
        className={cn(
          'absolute right-0 z-50 mt-1 min-w-[8rem] overflow-hidden rounded-xl border border-slate-200/90 bg-white p-1 text-slate-900 shadow-lg animate-fadeIn',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
SelectContent.displayName = 'SelectContent';

interface SelectItemProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
  children: React.ReactNode;
}

export const SelectItem = React.forwardRef<HTMLDivElement, SelectItemProps>(
  ({ className, value, children, ...props }, ref) => {
    const ctx = React.useContext(SelectContext);
    if (!ctx) throw new Error('SelectItem must be used within Select');

    const isSelected = ctx.value === value;

    React.useEffect(() => {
      ctx.registerLabel(value, children);
    }, [value, children, ctx]);

    const handleSelect = () => {
      ctx.onValueChange?.(value);
      ctx.setIsOpen(false);
    };

    return (
      <div
        ref={ref}
        onClick={handleSelect}
        className={cn(
          'relative flex cursor-pointer select-none items-center justify-between rounded-lg px-2.5 py-1.5 text-xs font-semibold outline-none transition-colors hover:bg-slate-100 hover:text-slate-900',
          isSelected ? 'bg-slate-100 font-bold text-[#22177a]' : 'text-slate-700',
          className
        )}
        {...props}
      >
        <span>{children}</span>
        {isSelected && <Check className="h-3.5 w-3.5 text-[#22177a]" />}
      </div>
    );
  }
);
SelectItem.displayName = 'SelectItem';
