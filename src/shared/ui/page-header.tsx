"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useQueryClient } from "@tanstack/react-query";

import {
  Button,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
  Input,
  Label,
} from "@/shared";
import { createProjectAction } from "@/features/projects";
import toast from "react-hot-toast";
import { useAuthStore } from "@/features/auth";
import { AiOutlinePlus } from "react-icons/ai";

interface PageHeaderProps {
  header: string;
  buttonText: string;
}

export function PageHeader({ header, buttonText }: PageHeaderProps) {
  const queryClient = useQueryClient();
  const [projectName, setProjectName] = useState("");
  const [connectionString, setConnectionString] = useState("");
  const [tableName, setTableName] = useState("");
  const userId = useAuthStore((state) => state.userId);

  // Optional: close dialog after success by clicking the close button programmatically
  const closeDialog = () => {
    const btn = document.getElementById("dialog-close-button");
    if (btn) (btn as HTMLButtonElement).click();
  };

  const handleCreateProject = async () => {
    if (!projectName || !connectionString || !tableName) {
      toast.error("Please fill required fields");
      return;
    }

    const payload = {
      connection_string: connectionString,
      name: projectName,
      table_name: tableName,
      table_schema: "", // hardcoded empty string as requested
      userId
    };

    const result = await createProjectAction(payload);
    if (result?.success) {
      toast.success("Project created successfully");
      setProjectName("");
      setConnectionString("");
      setTableName("");
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      closeDialog();
    } else {
      toast.error("Failed to create project");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, delay: 0.2, ease: "easeInOut" }}
      className="flex-between-col sm:flex-row sm:items-end gap-y-8"
    >
      <h3 className="text-7xl lg:text-8xl 2xl:text-9xl text-white font-semibold">
        {header}
      </h3>

      <Dialog>
        <DialogTrigger asChild>

				<Button className="h-14 font-normal px-8 gap-x-4">
          <AiOutlinePlus />
          {buttonText}
        </Button>
{/* <button className="bg-slate-800 no-underline group cursor-pointer relative shadow-md shadow-zinc-900 rounded-full p-px font-semibold leading-6 inline-block text-base  text-white">
  <span className="absolute inset-0 overflow-hidden rounded-full">
    <span className="absolute inset-0 rounded-full bg-[image:radial-gradient(75%_100%_at_50%_0%,rgba(56,189,248,0.6)_0%,rgba(56,189,248,0)_75%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
  </span>
  <div className="relative flex px-8 space-x-2 items-center z-10 rounded-full bg-zinc-950  ring-1 ring-white/10 py-4">
      {buttonText}
    <svg
      fill="none"
      height="16"
      viewBox="0 0 24 24"
      width="16"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M10.75 8.75L14.25 12L10.75 15.25"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </svg>
  </div>
  <span className="absolute -bottom-0 left-[1.125rem] h-px w-[calc(100%-2.25rem)] bg-gradient-to-r from-emerald-400/0 via-emerald-400/90 to-emerald-400/0 transition-opacity duration-500 group-hover:opacity-40" />
</button> */}

{/* <button className="relative inline-flex h-12 overflow-hidden rounded-full p-[1px] focus:outline-none  shadow-md text-base font-semibold text-white hover:brightness-125 transition-all">
  <span className="absolute inset-[-1000%] animate-[spin_10s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
  <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-black text-sm font-medium text-white backdrop-blur-3xl px-8 py-4">
    {buttonText}
  </span>
</button> */}

        </DialogTrigger>

        <DialogContent
          className="w-full py-8 bg-neutral-950 border-l-neutral-800 rounded-2xl
          flex flex-col justify-center overflow-hidden border-neutral-800
          px-8 gap-y-12"
        >
          <DialogHeader>
            <DialogTitle className="text-white text-5xl text-center">
               New project
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="project-name">Project name</Label>
              <Input
                id="project-name"
                className="bg-neutral-900 text-white border-neutral-800 font-poppins rounded-xl placeholder:text-neutral-600 focus:bg-neutral-900 focus:border-neutral-600"
                placeholder="My awesome project"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="connection-string">Connection string</Label>
              <Input
                id="connection-string"
                className="bg-neutral-900 text-white border-neutral-800 font-poppins rounded-xl placeholder:text-neutral-600 focus:bg-neutral-900 focus:border-neutral-600"
                placeholder="postgresql://user:pass@host:5432/db"
                value={connectionString}
                onChange={(e) => setConnectionString(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="table-name">Table name</Label>
              <Input
                id="table-name"
                className="bg-neutral-900 text-white border-neutral-800 font-poppins rounded-xl placeholder:text-neutral-600 focus:bg-neutral-900 focus:border-neutral-600"
                placeholder="orders"
                value={tableName}
                onChange={(e) => setTableName(e.target.value)}
              />
            </div>

          </div>

          <DialogFooter className="flex flex-row items-center gap-x-4">
            <DialogClose
              id="dialog-close-button"
              className="py-3 w-full text-xl bg-transparent border border-neutral-800 hover:text-neutral-500 text-neutral-600 font-poppins rounded-2xl z-40 hover:border-neutral-800 transition-colors hover:brightness-125"
              type="submit"
            >
              Cancel
            </DialogClose>
            <Button
              className="py-6 w-full text-xl bg-white text-black font-poppins rounded-2xl z-40 transition-colors hover:bg-white/90 hover:border-white"
              type="submit"
              onClick={handleCreateProject}
            >
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* <DialogContent
          className="w-full py-8 bg-neutral-950 border-l-neutral-800 rounded-2xl
          flex flex-col justify-center overflow-hidden border-neutral-800
          px-8 gap-y-12"
        >
          <DialogHeader>
            <DialogTitle className="text-white text-5xl text-center">
              Are you sure?
            </DialogTitle>
          </DialogHeader>

          <DialogDescription className="text-neutral-600 font-poppins text-lg text-center">
            Deleting this project will permanently remove it from your account.
          </DialogDescription>

          <DialogFooter className="flex flex-row items-center gap-x-4">
            <DialogClose
              id="dialog-close-button"
              className="py-3 w-full text-xl bg-transparent border border-neutral-800 hover:text-neutral-500 text-neutral-600 font-poppins rounded-2xl z-40 hover:border-neutral-800 transition-colors hover:brightness-125"
              type="submit"
            >
              Cancel
            </DialogClose>
            <Button
              disabled={!selectedProject}
              className="py-6 w-full text-xl bg-red-600/75 text-white font-poppins rounded-2xl z-40 transition-colors hover:bg-red-600/90 hover:border-red-500"
              type="submit"
              onClick={onDelete}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent> */}
    </motion.div>
  );
}
