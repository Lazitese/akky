'use client';

import * as React from 'react';
import { ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { cn } from '@/lib/utils';

export type ChartConfig = {
  [k in string]: {
    label?: React.ReactNode;
    icon?: React.ComponentType;
    color?: string;
    theme?: Record<string, string>;
  };
};

type ChartContextProps = {
  config: ChartConfig;
};

const ChartContext = React.createContext<ChartContextProps | null>(null);

function useChart() {
  const context = React.useContext(ChartContext);
  if (!context) {
    throw new Error('useChart must be used within a <ChartContainer />');
  }
  return context;
}

const ChartContainer = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<'div'> & {
    config: ChartConfig;
    children: React.ComponentProps<typeof ResponsiveContainer>['children'];
  }
>(({ id, className, children, config, ...props }, ref) => {
  const uniqueId = React.useId();
  const chartId = `chart-${id || uniqueId.replace(/:/g, '')}`;

  return (
    <ChartContext.Provider value={{ config }}>
      <div
        data-chart={chartId}
        ref={ref}
        className={cn(
          "flex aspect-video justify-center text-xs [&_.recharts-cartesian-axis-tick_text]:fill-slate-500 [&_.recharts-cartesian-grid_line[stroke='#ccc']]:stroke-slate-200/80 [&_.recharts-curve.recharts-tooltip-cursor]:stroke-slate-200 [&_.recharts-dot[stroke='#fff']]:stroke-transparent [&_.recharts-layer]:outline-hidden [&_.recharts-polar-grid_[stroke='#ccc']]:stroke-slate-200 [&_.recharts-radial-bar-background-sector]:fill-slate-100 [&_.recharts-rectangle.recharts-tooltip-cursor]:fill-slate-100/50 [&_.recharts-reference-line_[stroke='#ccc']]:stroke-slate-200 [&_.recharts-sector[stroke='#fff']]:stroke-transparent [&_.recharts-sector]:outline-hidden [&_.recharts-surface]:outline-hidden",
          className
        )}
        {...props}
      >
        <ChartStyle id={chartId} config={config} />
        <ResponsiveContainer>{children}</ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  );
});
ChartContainer.displayName = 'ChartContainer';

const ChartStyle = ({ id, config }: { id: string; config: ChartConfig }) => {
  const colorConfig = Object.entries(config).filter(
    ([, itemConfig]) => itemConfig.theme || itemConfig.color
  );

  if (!colorConfig.length) {
    return null;
  }

  return (
    <style
      dangerouslySetInnerHTML={{
        __html: Object.entries(config)
          .map(([key, itemConfig]) => {
            const color = itemConfig.color;
            return color ? `[data-chart=${id}] { --color-${key}: ${color}; }` : '';
          })
          .join('\n'),
      }}
    />
  );
};

const ChartTooltip = Tooltip;

const ChartTooltipContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof Tooltip> &
    React.ComponentProps<'div'> & {
      hideLabel?: boolean;
      hideIndicator?: boolean;
      indicator?: 'line' | 'dot' | 'dashed';
      nameKey?: string;
      labelKey?: string;
      labelFormatter?: (label: any, payload: any[]) => React.ReactNode;
    }
>(
  (
    {
      active,
      payload,
      className,
      indicator = 'dot',
      hideLabel = false,
      hideIndicator = false,
      label,
      labelFormatter,
      labelClassName,
      formatter,
      color,
      nameKey,
      labelKey,
    }: any,
    ref
  ) => {
    const { config } = useChart();

    const tooltipLabel = React.useMemo(() => {
      if (hideLabel || !payload?.length) {
        return null;
      }

      const [item] = payload;
      const key = `${labelKey || item?.dataKey || item?.name || 'value'}`;
      const itemConfig = config[key];
      const value =
        !labelKey && typeof label === 'string'
          ? config[label]?.label || label
          : itemConfig?.label;

      if (labelFormatter) {
        return (
          <div className={cn('font-bold text-slate-800 mb-1', labelClassName)}>
            {labelFormatter(label, payload)}
          </div>
        );
      }

      if (!value) {
        return null;
      }

      return <div className={cn('font-bold text-slate-800 mb-1', labelClassName)}>{value}</div>;
    }, [label, labelFormatter, payload, hideLabel, labelClassName, config, labelKey]);

    if (!active || !payload?.length) {
      return null;
    }

    return (
      <div
        ref={ref}
        className={cn(
          'grid min-w-[8rem] items-start gap-1.5 rounded-xl border border-slate-200/90 bg-white/95 px-3 py-2 text-xs text-slate-900 shadow-xl backdrop-blur-md',
          className
        )}
      >
        {tooltipLabel}
        <div className="grid gap-1.5">
          {payload.map((item: any, index: number) => {
            const key = `${(nameKey && item.payload?.[nameKey]) || item.name || item.dataKey || 'value'}`;
            const itemConfig = config[key];
            const indicatorColor = color || item.payload.fill || item.color;

            return (
              <div
                key={item.dataKey || index}
                className={cn(
                  'flex w-full items-center gap-2 text-[11px] font-medium leading-none text-slate-600',
                  indicator === 'dot' && 'items-center'
                )}
              >
                {!hideIndicator && (
                  <span
                    className={cn(
                      'shrink-0 rounded-full',
                      indicator === 'dot' && 'h-2 w-2',
                      indicator === 'line' && 'h-0.5 w-3',
                      indicator === 'dashed' && 'h-0.5 w-3 border-b-2 border-dashed'
                    )}
                    style={{
                      backgroundColor: indicatorColor,
                      borderColor: indicatorColor,
                    }}
                  />
                )}
                <div className="flex flex-1 justify-between items-center leading-none">
                  <span className="text-slate-500">
                    {itemConfig?.label || item.name}
                  </span>
                  {item.value !== undefined && (
                    <span className="font-mono font-bold text-slate-900 ml-2">
                      {item.value.toLocaleString()}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
);
ChartTooltipContent.displayName = 'ChartTooltipContent';

const ChartLegend = Legend;

interface ChartLegendContentProps extends React.ComponentProps<'div'> {
  hideIcon?: boolean;
  nameKey?: string;
  payload?: Array<{
    value: any;
    dataKey?: string | number;
    color?: string;
    [key: string]: any;
  }>;
  verticalAlign?: 'top' | 'bottom' | 'middle';
}

const ChartLegendContent = React.forwardRef<
  HTMLDivElement,
  ChartLegendContentProps
>(({ className, hideIcon = false, payload, verticalAlign = 'bottom', nameKey }, ref) => {
  const { config } = useChart();

  if (!payload?.length) {
    return null;
  }

  return (
    <div
      ref={ref}
      className={cn(
        'flex items-center justify-center gap-4 pt-3 text-xs font-semibold text-slate-700',
        verticalAlign === 'top' && 'pb-3',
        className
      )}
    >
      {payload.map((item: any) => {
        const key = `${nameKey || item.dataKey || 'value'}`;
        const itemConfig = config[key];

        return (
          <div
            key={item.value}
            className={cn('flex items-center gap-1.5 [&>svg]:h-3 [&>svg]:w-3 [&>svg]:text-slate-500')}
          >
            {!hideIcon ? (
              <span
                className="h-2 w-2 shrink-0 rounded-full"
                style={{
                  backgroundColor: item.color,
                }}
              />
            ) : null}
            <span>{itemConfig?.label || item.value}</span>
          </div>
        );
      })}
    </div>
  );
});
ChartLegendContent.displayName = 'ChartLegendContent';

export {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  ChartStyle,
};
