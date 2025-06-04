export interface HashAdapter {
  hash: (value: string) => Promise<string>
}
