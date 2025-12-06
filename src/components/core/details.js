import React from "react";
import { SecondaryHeading, Card } from "components/common";
import { IconLike, IconDislike, IconComment } from "icons";

function Details({ data }) {
  return (
    <div className="w-full h-full flex flex-col justify-center items-center p-4">
      <div className="mb-4">
        <SecondaryHeading>{data.text}</SecondaryHeading>
      </div>
      <div className="flex flex-wrap justify-center items-center">
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
  );
}

export default Details;
