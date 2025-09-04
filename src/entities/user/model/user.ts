import { Project } from "@/entities/project";

export interface User {
  id: number;
  username: string;
  email: string;
  password: string;
  role: string;
  projects: Project[];
}

export type UserDto = {
	id: number; 
	login: string; 
	password: string 
};