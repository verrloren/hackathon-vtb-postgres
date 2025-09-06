'use server';

import { Project } from "@/entities";
import { getToken } from "@/features/auth";
import { projectsApi } from "@/features/projects";

export const getProjectsAction = async (): Promise<Project[]> => {
  try {
    const { token } = await getToken();
    const projects = await projectsApi.getProjects(token);
		console.log('Projects fetched:', projects);
    return projects;
  } catch (error) {
    console.error("Failed to fetch projects:", error);
    return []; // Return empty array to prevent retrying
  }
};