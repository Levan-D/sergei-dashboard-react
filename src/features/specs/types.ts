export type SpecRow = { id: string; key: string; value: string };
export type SpecGroup = { id: string; name: string; rows: SpecRow[] };
export type SpecMod = { id: string; name: string; groups: SpecGroup[] };
