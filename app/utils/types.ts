export interface ValidationError {
  field: string;
  message?: string;
}

export interface Message {
  severity: 'error' | 'success' | 'info';
  message: string;
}
