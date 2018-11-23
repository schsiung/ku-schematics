export interface Schema {
  /** Name of the project to target. */
  project?: string;
  form?: boolean;

  defaultLanguage?: string;
  i18n?: boolean;

  codeStyle?: boolean;

  hmr?: boolean;
}
