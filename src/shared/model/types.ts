export interface ResponseDto {
  success: boolean;
  response: string;
}

export type UUID = string;
export type TimestampISO = string;

export interface User {
  id: UUID;
  username: string;
  email: string;
  password: string;
  role: string;
  projects: Project[];
}

export interface Project {
  id: UUID;
  name: string;
  tables: Table[];
  user_id: UUID;
  created_at: TimestampISO;
  updated_at: TimestampISO;
}

export interface Table {
  id: UUID;
  name: string;
  schema: string;
  connection_string: string;
  default_limits: string;
  versions: Version[];
  pattern: Pattern;
  project_id: UUID;
  created_at: TimestampISO;
  updated_at: TimestampISO;
}

export interface Version {
  id: UUID;
  commit_hash: string;
  pr_number: number | null;
  query: Query;
  metrics: Metrics;
  table_id: UUID;
  created_at: TimestampISO;
  updated_at: TimestampISO;
}

export interface Query {
  id: UUID;
  query_text: string;
  query_fingerprint?: string;
  status?: string;
  reason?: string;
  explain_json?: string;
  body_query: BodyQuery[];
  version_id: UUID;
  created_at: TimestampISO;
  updated_at: TimestampISO;
}

export interface BodyQuery {
	row_number: number;
  row: string;
  type: "error" | "warning" | "good";
  message: "most_expensive" | "n+1";
  analisys: string;
}

export interface Metrics {
  id: UUID;
  total_cost?: number;
  rows_estimated?: number;
  io_estimated?: number;
  cpu_estimated?: number;
  memory_estimated?: number;
  risk_flags?: string;
  limit_value?: number;
  severity?: string;
  version_id: UUID;
  created_at: TimestampISO;
  updated_at: TimestampISO;
}

export interface Pattern {
  id: UUID;
  fingerprint: string;
  query_template: string;
  calls?: number;
  avg_rows?: number;
  total_time?: number;
  risk?: string;
  explanation?: string;
  table_id: UUID;
  created_at: TimestampISO;
  updated_at: TimestampISO;
}
