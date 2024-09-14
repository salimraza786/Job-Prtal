/* eslint-disable react/prop-types */
import { Bookmark } from "lucide-react";
import { Button } from "./ui/button";
import { Avatar, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { useNavigate } from "react-router-dom";

const Job = ({job}) => {
  const navigate = useNavigate()
  // const jobId = "abcdef"
  const daysAgoFunction = (mongodbTime) => {
    const createdAt = new Date(mongodbTime);
    const currentTime = new Date();
    const timeDiffrence = currentTime - createdAt;
    return Math.floor(timeDiffrence/ (1000*24*60*60));
  }
  return (
    <div className="p-5 rounded-md shadow-xl border-gray-100 bg-white">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">{daysAgoFunction(job?.createdAt) === 0 ? "Today" : `${daysAgoFunction(job?.createdAt)} days ago`}</p>
        <Button variant="outline" className="rounded-full" size="icon">
          <Bookmark></Bookmark>
        </Button>
      </div>

      <div className="flex items-center gap-2 my-2">
        <Button className="p-6" variant="outline" size="icon">
          <Avatar>
            <AvatarImage src={job?.company?.logo}></AvatarImage>
          </Avatar>
        </Button>
        <div>
          <h1 className="font-md text-lg">{job?.company?.name}</h1>
          <p className="text-sm text-gray-600">India</p>
        </div>
      </div>
      <div>
        <h1 className="font-bold text-lg my-2">{job?.title}</h1>
        <p className="text-sm text-gray-700">{job?.description}</p>
      </div>
      <div className="flex items-center gap-2 mt-4">
        <Badge className={"text-blue-700 font bold"} variant="ghost">{job?.position} Positions</Badge>
        <Badge className={"text-[#F83002] font bold"} variant="ghost">{job?.jobType}</Badge>
        <Badge className={"text-[#7209b7] font bold"} variant="ghost">{job?.salary}LPA</Badge>
      </div>
      <div className="flex items-center gap-4 mt-4 ">
        <Button onClick={() => navigate(`/description/${job?._id}`)} variant="outline">Details</Button>
        <Button className="bg-[#3306c6]">Save for Later</Button>
      </div>
    </div>
  );
};

export default Job;
