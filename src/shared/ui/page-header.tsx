"use client";

import { useState } from "react";
import { motion } from 'framer-motion';
import { AiOutlinePlus } from "react-icons/ai";

import { Button, Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose, Input, Label } from "@/shared";

interface PageHeaderProps {
	header: string;
	buttonText: string;
}

export function PageHeader({ header, buttonText }: PageHeaderProps) {
  const [projectName, setProjectName] = useState("");
  const [connectionString, setConnectionString] = useState("");

  const handleCreateProject = () => {
    // Dummy create handler for now
    // Replace with actual API call/mutation later
    // eslint-disable-next-line no-console
    console.log("Create project clicked", { projectName, connectionString });
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
          <Button className="h-14 font-normal px-8">
            <AiOutlinePlus />
            {buttonText}
          </Button>
        </DialogTrigger>

        <DialogContent           className="w-full py-8 bg-neutral-950 border-l-neutral-800 rounded-2xl
          flex flex-col justify-center overflow-hidden border-neutral-800
          px-8 gap-y-12">
          <DialogHeader>
            <DialogTitle className="text-4xl">Create Project</DialogTitle>
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
              className="py-6 w-full text-xl bg-green-600/75 text-white font-poppins rounded-2xl z-40 transition-colors hover:bg-green-600/90 hover:border-green-500"
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
