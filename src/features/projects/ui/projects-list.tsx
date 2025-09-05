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

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="w-full min-h-screen gap-x-4 gap-y-4
			grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 "
    >
      {projects.map((project) => {
				const status = projectStatuses[project.id] || project.project_status;
        return (

          <ProjectCard key={project.id} project={project} status={status} />

    // PREVIOUS PROJECT CARD
		//       <motion.div
    //         variants={item}
    //         key={project.id}
    //         className={`relative min-w-40 min-h-48 border rounded-2xl 
    //           hover:border-neutral-400 transition-colors px-8 py-8 
    //           ${status === "pending" || status === "processing" ? "bg-[#080808]" : "bg-neutral-950"}
    //           ${status === "pending" || status === "processing" ? "border-none" : "border-neutral-600"}
    //           ${status === "pending" || status === "processing" ? "brightness-50" : "border-neutral-800"}
    //           ${status === "error" ? "border-red-800" : ""}
    //         `}
    //       >

    //         {/* PROJECT NAME */}
    //         <div className="flex flex-row items-center gap-x-3">
    //           <Link
    //             href={status !== "pending" && status !== "processing" ? `/${project.id}` : ""}
    //             onClick={(e) => {
    //               if (status === "pending" || status === "processing") {
    //                 e.preventDefault();
    //                 return;
    //               }
    //               selectProject(project);
    //             }}
    //             className={`text-white text-3xl
    //               ${status === "pending" || status === "processing" ? "hover:no-underline cursor-default" : "hover:underline cursor-pointer"}
    //               ${status === "error" ? "text-red-500" : ""}
    //             `}
    //           >
    //             {project.name}
    //           </Link>

		// 					{/* STATUS */}
    //           {status === "pending" || status === "processing" ? (
    //             <motion.div
    //               animate={{ rotate: 360 }}
    //               transition={spinTransition}
    //               className="w-3 h-3 mt-[7px] rounded-full border-2 border-neutral-600 border-t-transparent"
    //             />
    //           ) : status === "error" ? (
    //             <div className="w-2 h-2 mt-[7px] rounded-full bg-red-600" />
    //           ) : (
    //             <div className="w-2 h-2 mt-[7px] rounded-full bg-green-600" />
    //           )}
    //           {status === "processing" && (
    //             <span className="text-xs text-neutral-400">Processing...</span>
    //           )}
    //         </div>

    //         <div className="w-full flex items-start gap-x-8 mt-2">
    //           {/* GIT SECTION  */}
    //           <div className="pt-4 flex flex-col items-start gap-y-2">
    //             {/* <div className="w-full h-6 bg-neutral-900 rounded-xl flex justify-center items-center">
    //               <p className="flex items-center  gap-x-2 text-sm text-neutral-400">
    //                 2 tables
    //               </p>
    //             </div> */}
    //             <p className="flex items-center gap-x-2 text-sm text-neutral-400">
    //               2 tables
    //             </p>
    //             <p className="flex items-center gap-x-2 text-sm text-neutral-400">
    //               14 versions
    //             </p>1
    //             <p className="flex items-center gap-x-2 text-sm text-green-700">
    //               +15% queries speed increasement
    //             </p>
    //           </div>

    //         </div>
						
		// 				{/* DROPDOWN */}
    //         <div className="absolute top-6 right-4 ">
    //           <DropdownMenu modal={false}>
    //             <DropdownMenuTrigger>
    //               <DotsVerticalIcon
    //                 width={18}
    //                 height={18}
    //                 className="text-neutral-400 hover:text-white transition-colors"
    //               />
    //             </DropdownMenuTrigger>

    //             <DropdownMenuContent 
		// 						className="bg-neutral-950 w-full border border-neutral-800  rounded-xl">
    //               <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
    //                 <EditProjectSheet
    //                   projectId={project.id}
    //                   projectName={project.name}
    //                   bg="dark"
    //                   border="none"
    //                   wfull="wfull"
    //                   text="Edit"
    //                   rounded="md"
    //                 />
    //               </DropdownMenuItem>

    //               <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
    //                 <DeleteProjectDialog
    //                   projectId={project.id}
    //                   bg="dark"
    //                   border="none"
    //                   wfull="wfull"
    //                   text="Delete"
    //                   rounded="md"
    //                 />
    //               </DropdownMenuItem>
    //             </DropdownMenuContent>
    //           </DropdownMenu>
    //         </div>
    //       </motion.div>
        );
      })}
    </motion.div>
  );
}
