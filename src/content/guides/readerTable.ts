import type { ReaderRow, ReaderTable } from './types';

const READER_COLUMNS = [
  ['Event', 'event'],
  ['Dates', 'dates'],
  ['City', 'city'],
  ['Best for', 'bestFor'],
  ['AI focus', 'aiFocus'],
  ['Cost band', 'costBand'],
  ['Go·Skip·Watch', 'verdict'],
] as const satisfies ReadonlyArray<readonly [string, keyof ReaderRow]>;

export interface RenderableReaderTable {
  caption: string;
  headers: readonly string[];
  rows: readonly (readonly string[])[];
}

export function renderableReaderTable(table: ReaderTable): RenderableReaderTable {
  return {
    caption: table.caption,
    headers: READER_COLUMNS.map(([label]) => label),
    rows: table.rows.map((row) => READER_COLUMNS.map(([, key]) => row[key])),
  };
}
