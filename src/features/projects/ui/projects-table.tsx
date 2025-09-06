"use client";

import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarInset,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { File, Folder, Tree } from "@/components/magicui/file-tree";
import { DatabaseIcon, RouteIcon } from "lucide-react";
import { Button } from "@/shared";
import { ViewGridIcon } from "@radix-ui/react-icons";


type TableItem = { id: string; name: string };

type Selection =
  | { type: "pattern"; tableId: string }
  | { type: "overview"; tableId: string };

export function ProjectsTable({ tables }: { tables: TableItem[] }) {
  const [selected, setSelected] = useState<Selection | null>(() =>
    tables.length > 0 ? { type: "overview", tableId: tables[0].id } : null,
  );

  useEffect(() => {
    if (!selected && tables.length > 0) {
      setSelected({ type: "overview", tableId: tables[0].id });
    }
  }, [tables, selected]);

  const selectedKey = useMemo(() => {
    if (!selected) return undefined;
    if (selected.type === "pattern") return `${selected.tableId}/pattern`;
    if (selected.type === "overview") return `${selected.tableId}/overview`;
    return undefined;
  }, [selected]);

  const isSelected = (check: Selection): boolean => {
    if (!selected) return false;
    return selected.type === check.type && selected.tableId === check.tableId;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.2, ease: "easeInOut" }}
      className={`w-full min-h-80 `}
    >
      <SidebarProvider className={`bg-black/30 `}>
        <Sidebar variant="inset" collapsible="icon" className={` relative `}>
          <SidebarSeparator />
          <SidebarContent className={`bg-black  rounded-2xl border border-neutral-900/50`}>
            {tables.length === 0 ? (
              <div className="p-4 text-neutral-300 ">No tables yet</div>
            ) : (
              <div className="p-2 ">
                <Tree
									className="pt-2"
                  initialSelectedId={selectedKey}
                  initialExpandedItems={tables.map((t) => t.id)}
                  openIcon={<DatabaseIcon className="size-4" />}
                  closeIcon={<DatabaseIcon className="size-4" />}
                >
                  {tables.map((table) => (
                    <Folder className="text-base" key={table.id} value={table.id} element={table.name}>
                      <File
                        className="text-base"
                        value={`${table.id}/pattern`}
                        isSelect={isSelected({ type: "pattern", tableId: table.id })}
                        onClick={() => setSelected({ type: "pattern", tableId: table.id })}
                        fileIcon={<RouteIcon className="size-4" />}
                      >
                        Pattern
                      </File>
                      <File
												className="text-base"
                        value={`${table.id}/overview`}
                        isSelect={isSelected({ type: "overview", tableId: table.id })}
                        onClick={() => setSelected({ type: "overview", tableId: table.id })}
                        fileIcon={<ViewGridIcon />}
                      >
                        Overview
                      </File>
                    </Folder>
                  ))}
                </Tree>
              </div>
            )}
          </SidebarContent>
          <SidebarRail />
        </Sidebar>
        <SidebarInset className={`rounded-2xl border border-neutral-900`}>
          <div className="p-6 text-neutral-200 min-h-80">
            {tables.length === 0 && <p className="text-lg">No tables yet</p>}

            {tables.length > 0 && selected && selected.type === "pattern" && (
              <div>
                <h3 className="text-xl font-semibold mb-2">Pattern</h3>
                <p className="text-neutral-400">Pattern route for {selected.tableId}</p>
              </div>
            )}

            {tables.length > 0 && selected && selected.type === "overview" && (
              <div>
								<div>!</div>
                <h3 className="text-neutral-50 mb-4 font-semibold">No versions yet</h3>
                <Button className="bg-green-600/75 hover:bg-green-600/90 text-white">Create version</Button>
              </div>
            )}
          </div>
        </SidebarInset>
      </SidebarProvider>
    </motion.div>
  );
}
