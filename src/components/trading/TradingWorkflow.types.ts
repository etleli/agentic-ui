import type { HTMLAttributes, ReactNode } from 'react';

export type TradingDensity = 'compact' | 'comfortable' | 'spacious';
export type TradingTone = 'accent' | 'positive' | 'negative' | 'warning' | 'neutral' | 'auto';
export type TradingSurfaceVariant = 'default' | 'muted' | 'outline' | 'accent';
export type TradingSide = 'buy' | 'sell';
export type TradingOrderType = 'market' | 'limit' | 'stop' | 'stop-limit';
export type TradingTimeInForce = 'day' | 'gtc' | 'ioc' | 'fok';
export type TradingMarketState = 'open' | 'closed' | 'pre-market' | 'after-hours' | 'delayed' | 'halted';
export type TradingOrderStatus = 'draft' | 'submitted' | 'working' | 'partial' | 'filled' | 'canceled' | 'rejected';
export type TradingStrategyStatus = 'online' | 'watching' | 'paused' | 'error' | 'disabled';
export type BrokerConnectionState = 'connected' | 'connecting' | 'degraded' | 'offline';

export type TradingQuote = {
  change?: number;
  changePercent?: number;
  price: number;
  sparklineValues?: number[];
  spread?: number;
  symbol: string;
  volume?: number;
};

export type TradingPosition = {
  averagePrice: number;
  exposure?: number;
  marketValue: number;
  pnl: number;
  pnlPercent: number;
  quantity: number;
  side?: 'long' | 'short';
  symbol: string;
};

export type TradingOrder = {
  averageFillPrice?: number;
  filledQuantity?: number;
  orderType: TradingOrderType;
  price?: number;
  quantity: number;
  side: TradingSide;
  status: TradingOrderStatus;
  symbol: string;
  time?: string;
};

export type TradingStrategyMetric = {
  label: ReactNode;
  tone?: Exclude<TradingTone, 'auto'>;
  value: ReactNode;
};

export type TradingOrderTicketDraft = {
  limitPrice?: number;
  orderType: TradingOrderType;
  quantity: number;
  side: TradingSide;
  symbol: string;
  timeInForce: TradingTimeInForce;
};

export type PriceDisplayProps = Omit<HTMLAttributes<HTMLSpanElement>, 'children'> & {
  currency?: string;
  label?: ReactNode;
  precision?: number;
  showCurrency?: boolean;
  showSymbol?: boolean;
  size?: TradingDensity;
  symbol?: string;
  tone?: TradingTone;
  value: number;
};

export type PnLDisplayProps = Omit<HTMLAttributes<HTMLSpanElement>, 'children'> & {
  amount: number;
  currency?: string;
  mode?: 'amount' | 'percent' | 'both';
  percent?: number;
  showSign?: boolean;
  size?: TradingDensity;
  tone?: TradingTone;
};

export type OrderStatusProps = Omit<HTMLAttributes<HTMLSpanElement>, 'children'> & {
  animated?: boolean;
  label?: string;
  showDot?: boolean;
  size?: TradingDensity;
  status?: TradingOrderStatus;
  variant?: 'soft' | 'solid' | 'outline';
};

export type MarketStateBadgeProps = Omit<HTMLAttributes<HTMLSpanElement>, 'children'> & {
  animated?: boolean;
  label?: string;
  showDot?: boolean;
  size?: TradingDensity;
  state?: TradingMarketState;
  variant?: 'soft' | 'solid' | 'outline';
};

export type LatencyIndicatorProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
  label?: string;
  latencyMs?: number;
  showSignal?: boolean;
  size?: TradingDensity;
  thresholdWarningMs?: number;
  thresholdErrorMs?: number;
};

export type PositionSummaryProps = Omit<HTMLAttributes<HTMLElement>, 'children'> & {
  density?: TradingDensity;
  position?: TradingPosition;
  selected?: boolean;
  showExposure?: boolean;
  variant?: TradingSurfaceVariant;
};

export type OrderTicketProps = Omit<HTMLAttributes<HTMLElement>, 'children'> & {
  disabled?: boolean;
  estimatedFee?: number;
  estimatedNotional?: number;
  limitPrice?: number;
  orderType?: TradingOrderType;
  quantity?: number;
  side?: TradingSide;
  symbol?: string;
  timeInForce?: TradingTimeInForce;
  variant?: TradingSurfaceVariant;
  onSubmit?: (draft: TradingOrderTicketDraft) => void;
};

export type WatchlistProps = Omit<HTMLAttributes<HTMLElement>, 'children'> & {
  density?: TradingDensity;
  quotes?: TradingQuote[];
  selectable?: boolean;
  selectedSymbol?: string;
  showSparkline?: boolean;
  variant?: TradingSurfaceVariant;
  onSelectedSymbolChange?: (symbol: string) => void;
};

export type PositionsTableProps = Omit<HTMLAttributes<HTMLElement>, 'children'> & {
  density?: TradingDensity;
  positions?: TradingPosition[];
  selectable?: boolean;
  selectedSymbol?: string;
  showExposure?: boolean;
  variant?: 'default' | 'muted' | 'outline';
  onSelectedSymbolChange?: (symbol: string) => void;
};

export type TradeBlotterProps = Omit<HTMLAttributes<HTMLElement>, 'children'> & {
  density?: TradingDensity;
  orders?: TradingOrder[];
  selectable?: boolean;
  selectedIndex?: number;
  showFilledQuantity?: boolean;
  variant?: 'default' | 'muted' | 'outline';
  onSelectedOrderChange?: (orderIndex: number, order: TradingOrder) => void;
};

export type StrategyCardProps = Omit<HTMLAttributes<HTMLElement>, 'children'> & {
  description?: ReactNode;
  metrics?: TradingStrategyMetric[];
  name?: ReactNode;
  selected?: boolean;
  status?: TradingStrategyStatus;
  variant?: TradingSurfaceVariant;
};

export type RiskLimitPanelProps = Omit<HTMLAttributes<HTMLElement>, 'children'> & {
  currentExposure?: number;
  dailyLoss?: number;
  maxDailyLoss?: number;
  maxExposure?: number;
  riskScore?: number;
  showDetails?: boolean;
  variant?: TradingSurfaceVariant;
};

export type QuoteTileProps = Omit<HTMLAttributes<HTMLElement>, 'children'> & {
  quote?: TradingQuote;
  selected?: boolean;
  showSparkline?: boolean;
  variant?: TradingSurfaceVariant;
};

export type MarketTickerProps = Omit<HTMLAttributes<HTMLElement>, 'children'> & {
  animated?: boolean;
  quotes?: TradingQuote[];
  selectable?: boolean;
  selectedSymbol?: string;
  showSparkline?: boolean;
  variant?: TradingSurfaceVariant;
  onSelectedSymbolChange?: (symbol: string) => void;
};

export type OrderBookLevel = {
  price: number;
  size: number;
  total?: number;
};

export type OrderBookLadderProps = Omit<HTMLAttributes<HTMLElement>, 'children'> & {
  asks?: OrderBookLevel[];
  bids?: OrderBookLevel[];
  density?: TradingDensity;
  midpoint?: number;
  selectable?: boolean;
  selectedPrice?: number;
  showTotals?: boolean;
  variant?: 'default' | 'muted' | 'outline';
  onPriceSelect?: (price: number, side: TradingSide) => void;
};

export type AllocationItem = {
  color?: string;
  id: string;
  label: ReactNode;
  target?: number;
  value: number;
};

export type AllocationBreakdownProps = Omit<HTMLAttributes<HTMLElement>, 'children' | 'onSelect'> & {
  allocations?: AllocationItem[];
  density?: TradingDensity;
  selectable?: boolean;
  selectedId?: string;
  showTargets?: boolean;
  title?: ReactNode;
  variant?: TradingSurfaceVariant;
  onAllocationSelect?: (allocationId: string, allocation: AllocationItem) => void;
};

export type BrokerConnection = {
  detail?: ReactNode;
  id: string;
  label: ReactNode;
  latencyMs?: number;
  state?: BrokerConnectionState;
};

export type BrokerConnectionSummaryProps = Omit<HTMLAttributes<HTMLElement>, 'children' | 'onSelect'> & {
  connections?: BrokerConnection[];
  density?: TradingDensity;
  selectable?: boolean;
  selectedId?: string;
  title?: ReactNode;
  variant?: TradingSurfaceVariant;
  onConnectionSelect?: (connectionId: string, connection: BrokerConnection) => void;
};
