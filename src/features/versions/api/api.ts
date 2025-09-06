import { jsonApiInstance, ResponseDto, Version } from "@/shared";



export type VersionStatus = 'pending' | 'processing' | 'success' | 'error';

export interface VersionStatusResponse {
  response: Version;
}


export const versionsApi = {
  baseKey: "version",
  baseUrl: "/api/version",

  getVersions: async (token: string | undefined) => {
    const response = await jsonApiInstance<VersionStatusResponse>("/api/version", {
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

  createVersion: async (
    data: {
      connection_string: string;
      name: string;
      table_name: string;
      table_schema: string; // will be hardcoded as ""
      user_id?: string;
    },
    token: string | undefined
  ) => {
    return jsonApiInstance<ResponseDto>(`/api/version`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "X-API-KEY": process.env.BACKEND_API_KEY as string,
      },
      json: data,
    });
  },

  updateVersion: (
    data: Partial<Version> & { id: number; name: string },
    token: string | undefined
  ) => {
    const { id, ...payload } = data as { id: number } & Record<string, unknown>;
    return jsonApiInstance<ResponseDto>(`/api/version?id=${id}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "X-API-KEY": process.env.BACKEND_API_KEY as string,
        },
        json: payload,
      }
    );
  },

  deleteVersion: (
    data: Partial<Version> & { id: number },
    token: string | undefined
  ) => {
    return jsonApiInstance<ResponseDto>(`/api/version`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "X-API-KEY": process.env.BACKEND_API_KEY as string,
      },
      json: data,
    });
		
  },



	
	checkVersionStatus: async (projectId: number, token: string | undefined): Promise<VersionStatusResponse> => {
    return jsonApiInstance(`/api/version?id=${projectId}`, {
			method: 'GET',
			headers: {
				Authorization: `Bearer ${token}`,
        "X-API-KEY": process.env.BACKEND_API_KEY as string,
			},
			json: null
		});
  }
};
