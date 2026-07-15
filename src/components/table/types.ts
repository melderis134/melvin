export type ColumnType = 'text' | 'number' | 'date' | 'select' | 'checkbox' | 'computed';

export interface ColumnDef<T> {
  key: Extract<keyof T, string>;
  label: string;
  type: ColumnType;
  options?: string[];
  align?: 'left' | 'right';
  sum?: boolean;
  formatValue?: (value: unknown, row: T) => string;
  width?: string;
}
