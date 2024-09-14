/* eslint-disable react-hooks/exhaustive-deps */
import { useNavigate } from "react-router-dom";
import Navbar from "../shared/Navbar";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import AdminJobsTable from "./AdminJobsTable";
import useGetAllAdminJobs from "@/hooks/useGetAllAdminJob";
import { setSearchJobByText } from "@/redux/jobSlice";

const AdminJobs = () => {
  useGetAllAdminJobs()
  const [input , setInput] = useState("")
  const navigate = useNavigate()
  const dispatch = useDispatch()

  useEffect(() => {
       dispatch(setSearchJobByText(input))
  },[input])
  return (
    <div>
      <Navbar />
      <div className="max-w-6xl mx-auto my-10">
        <div className=" flex items-center justify-between my-5">
          <Input className="w-fit" placeholder="Filter by name , role" onChange={(e) => setInput(e.target.value)} />
          <Button onClick={() => navigate("/admin/jobs/create")}>New Jobs</Button>
        </div>
        <AdminJobsTable/>
      </div>
    </div>
  );
}

export default AdminJobs;
