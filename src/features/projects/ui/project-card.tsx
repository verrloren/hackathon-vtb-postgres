"use client";


import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { DotsVerticalIcon } from "@radix-ui/react-icons";

import { CardBody, CardContainer, CardItem } from "./3d-card";
import styles from "./project-card.module.css";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  spinTransition,
} from "@/shared";
import { EditProjectSheet, DeleteProjectDialog, useProjectsStore } from "@/features/projects";
import { Project } from "@/entities";

interface ProjectCardProps {
  project: Project;
  status: string;
}

export function ProjectCard({ project, status }: ProjectCardProps) {
  const selectProject = useProjectsStore((state) => state.setSelectedProject);

  const isBusy = status === "pending" || status === "processing";
  const isError = status === "error";

  return (
    <CardContainer className="inter-var w-full" containerClassName="py-0 my-0">
      <CardBody
        className={`relative group/card w-full h-full rounded-2xl px-8 py-8 ${styles.glass}`}>
        <CardItem translateZ={50} className="flex flex-row items-center gap-x-3">
          <Link
            href={`/${project.id}`}
            onClick={(e) => {
              if (isBusy) {
                e.preventDefault();
                return;
              }
              selectProject(project);
            }}
            className={`text-white text-3xl ${
              isBusy ? "hover:no-underline cursor-default" : "hover:underline cursor-pointer"
            } ${isError ? "text-red-500" : ""}`}
          >
            {project.name}
          </Link>

          {isBusy ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={spinTransition}
              className="w-3 h-3 mt-[7px] rounded-full border-2 border-neutral-600 border-t-transparent"
            />
          ) : isError ? (
            <div className="w-2 h-2 mt-[7px] rounded-full bg-red-600" />
          ) : (
            <div className="w-2 h-2 mt-[7px] rounded-full bg-green-600" />
          )}
          {status === "processing" && (
            <span className="text-xs text-neutral-400">Processing...</span>
          )}
        </CardItem>

        <CardItem translateZ={30} className="w-full flex items-start gap-x-8 mt-4">
          <div className="pt-2 flex flex-col items-start gap-y-2">
            <p className="flex items-center gap-x-2 text-sm text-neutral-400">2 tables</p>
            <p className="flex items-center gap-x-2 text-sm text-neutral-400">14 versions</p>
            <p className="flex items-center gap-x-2 text-sm text-red-500">1 ci error</p>
            <p className="flex items-center gap-x-2 text-sm text-green-500">+15% queries speed increasement</p>
          </div>
        </CardItem>

        <CardItem translateZ={40} className="absolute top-6 right-4">
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger>
              <DotsVerticalIcon
                width={18}
                height={18}
                className="text-neutral-400 hover:text-white transition-colors"
              />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-neutral-950 w-full border border-neutral-800 rounded-xl">
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                <EditProjectSheet
                  projectId={project.id}
                  projectName={project.name}
                  bg="dark"
                  border="none"
                  wfull="wfull"
                  text="Edit"
                  rounded="md"
                />
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                <DeleteProjectDialog
                  projectId={project.id}
                  bg="dark"
                  border="none"
                  wfull="wfull"
                  text="Delete"
                  rounded="md"
                />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardItem>
      </CardBody>
    </CardContainer>
  );
}
