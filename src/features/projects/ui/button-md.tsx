// button-md.tsx
'use client'

import { useState } from "react";
import { FaMarkdown } from "react-icons/fa";
import toast from "react-hot-toast";

import { Button } from "@/shared";
import { useProjectsStore, getMD } from "@/features/projects";
import styles from "@/features/projects/ui/project-card.module.css";

export function ButtonMD() {
  const [MDLoading, setMDLoading] = useState(false);
  const { selectedProject } = useProjectsStore();

  const handleMDDownload = async () => {
    if (!selectedProject) {
      toast.error('No project selected');
      return;
    }

    try {
      setMDLoading(true);
      const markdownContent = await getMD(selectedProject.id);

      if (!markdownContent || !markdownContent.success || !markdownContent.response) {
				throw new Error('Failed to fetch markdown content');
			}
      
      // Create blob from markdown content
      const blob = new Blob([markdownContent.response], { type: 'text/markdown;charset=utf-8' });
      const url = window.URL.createObjectURL(blob);
      
      // Create and trigger download
      const link = document.createElement('a');
      link.href = url;
      link.download = `${selectedProject.name}-report.md`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Cleanup
      window.URL.revokeObjectURL(url);
      toast.success('Markdown file downloaded successfully');
    } catch (error) {
      console.error('Markdown download error:', error);
      toast.error('Failed to download markdown file');
    } finally {
      setMDLoading(false);
    }
  };

  return (
    <Button
      onClick={handleMDDownload}
      disabled={MDLoading || !selectedProject}
      className={`w-12 h-12 py-2 px-2 bg-black/90 hover:bg-black/90 rounded-full border border-black/90 
					hover:border-white shadow-none transition-colors ${styles.glassRound}`}
    >
      {MDLoading ? (
        <div className="animate-spin">⌛</div>
      ) : (
        <FaMarkdown className="text-white" /> 
      )}
    </Button>
  );
}