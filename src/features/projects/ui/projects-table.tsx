"use client";

import { motion } from "framer-motion";
import { useMemo, useState } from "react";

import { Button } from "@/shared";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarInset,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { File, Folder, Tree } from "@/components/magicui/file-tree";

type Version = { id: string; name: string };
type TableItem = { id: string; name: string; versions: Version[] };

type Selection =
  | { type: "pattern"; tableId: string }
  | { type: "overview"; tableId: string }
  | { type: "version"; tableId: string; versionId: string };

export function ProjectsTable() {
  const [tables, setTables] = useState<TableItem[]>([]);
  const [selected, setSelected] = useState<Selection | null>(null);

  const selectedKey = useMemo(() => {
    if (!selected) return null;
    if (selected.type === "pattern") return `${selected.tableId}/pattern`;
    if (selected.type === "overview") return `${selected.tableId}/overview`;
    if (selected.type === "version") return `${selected.tableId}/overview/${selected.versionId}`;
    return null;
  }, [selected]);

  const addMockTable = () => {
    const id = `table-${tables.length + 1}`;
    const newTable: TableItem = { id, name: `table${tables.length + 1}`, versions: [] };
    setTables((prev) => [...prev, newTable]);
    setSelected({ type: "overview", tableId: id });
  };

  const addMockVersion = (tableId: string) => {
    setTables((prev) =>
      prev.map((t) =>
        t.id === tableId
          ? {
              ...t,
              versions: [
                ...t.versions,
                { id: `v-${t.versions.length + 1}`, name: `version ${t.versions.length + 1}` },
              ],
            }
          : t,
      ),
    );
    const vIndex = tables.find((t) => t.id === tableId)?.versions.length ?? 0;
    setSelected({ type: "version", tableId, versionId: `v-${vIndex + 1}` });
  };

  const isSelected = (check: Selection): boolean => {
    if (!selected) return false;
    if (selected.type !== check.type) return false;
    if (selected.tableId !== check.tableId) return false;
    if (check.type === "version") {
      return selected.type === "version" && selected.versionId === check.versionId;
    }
    return true;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.2, ease: "easeInOut" }}
      className="w-full min-h-80"
    >
      <SidebarProvider>
        <Sidebar variant="inset" collapsible="icon" className="bg-black/30 relative">
          <SidebarHeader className="text-sm text-neutral-400">
            Tables
          </SidebarHeader>
          <SidebarSeparator />
          <SidebarContent>
            {tables.length === 0 ? (
              <div className="p-4 text-neutral-300">
                <p className="mb-3">No tables yet</p>
                <Button onClick={addMockTable}>Connect table</Button>
              </div>
            ) : (
              <div className="p-2 ">
                <Tree initialSelectedId={selectedKey ?? undefined}>
                  {tables.map((table) => (
                    <Folder key={table.id} value={table.id} element={table.name}>
                      <File
                        value={`${table.id}/pattern`
                        }
                        isSelect={isSelected({ type: "pattern", tableId: table.id })}
                        onClick={() => setSelected({ type: "pattern", tableId: table.id })}
                      >
                        Pattern
                      </File>
                      <Folder
                        value={`${table.id}/overview`}
                        element="Overview"
                        isSelect={isSelected({ type: "overview", tableId: table.id })}
                      >
                        {table.versions.map((v) => (
                          <File
                            key={v.id}
                            value={`${table.id}/overview/${v.id}`}
                            isSelect={isSelected({ type: "version", tableId: table.id, versionId: v.id })}
                            onClick={() =>
                              setSelected({ type: "version", tableId: table.id, versionId: v.id })
                            }
                          >
                            {v.name}
                          </File>
                        ))}
                      </Folder>
                    </Folder>
                  ))}
                </Tree>
              </div>
            )}
          </SidebarContent>
          <SidebarRail />
        </Sidebar>
        <SidebarInset className="rounded-2xl border border-neutral-900/50">
          <div className="p-6 text-neutral-200 min-h-80">
            {tables.length === 0 && (
              <div className="flex flex-col items-start gap-3">
                <p className="text-lg">No tables yet</p>
                <Button onClick={addMockTable}>Connect table</Button>
              </div>
            )}

            {tables.length > 0 && selected && selected.type === "pattern" && (
              <div>
                <h3 className="text-xl font-semibold mb-2">Pattern</h3>
                <p className="text-neutral-400">Pattern route for {selected.tableId}</p>
              </div>
            )}

            {tables.length > 0 && selected && selected.type === "overview" && (
              <div>
                <h3 className="text-xl font-semibold mb-2">Overview</h3>
                {tables.find((t) => t.id === selected.tableId)?.versions.length ? (
                  <p className="text-neutral-400">Select a version from the sidebar.</p>
                ) : (
                  <div className="flex flex-col items-start gap-3">
                    <p className="text-neutral-400">No versions yet</p>
                    <Button onClick={() => addMockVersion(selected.tableId)}>Create versions</Button>
                  </div>
                )}
              </div>
            )}

            {tables.length > 0 && selected && selected.type === "version" && (
              <div>
                <h3 className="text-xl font-semibold mb-2">Version</h3>
                <p className="text-neutral-400">
                  Showing {selected.versionId} for {selected.tableId}
                </p>
              </div>
            )}
          </div>
        </SidebarInset>
      </SidebarProvider>
    </motion.div>
  );
}
