import { useScaffoldContractRead } from "~~/hooks/scaffold-eth";

export const CommentReader = ({ commentId }: { commentId: number }) => {
  const commentIdBigInt = BigInt(commentId);
  const { data, isLoading, error } = useScaffoldContractRead({
    contractName: "OnChainBook",
    functionName: "comments",
    args: [commentIdBigInt],
  });

  return {
    data,
    isLoading,
    error,
  };
};
