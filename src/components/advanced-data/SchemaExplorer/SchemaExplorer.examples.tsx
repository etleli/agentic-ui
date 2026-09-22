import { useEffect, useMemo, useState } from 'react';
import { SchemaExplorer } from './SchemaExplorer';
import type { AdvancedDataDensity, AdvancedDataVariant } from '../AdvancedData.types';

export type SchemaExplorerExampleProps = {
  density?: AdvancedDataDensity;
  selectable?: boolean;
  selectedFieldId?: string;
  selectedTableId?: string;
  showNullable?: boolean;
  variant?: AdvancedDataVariant;
};

const schemaTables = [
  {
    description: 'Generated strategy candidates',
    fields: [
      { description: 'Stable row id', id: 'id', label: 'id', type: 'uuid' },
      { description: 'Candidate score', id: 'score', label: 'score', type: 'number' },
      { description: 'Risk classification', id: 'risk', label: 'risk_state', nullable: true, type: 'enum' },
    ],
    id: 'strategy_candidates',
    label: 'strategy_candidates',
  },
  {
    description: 'Broker account positions',
    fields: [
      { id: 'symbol', label: 'symbol', type: 'text' },
      { id: 'quantity', label: 'quantity', type: 'number' },
      { id: 'pnl', label: 'unrealized_pnl', type: 'currency' },
    ],
    id: 'positions',
    label: 'positions',
  },
];

export function SchemaExplorerExample({
  density = 'comfortable',
  selectable = true,
  selectedFieldId = 'score',
  selectedTableId = 'strategy_candidates',
  showNullable = true,
  variant = 'default',
}: SchemaExplorerExampleProps) {
  const [activeTableId, setActiveTableId] = useState(selectedTableId);
  const [activeFieldId, setActiveFieldId] = useState(selectedFieldId);

  useEffect(() => {
    setActiveTableId(selectedTableId);
  }, [selectedTableId]);

  useEffect(() => {
    setActiveFieldId(selectedFieldId);
  }, [selectedFieldId]);

  const activeTable = useMemo(() => schemaTables.find((table) => table.id === activeTableId) ?? schemaTables[0], [activeTableId]);

  return (
    <SchemaExplorer
      density={density}
      selectable={selectable}
      selectedFieldId={activeFieldId}
      selectedTableId={activeTable?.id}
      showNullable={showNullable}
      tables={schemaTables}
      variant={variant}
      onFieldSelect={(tableId, fieldId) => {
        setActiveTableId(tableId);
        setActiveFieldId(fieldId);
      }}
      onTableSelect={(tableId, table) => {
        setActiveTableId(tableId);
        setActiveFieldId(table.fields?.[0]?.id ?? '');
      }}
    />
  );
}
