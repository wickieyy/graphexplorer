'use client'
import Link from "next/link";
// import { useRouter } from "next/navigation";
export default function Home() {
  // const router = useRouter();
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <h1 className="text-4xl font-bold text-center sm:text-left">
          Welcome to Graph Explorer
        </h1>
        <p className="text-lg text-center sm:text-left">
          Visualize and interact with complex graph networks effortlessly.
        </p>
        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <a
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-blue-500 text-white gap-2 hover:bg-blue-600 text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
            href="/playground"
          >
            Explore Graphs
          </a>
          <a
            className="rounded-full border border-solid border-gray-300 dark:border-gray-700 transition-colors flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
            href="/docs"
          >
            Documentation
          </a>
        </div>
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="/learn"
        >
          Learn
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="/examples"
        >
          Examples
        </a>
        <Link 
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="/about">
            About Us
        </Link>
        <Link 
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="/layout">
            Layout
        </Link>
      </footer>
    </div>
  );
}
