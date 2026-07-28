export type SecurityEventType =
  | 'AUTH_FAILED'
  | 'AUTH_SUCCESS'
  | 'UNAUTHORIZED_ACCESS'
  | 'RATE_LIMIT_EXCEEDED'
  | 'PAYLOAD_TOO_LARGE'
  | 'INVALID_INPUT'
  | 'VALIDATION_FAILED'
  | 'INQUIRY_RECEIVED'
  | 'API_PAYLOAD_MALFORMED'
  | 'SERVER_ERROR';

interface LogContext {
  ip?: string;
  user_id?: string;
  path?: string;
  method?: string;
  details?: Record<string, any>;
  [key: string]: any;
}

// Requirement 3: Redact sensitive fields (passwords, tokens, PII) from structured logs
function redactSensitiveData(data: Record<string, any>): Record<string, any> {
  const redacted = { ...data };
  const SENSITIVE_KEYS = ['password', 'token', 'access_token', 'refresh_token', 'secret', 'authorization', 'cookie', 'ssn'];

  for (const key of Object.keys(redacted)) {
    if (SENSITIVE_KEYS.some((k) => key.toLowerCase().includes(k))) {
      redacted[key] = '[REDACTED]';
    } else if (typeof redacted[key] === 'object' && redacted[key] !== null) {
      redacted[key] = redactSensitiveData(redacted[key]);
    }
  }

  return redacted;
}

export function logSecurityEvent(type: SecurityEventType, context: LogContext) {
  const eventPayload = {
    timestamp: new Date().toISOString(),
    event: type,
    ip: context.ip || 'UNKNOWN',
    user_id: context.user_id || 'ANONYMOUS',
    path: context.path || '',
    method: context.method || '',
    details: context.details ? redactSensitiveData(context.details) : redactSensitiveData(context),
  };

  // Output structured JSON logs for log ingestion tools (Datadog, AWS CloudWatch, Logtail)
  console.log(JSON.stringify(eventPayload));
}
