import React from "react";
import { Card } from "components/common";
import { IconLike, IconDislike, IconComment, IconEye } from "icons";

function Details({ data }) {
  return (
    <div className="w-full h-full flex flex-col items-center p-2">
      <div className="mb-4">
        <h2 className="text-white text-base md:text-lg font-semibold tracking-wide">
          {data.text}
        </h2>
      </div>
      <div className="flex-1 flex items-center">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <Card color="green" icon={IconEye} data={`${data.views} Views`} />
          <Card color="blue" icon={IconLike} data={`${data.likes} Likes`} />
          <Card
            color="red"
            icon={IconDislike}
            data={`${data.dislikes} Dislikes`}
          />
          <Card
            color="gray"
            icon={IconComment}
            data={`${data.comment_count} Comments`}
          />
        </div>
      </div>
    </div>
  );
}

export default Details;
