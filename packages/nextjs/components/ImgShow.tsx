import { useState, useEffect } from "react";
import Link from "next/link";
import { FaHeart, FaRegHeart } from "react-icons/fa";

import { useScaffoldContractWrite, useScaffoldContractRead } from "~~/hooks/scaffold-eth";
import { parseEther } from "viem";


// Update the component to accept props
export function ImgShow({ images }) {
  return (
    <>
      <main className="grid grid-cols-3 gap-2 p-4 md:gap-4 lg:grid-cols-4 xl:grid-cols-5">
        {images.map((img, index) => (
          <ImageShowItem key={index} img={img} />
        ))}
      </main>
    </>
  );
}

const ImageShowItem = ({ img }) => {
  const [likes, setLikes] = useState(0);
  // <!-- smart contract things 
  const { writeAsync, isLoading } = useScaffoldContractWrite({
    contractName: "AssetTagger",
    functionName: "tagItem",
    args: [BigInt(img.id), JSON.stringify({ like: likes + 1 })],
    value: parseEther("0"),
    onBlockConfirmation: txnReceipt => {
      console.log("📦 Transaction blockHash", txnReceipt.blockHash);
    },
  });


const useTagsIndexByAsset = (assetId) => {
  // Convert assetId to BigInt for the blockchain function call
  const assetIdAsBigInt = BigInt(assetId);
  
  const { data, isLoading, error } = useScaffoldContractRead({
    contractName: "AssetTagger",
    functionName: "tagsIndexByAsset",
    args: [assetIdAsBigInt],
  });

  
  useEffect(() => {
    if (data) {
      console.log(data); // Log the raw data for debugging
      try {
        // Assuming data[1] should contain the metadata as a JSON string
        if (data[1]) {
          const metadata = JSON.parse(data[1]);
          if (metadata && typeof metadata.like === 'number') {
            setLikes(metadata.like); // Set the likes if the correct data is found
          }
        }
      } catch (error) {
        console.error("Error parsing metadata JSON:", error);
        setLikes(0); // Reset likes to 0 if parsing fails
      }
    }
  }, [data]);

  return {
    likes,
    isLoading,
    error,
  };
};

  // Smart contract read operation to fetch asset tags
  const { data: tagsData, isLoading: isReading, error } = useTagsIndexByAsset(img.id);
  // -->
  const [isLiked, setIsLiked] = useState(false);
  const toggleLike = () => {
    setIsLiked(!isLiked);
    if (!isLiked) { // Conditionally fire `writeAsync` when the item is liked
      writeAsync();
    }
  };
  return (
    <div className="relative group overflow-hidden rounded-md">
      <div className="w-full h-[calc(100%-2rem)]">
        <Link
          className="absolute top w-full h-[calc(100%-2rem)] inset-0 z-10"
          href={img.link}
          target="_blank" // Opens the link in a new tab
          rel="noopener noreferrer" // Security measure for opening links in a new tab
        >
          <span className="sr-only">View</span>
        </Link>
        <img
          alt={`Image`}
          className="aspect-square object-cover w-full h-full"
          height={400}
          src={img.image}
          width={400}
        />
      </div>

      <div className="px-2 h-8 w-full bg-sky-500 flex justify-between items-center">
        <div className="space-x-2">
          <div className="badge badge-outline">{img.category}</div>
        </div>
        <div className="flex items-center">
          <button onClick={toggleLike} className="flex items-center justify-center">
            {isLiked ? <FaHeart className="text-red-500" /> : <FaRegHeart />}
          </button>
          <span className="ml-2 text-sm">{likes}</span> {/* Reduced margin and adjusted text size */}
        </div>
      </div>
    </div>
  );
};
