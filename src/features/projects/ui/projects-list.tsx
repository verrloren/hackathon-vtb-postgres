"use client";

import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";

import {
	ClientLoader,
	container,
} from "@/shared";
import { 
	getProjectsAction, 
	projectsApi, 
	useProjectStatus, 
	useProcessingProjectsStore, } from "@/features/projects";
import { Project } from "@/entities";
import { ProjectCard } from "./project-card";




export function ProjectsList() {

  const processingProjects = useProcessingProjectsStore(state => state.processingProjects);

  const { data: projects = [], isLoading } = useQuery<Project[]>({
    queryKey: [projectsApi.baseKey],
    queryFn: getProjectsAction,
    select: (data) => {
      return [...data].sort((a, b) => {
        // First, sort by pending status
        if (a.project_status === "pending" && b.project_status !== "pending")
          return -1;
        if (a.project_status !== "pending" && b.project_status === "pending")
          return 1;

        // Then sort by last_edit_date
        return (
          new Date(b.last_edit_date).getTime() - 
          new Date(a.last_edit_date).getTime()
        );
      });
    },
  });

  const processingStatusQueries = projects
    .filter(project => 
      project.project_status === "pending" || 
      project.project_status === "processing" ||
      processingProjects.includes(project.id)
    )
    .map(project => ({
      projectId: project.id,
      // eslint-disable-next-line react-hooks/rules-of-hooks
      query: useProjectStatus(project.id)
    }));


	const projectStatuses = Object.fromEntries(
    processingStatusQueries.map(({ projectId, query }) => [
      projectId,
      query.data?.response.project_status
    ])
  );

  if (isLoading) return (
		<div className="w-full h-full flex justify-center items-center">
			<ClientLoader />
		</div>
	)

  // Prepare busy row and others
  const enriched = projects.map((p) => ({
    project: p,
    status: projectStatuses[p.id] || p.project_status,
  }));
  const busy = enriched.filter(({ status }) => status === "pending" || status === "processing");
  const others = enriched.filter(({ status }) => !(status === "pending" || status === "processing"));

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="w-full min-h-screen space-y-4"
    >
      {busy.length > 0 && (
        <div className="grid grid-flow-col auto-cols-fr gap-4 md:gap-6">
          {busy.map(({ project, status }) => (
            <ProjectCard key={project.id} project={project} status={status} />
          ))}
        </div>
      )}

      <div className="grid gap-x-4 md:gap-x-6 md:gap-y-6 gap-y-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-3 ">
        {others.map(({ project, status }) => (
          <ProjectCard key={project.id} project={project} status={status} />
        ))}
      </div>

    </motion.div>
  );
}
