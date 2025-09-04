"use client";

import { motion } from 'framer-motion';
import { AiOutlinePlus } from "react-icons/ai";

import { Button } from "@/shared";

interface PageHeaderProps {
	header: string;
	buttonText: string;
}

export function PageHeader({ header, buttonText }: PageHeaderProps) {
  return (
    <motion.div 
			initial={{ opacity: 0}}
			animate={{ opacity: 1}}
			transition={{ duration: 0.4, delay: 0.2, ease: "easeInOut" }}
			className="flex-between-col sm:flex-row sm:items-end gap-y-8">
      <h3 className="text-7xl lg:text-8xl 2xl:text-9xl text-white font-semibold">
        {header}
      </h3>
        <Button className="h-14 font-normal ">
          <AiOutlinePlus />
          {buttonText}
        </Button>
    </motion.div>
  );
}
