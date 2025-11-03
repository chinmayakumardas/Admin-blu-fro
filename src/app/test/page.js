"use client";

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTasksByDeadline } from "@/features/dashboard/dashboardSlice";

const DeadlineTaskLogger = () => {
  const dispatch = useDispatch();

  // Access deadlineTasks state
  const { data, status, error } = useSelector(
    (state) => state.dashboard.deadlineTasks
  );

  // Dispatch fetch on mount
  useEffect(() => {
    dispatch(fetchTasksByDeadline());
  }, [dispatch]);

  // Log whenever data updates
  useEffect(() => {
    if (status === "succeeded") {
      console.log("✅ Deadline tasks fetched:", data);
    } else if (status === "failed") {
      console.error("❌ Fetch failed:", error);
    } else if (status === "loading") {
      console.log("⏳ Fetching deadline tasks...");
    }
  }, [status, data, error]);
console.log(data);

  return (
    <div className="p-5 text-gray-700">
      <h2 className="text-lg font-semibold mb-2">Deadline Task Logger</h2>
     
    </div>
  );
};

export default DeadlineTaskLogger;
