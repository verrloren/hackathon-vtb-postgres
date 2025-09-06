export interface Project {
	id: number;
	name: string;
	user_id: number;
	file_path: string;
	last_edit_date: string; 
	project_status: string;
	code_reviews: CodeReview;
}

export interface ProjectResponse {
  success: boolean;
  response: Project[];
}


export interface CodeReview {
  id: number;
  project_id: number;
  project_review: string;
  issues: Issue[];
}

export interface Issue {
  id: number;
  codereview_id: number;
  type_of_issue: string; 
  line_number: string;
	file_path: string;
  line_snippet: string;
  issue_body: string;
  suggestions: string;
  suggested_code: string;
}