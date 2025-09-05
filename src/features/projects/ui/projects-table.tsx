"use client";

import { Search } from "lucide-react";
import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import { CodeBlock } from "react-code-block";
import { themes } from "prism-react-renderer";
import { CodeIcon } from "@radix-ui/react-icons";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Button,
  Input,
  useCopyCode,
} from "@/shared";
import { useProjectsStore } from "@/features/projects";
import styles from "@/features/projects/ui/project-card.module.css";

function HighlightText({ text, query }: { text: string; query: string }) {
  if (!query) return <>{text}</>;
  const regex = new RegExp(`(${query})`, "gi");
  const parts = text.split(regex);
  return (
    <>
      {parts.map((part, i) =>
        part.toLowerCase() === query.toLowerCase() ? (
          <span key={i} className="bg-blue-600/30 text-blue-200">
            {part}
          </span>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
}

export function ProjectsTable() {

  const selectedProject = useProjectsStore((state) => state.selectedProject);
  const { getCopyStatus, copyToClipboard } = useCopyCode();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredReviews = useMemo(() => {
    if (!selectedProject?.code_reviews || !selectedProject.code_reviews.issues)
      return [];

    const query = searchQuery.toLowerCase();

    const filteredIssues = selectedProject.code_reviews.issues.filter(
      (issue) => {
        const issueContent = [
          issue.type_of_issue,
          issue.issue_body,
          issue.file_path,
          issue.line_snippet,
          issue.suggested_code,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        return issueContent.includes(query);
      }
    );

    return filteredIssues.length > 0
      ? [{ ...selectedProject.code_reviews, issues: filteredIssues }]
      : [];
  }, [selectedProject, searchQuery]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.2, ease: "easeInOut" }}
      className="w-full min-h-80 "
    >

			{/* TABS */}
      <Tabs defaultValue="codeReview" className="w-full text-white ">
			<div className={`w-full min-h-96 rounded-2xl pb-8 ${styles.glass}`}>
          <TabsList className="bg-transparent  border-b rounded-none px-4
					 md:px-12 2x:px-16 py-10 border-neutral-800 w-full justify-start gap-4">
            <TabsTrigger
              className="text-neutral-600 data-[state=active]:text-white font-poppins text-base md:text-lg 
							hover:text-neutral-200 data-[state=active]:bg-white/5 gap-x-2 flex items-center px-4"
              value="codeReview"
            >
              Code review <CodeIcon width={16} height={16} />
            </TabsTrigger>
            <TabsTrigger
              className="text-neutral-600 data-[state=active]:text-white font-poppins text-base md:text-lg 
							hover:text-neutral-200 data-[state=active]:bg-white/5 gap-x-2 flex items-center px-4"
              value="overview"
            >
              Overview{" "}
              <svg
                data-testid="geist-icon"
                height="12"
                strokeLinejoin="round"
                viewBox="0 0 16 16"
                width="12"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M14.4572 8.75C14.0853 11.9866 11.3362 14.5 8 14.5C4.41015 14.5 1.5 11.5899 1.5 8C1.5 4.66381 4.01342 1.91465 7.25 1.5428V7.75C7.25 8.30229 7.69772 8.75 8.25 8.75H14.4572ZM14.4572 7.25H8.75V1.5428C11.7405 1.88638 14.1136 4.2595 14.4572 7.25ZM16 8C16 12.4183 12.4183 16 8 16C3.58172 16 0 12.4183 0 8C0 3.58172 3.58172 0 8 0C12.4183 0 16 3.58172 16 8Z"
                  fill="currentColor"
                ></path>
              </svg>
            </TabsTrigger>
            <div className="relative max-w-32 ml-auto">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-neutral-700" />
              </span>
              <Input
                type="search"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 text-white bg-black/50 border border-neutral-800 rounded-xl py-2 focus:outline-none focus:border-white"
              />
            </div>
          </TabsList>
					
					{/* OVERVIEW */}
          <TabsContent
            className="text-neutral-300 font-ibmPlexMono  my-8 w-full px-4 md:px-12 2x:px-16"
            value="overview"
          >
            <div key={selectedProject?.code_reviews.id} className="flex items-center ">
              <h3 className="font-ibmPlexMono text-neutral-500 text-base md:text-lg">
                {selectedProject?.code_reviews.project_review}
              </h3>
            </div>

            {!selectedProject?.code_reviews && (
              <div className="flex items-center gap-x-2">
                <h3 className="ml-8 font-poppins text-neutral-200 text-xl">
                  No reviews available
                </h3>
              </div>
            )}
          </TabsContent>

          {/* SEARCH HERE */}
          <TabsContent
            className="text-neutral-300 font-ibmPlexMono mt-4 mb-8 w-full px-4 md:px-12 2x:px-16"
            value="codeReview"
          >
            {filteredReviews.length > 0 ? (
              filteredReviews.map((review) => (
                <div key={review.id} className="space-y-8">
                  {review.issues?.map((issue) => (
                    <div key={issue.id} className="mb-8 rounded-xl">
                      {/* File info */}
                      <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4 pt-4 2xl:pt-8 pb-8 text-sm ">
                        <h5 className="text-2xl md:text-3xl 2xl:text-4xl text-white">
                          <HighlightText
                            text={issue.type_of_issue}
                            query={searchQuery}
                          />
                        </h5>
                        <div className="flex items-center gap-x-8">
                          <p className="text-xs md:text-base xl:text-base font-ibmPlexMono text-neutral-600">
                            ~{" "}
                            <HighlightText
                              text={issue.file_path}
                              query={searchQuery}
                            />
                          </p>
                            {typeof Number(issue.line_number) === "number" && !isNaN(Number(issue.line_number)) && issue.line_number !== "" && (
                              <p className="text-xs md:text-base xl:text-base font-ibmPlexMono text-neutral-600">
																on Line {issue?.line_number}
															</p>
                            )}
                        </div>
                      </div>

                      {/* Issue and suggestions */}
                      <div className="space-y-6">
                        <div className="bg-red-600/20 pt-4 pb-2  px-4 rounded-2xl">
                          <h4 className="text-neutral-200 px-1 mb-2 text-lg font-medium flex items-center gap-x-2">
                            <span>
                              <svg
                                data-testid="geist-icon"
                                height="14"
                                strokeLinejoin="round"
                                viewBox="0 0 16 16"
                                width="14"
                              >
                                <path
                                  fillRule="evenodd"
                                  clipRule="evenodd"
                                  d="M8.55846 0.5C9.13413 0.5 9.65902 0.829456 9.90929 1.34788L15.8073 13.5653C16.1279 14.2293 15.6441 15 14.9068 15H1.09316C0.355835 15 -0.127943 14.2293 0.192608 13.5653L6.09065 1.34787C6.34092 0.829454 6.86581 0.5 7.44148 0.5H8.55846ZM8.74997 4.75V5.5V8V8.75H7.24997V8V5.5V4.75H8.74997ZM7.99997 12C8.55226 12 8.99997 11.5523 8.99997 11C8.99997 10.4477 8.55226 10 7.99997 10C7.44769 10 6.99997 10.4477 6.99997 11C6.99997 11.5523 7.44769 12 7.99997 12Z"
                                  fill="currentColor"
                                ></path>
                              </svg>
                            </span>
                            Error
                          </h4>
                          <p className="text-neutral-400 py-1">
                            <HighlightText
                              text={issue.issue_body}
                              query={searchQuery}
                            />
                          </p>

                          {/* CODE SNIPPET */}
                          {issue.line_snippet && (
                            <div className=" pt-4 pb-2 rounded-lg">
                              <CodeBlock
                                theme={themes.duotoneDark}
                                code={issue.line_snippet}
                                language="typescript"
                              >
                                <CodeBlock.Code
                                  className="w-full bg-black/90 text-wrap p-6 rounded-xl shadow-lg"
                                  style={{
                                    whiteSpace: "pre-wrap",
                                    wordBreak: "break-word",
                                    overflowWrap: "break-word",
                                  }}
                                >
                                  <div className="table-row ">
                                    <CodeBlock.LineNumber className="table-cell pr-4 text-sm text-gray-500 text-right select-none" />
                                    <CodeBlock.LineContent className="table-cell text-wrap flex-wrap ">
                                      <CodeBlock.Token />
                                    </CodeBlock.LineContent>
                                  </div>
                                </CodeBlock.Code>
                              </CodeBlock>
                            </div>
                          )}
                        </div>

                        {issue.suggestions && (
                          <div className="bg-green-600/20 pt-4 pb-4 rounded-2xl px-4">
                            <h4 className="text-neutral-200 mb-2 px-1 flex items-center text-lg font-medium gap-x-2">
                              <span>
                                <svg
                                  data-testid="geist-icon"
                                  height="14"
                                  strokeLinejoin="round"
                                  viewBox="0 0 16 16"
                                  width="14"
                                >
                                  <path
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                    d="M15.5607 3.99999L15.0303 4.53032L6.23744 13.3232C5.55403 14.0066 4.44599 14.0066 3.76257 13.3232L4.2929 12.7929L3.76257 13.3232L0.969676 10.5303L0.439346 9.99999L1.50001 8.93933L2.03034 9.46966L4.82323 12.2626C4.92086 12.3602 5.07915 12.3602 5.17678 12.2626L13.9697 3.46966L14.5 2.93933L15.5607 3.99999Z"
                                    fill="currentColor"
                                  ></path>
                                </svg>
                              </span>
                              Suggestion
                            </h4>
                            <p className="text-neutral-400 py-1">
                              {issue.suggestions}
                            </p>

                            {issue.suggested_code && (
                              <div className=" pt-4 rounded-lg relative">
                                <CodeBlock
                                  theme={themes.duotoneDark}
                                  code={issue.suggested_code}
                                  language="typescript"
                                >
                                  <CodeBlock.Code
                                    className="w-full bg-black/90 text-wrap  p-6 rounded-xl shadow-lg "
                                    style={{
                                      whiteSpace: "pre-wrap",
                                      wordBreak: "break-word",
                                      overflowWrap: "break-word",
                                    }}
                                  >
                                    <div className="table-row ">
                                      <CodeBlock.LineNumber className="table-cell pr-4 text-sm text-gray-500 text-right select-none" />
                                      <CodeBlock.LineContent className="table-cell text-wrap flex-wrap ">
                                        <CodeBlock.Token />
                                      </CodeBlock.LineContent>
                                    </div>
                                  </CodeBlock.Code>
                                  <Button
                                    className=" bg-black rounded-lg px-2 h-7 absolute text-neutral-600 font-light top-6 right-2 
																	text-sm hover:bg-transparent hover:text-neutral-500 border border-neutral-900 hover:border-neutral-800 transition-colors"
                                    onClick={() =>
                                      copyToClipboard(
                                        issue.suggested_code,
                                        `issue-${issue.id}`
                                      )
                                    }
                                  >
                                    {getCopyStatus(`issue-${issue.id}`)}
                                  </Button>
                                </CodeBlock>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ))
            ) : (
              <div className="flex items-center gap-x-2">
                <h3 className="mt-4 font-poppins text-neutral-400 text-xl">
                  No reviews found matching &quot;{searchQuery}&quot;
                </h3>
              </div>
            )}
          </TabsContent>
        </div>
      </Tabs>
    </motion.div>
  );
}
