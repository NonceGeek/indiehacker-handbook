import { useEffect, useState } from "react";
import { IconLink, IconUser } from "@tabler/icons-react";
import clsx from "clsx";
import { NextPage } from "next";
import TopicCard from "~~/components/TopicCard";
import { useCategoryContext } from "~~/provider/categoryProvider";
import ReactMarkdown from 'react-markdown';
import fs from 'fs';
import path from 'path';

interface ETHSpaceProps {
  markdownContent: string;
}

const ETHSpace: NextPage<ETHSpaceProps> = ({ markdownContent }) => {
  const { categories, category, loading, setCategory } = useCategoryContext();
  const [postLoading, setPostLoading] = useState(false);
  const [pageIndex, setPageIndex] = useState(1);
  const [posts, setPosts] = useState<Array<any>>([]);
  const [connectedAddress, setConnectedAddress] = useState("0xbeafc083600efc2376648bff353ce8a3ecaa1463");
  
  const onNextPage = () => {
    setPageIndex(pageIndex + 1);
  };

  const onPrevPage = () => {
    if (pageIndex > 1) {
      setPageIndex(pageIndex - 1);
    }
  };

  const setCategoryHandler = (category: string) => {
    setCategory(category);
  };

  const fetchPosts = async (page: number) => {
    setPostLoading(true);
    const categoryParams = category === "all" ? "" : `&category=${category}`;
    const response = await fetch(
      `https://bodhi-data.deno.dev/assets_by_space_v2?space_addr=${connectedAddress}&page=${page}&limit=10&type=post${categoryParams}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    const data = (await response.json()) as Array<any>;

    const posts = data.map(item => {
      const firstLineOfContent = item.content.split("\n")[0].replace(/#*/g, "").trim(); // Extracting the first line of the content
      return {
        title: firstLineOfContent,
        url: `https://bodhi.wtf/space/5/${item.id_on_chain}`,
        description: `${(item.content as string)?.substring(0, 100)}...`,
        image: `https://picsum.photos/seed/${item.id_on_chain}/200`,
        author: item.author_true,
        category: item.category,
      };
    });
    console.log("fetch posts:", posts);

    setPosts(posts);
    setPostLoading(false);
  };

  useEffect(() => {
    fetchPosts(pageIndex);
  }, [pageIndex, category, connectedAddress]);
  
  return (
    <>
      <div className="w-72 bg-base-300 hidden lg:flex justify-center items-center p-4">
        <div className="w-full h-auto bg-base-200 rounded-box py-3 self-start">
          <span className="py-2 flex justify-center items-center font-bold text-2xl">SECTIONS</span>
          <main>
            <TopicCard />
          </main>
        </div>
      </div>
      <div className="flex-1 bg-base-300 p-4">
        <div className="w-full h-full bg-base-200 rounded-box p-3">
          {postLoading && (
            <div className="flex justify-center items-center">
              Loading<span className="loading loading-dots loading-xs"></span>
            </div>
          )}
          <div className="grid grid-cols-1 gap-2 p-4 md:gap-4 lg:grid-cols-1 xl:grid-cols-3">
            <ReactMarkdown className="markdown-content prose prose-sm sm:prose lg:prose-lg xl:prose-xl max-w-none">
              {markdownContent}
            </ReactMarkdown>
          </div>
          {/* <div className="join flex justify-center items-center">
            <button onClick={onPrevPage} className="join-item btn">
              «
            </button>
            <button className="join-item btn">Page {pageIndex}</button>
            <button onClick={onNextPage} className="join-item btn">
              »
            </button>
          </div> */}
        </div>
      </div>
    </>
  );
};

export const getStaticProps = async () => {
  const filePath = path.join(process.cwd(), 'public', 'assets', 'indiehacker-handbook-cn.md');
  const markdownContent = fs.readFileSync(filePath, 'utf-8');
  
  return {
    props: {
      markdownContent,
    },
  };
};

export default ETHSpace;
