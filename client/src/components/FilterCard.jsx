/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { useDispatch } from "react-redux";
import { setSearchedQuery } from "@/redux/jobSlice";

const filterData = [
  {
    fitlerType: "Location",
    array: ["Delhi",  "hyderabad", "Pune", "Mumbai"],
  },
  {
    fitlerType: "Industry",
    array: ["App Devloper", "Backend Developer", "FullStack Developer","Data Science" , "BlockChain"],
  },
  {
    fitlerType: "Salary",
    array: ["15-20lakh", "20-25lakh", "1lakh to 5lakh"],
  },
];
const FilterCard = () => {
  const [selectedValue , setSelectedValue] = useState('');
  const dispatch = useDispatch();
  
  const changeHandler = (value) => {
      setSelectedValue(value)
  }
  
  useEffect(() => {
     dispatch(setSearchedQuery(selectedValue))
  },[selectedValue])
  return (
    <div className="w-full bg-white p-3 rounded-md">
      <h1 className="font-bold text-lg">Filter Jobs</h1>
      <hr className="mt-3" />
      <RadioGroup value={selectedValue} onValueChange={changeHandler}>
        {filterData.map((data, index) => (
          <div key={index}>
            <h1 className="text-lg font-bold">{data.fitlerType}</h1>
            {data.array.map((item, idx) => {
              const itemId = `id${index}-${idx}`
              return (
                <div key={idx} className="flex items-center space-x-2 my-3">
                  <RadioGroupItem value={item} id={itemId}/>
                  <label htmlFor={itemId}>{item}</label>
                </div>
              );
            })}
          </div>
        ))}
      </RadioGroup>
    </div>
  );
};

export default FilterCard;
