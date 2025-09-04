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

  // This means all ProjectDto fields are optional EXCEPT id
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


  createProject: async (formData: FormData, token: string | undefined) => {
		const projectName = formData.get('projectName');
		const files = formData.get('files')
     return jsonApiInstance<ResponseDto>(`/api/projects?name=${projectName}`, {
      method: 'POST',
			headers: {
				Authorization: `Bearer ${token}`,
        "X-API-KEY": process.env.BACKEND_API_KEY as string,

			},
      json: files,
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


