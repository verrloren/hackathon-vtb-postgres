import { jsonApiInstance, ResponseDto } from "@/shared";
import { ProjectsResponse } from "@/features/projects";
import { Project } from "@/entities";



export type ProjectStatus = 'pending' | 'processing' | 'success' | 'error';

export interface ProjectStatusResponse {
  response: Project;
}


export const projectsApi = {
  baseKey: "projects",
  baseUrl: "/api/projects",

  getProjects: async (token: string | undefined) => {
    const response = await jsonApiInstance<ProjectsResponse>("/api/projects", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "X-API-KEY": process.env.BACKEND_API_KEY as string,
      },
      json: null,
    });
    if (!response) {
      return [];
    }
    return response.response;
  },

  createProject: async (
    data: {
      connection_string: string;
      name: string;
      table_name: string;
      table_schema: string; // will be hardcoded as ""
      user_id?: string;
    },
    token: string | undefined
  ) => {
    return jsonApiInstance<ResponseDto>(`/api/projects`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "X-API-KEY": process.env.BACKEND_API_KEY as string,
      },
      json: data,
    });
  },

  updateProject: (
    data: Partial<Project> & { id: number; name: string },
    token: string | undefined
  ) => {
    return jsonApiInstance<ResponseDto>(`/api/projects?id=${data.id}&name=${data.name}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "X-API-KEY": process.env.BACKEND_API_KEY as string,
      },
      json: null,
    });
  },

  deleteProject: (
    data: Partial<Project> & { id: number },
    token: string | undefined
  ) => {
    return jsonApiInstance<ResponseDto>(`/api/projects`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "X-API-KEY": process.env.BACKEND_API_KEY as string,
      },
      json: data,
    });
		
  },



	
	checkProjectStatus: async (projectId: number, token: string | undefined): Promise<ProjectStatusResponse> => {
    return jsonApiInstance(`/api/projects?id=${projectId}`, {
			method: 'GET',
			headers: {
				Authorization: `Bearer ${token}`,
        "X-API-KEY": process.env.BACKEND_API_KEY as string,
			},
			json: null
		});
  }
};

