"use server";

import { HydrationBoundary, dehydrate } from "@tanstack/react-query";

import { getQueryClient, Container, PageContainer } from "@/shared";
import {
  projectsApi,
  getProjectsAction,
  ProjectName,
  ActionButtons,
  ProjectsTable,
} from "@/features/projects";
import { Project } from "@/entities";


export default async function HomePage({params }: { params: { projectId: string }}) {

	const { projectId } = await params;
  const queryClient = getQueryClient();
  const parsedProjectId = parseInt(projectId);

  if (!queryClient.getQueryData([projectsApi.baseKey])) {
    await queryClient.prefetchQuery({
      queryKey: [projectsApi.baseKey],
      queryFn: getProjectsAction,
    });
  }

  const projects = queryClient.getQueryData<Project[]>([projectsApi.baseKey]);
  const project = projects?.find((p) => p.id === parsedProjectId);

  if (!project) return <div className="text-white text-center mt-52 text-2xl">Project not found</div>

  const dehydratedState = dehydrate(queryClient);

  return (
    <PageContainer>
      {/* SPHERE */}
      <div
        className="radial-ellipse-dashboard w-full aspect-square
        fixed right-0 -top-[15%] sm:-top-1/4 md:-top-1/4 lg:-top-[40%] xl:-top-[60%]"
      />

      <Container>
        <HydrationBoundary state={dehydratedState}>
          <div className="w-full relative flex flex-col justify-center pt-44 md:pt-52 lg:pt-60 2xl:pt-72 gap-y-6 md:gap-y-16 xl:gap-y-20">

            <div className={`w-full rounded-2xl px-6 md:px-8 py-5`}>
              <div className="w-full flex-center-col md:justify-between md:flex-row gap-y-6 md:gap-y-10">
                <ProjectName projectName={project.name} />
                <ActionButtons bg="black" rounded="full" redirect={true} />
              </div>
            </div>

            <div className="h-full w-full">
              <ProjectsTable />
            </div>
          </div>
        </HydrationBoundary>
      </Container>
			</PageContainer>
  );
}
