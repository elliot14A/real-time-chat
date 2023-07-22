import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const loading = (props: {}) => {
  return (
    <div className="w-full mt-10 container flex flex-col gap-3">
      <Skeleton className="mb-4" height={60} width={400} />
      <Skeleton height={50} width={350} />
      <Skeleton height={50} width={350} />
      <Skeleton height={50} width={350} />
    </div>
  );
};

export default loading;
