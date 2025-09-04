"use client";

import Link from "next/link";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { MenuIcon } from "lucide-react";
import { useRouter } from "next/navigation";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Button,
} from "@/shared";
import { Logo } from "@/widgets/header";
import { useLogout } from "@/features/auth";

export function Header() {
  const router = useRouter();
  const { handleLogout } = useLogout();

  const onLogout = async () => {
    await handleLogout()
      .then(() => {
        document.cookie =
          "access_token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
        toast.success("You have been logged out.");
        router.push("/auth/login");
        router.refresh();
      })
      .catch((error) => toast.error("Logout failed: " + error));
  };

  return (
    <motion.header
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
      className="w-full h-24 z-10 absolute top-0 left-0
			 bg-transparent flex items-center justify-center"
    >
      <nav
        className="w-full 
			mx-12 sm:mx-16 md:mx-24 lg:mx-28 xl:mx-28 2xl:mx-48 
			flex items-center justify-between "
      >
        <Logo />

        {/* <MainNav /> */}

        <DropdownMenu modal={false}>
          <DropdownMenuTrigger>
            <MenuIcon
              aria-label="Menu"
              size={20}
              className={`transition-colors text-neutral-400 hover:text-white`}
            />
          </DropdownMenuTrigger>

          <DropdownMenuContent className="mt-2 rounded-2xl bg-black border border-neutral-800 hover:border-neutral-50 transition-colors shadow-lg ">
            <DropdownMenuItem className="hover:bg-black cursor-pointer">
              <Link
                className="w-full flex items-center justify-center"
                href="/"
              >
                <Button variant="ghost" className="w-full text-neutral-400">
                  Projects
                </Button>
              </Link>
            </DropdownMenuItem>

            <DropdownMenuItem className="hover:bg-black cursor-pointer">
              <Button
                variant="ghost"
                className="w-full text-neutral-400"
                onClick={onLogout}
              >
                Sign out
              </Button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </nav>
    </motion.header>
  );
}
