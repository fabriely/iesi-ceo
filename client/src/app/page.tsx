"use client";

import { useState, useEffect } from "react";

type FilterType = "monthly-procedures" | "patient-demographics" | "procedure-types";

interface DashboardData {
  totalProcedures?: number;
  averageAge?: number;
  procedure?: string;
  count?: number;
  months?: number;
}

export default function Home() {
  const [activeFilter, setActiveFilter] = useState<FilterType>("monthly-procedures");
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchData = async (filter: FilterType) => {
    setLoading(true);
    try {
      let url = "";
      let options: RequestInit = { method: "GET" };

      switch (filter) {
        case "monthly-procedures":
          url = "/api/filters/procedures/count-this-month";
          break;
        case "patient-demographics":
          url = "/api/filters/patients/average-age-this-month";
          break;
        case "procedure-types":
          url = "/api/filters/procedures/count-by-type";
          options = {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ type: "RADIOGRAFIA_PERIAPICAL", months: "3" })
          };
          break;
      }

      const response = await fetch(url, options);
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(activeFilter);
  }, [activeFilter]);

  const renderChart = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-64 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div className="text-lg text-gray-600 dark:text-gray-300">Loading...</div>
        </div>
      );
    }

    if (!data) {
      return (
        <div className="flex items-center justify-center h-64 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div className="text-lg text-gray-600 dark:text-gray-300">No data available</div>
        </div>
      );
    }

    switch (activeFilter) {
      case "monthly-procedures":
        return (
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800 rounded-lg p-8 text-center">
            <h3 className="text-2xl font-semibold text-blue-900 dark:text-blue-100 mb-4">
              Procedures This Month
            </h3>
            <div className="text-6xl font-bold text-blue-700 dark:text-blue-200">
              {data.totalProcedures || 0}
            </div>
            <p className="text-blue-600 dark:text-blue-300 mt-2">Total procedures performed</p>
          </div>
        );

      case "patient-demographics":
        return (
          <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900 dark:to-green-800 rounded-lg p-8 text-center">
            <h3 className="text-2xl font-semibold text-green-900 dark:text-green-100 mb-4">
              Average Patient Age
            </h3>
            <div className="text-6xl font-bold text-green-700 dark:text-green-200">
              {data.averageAge ? Math.round(data.averageAge) : 0}
            </div>
            <p className="text-green-600 dark:text-green-300 mt-2">Years old (this month)</p>
          </div>
        );

      case "procedure-types":
        return (
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900 dark:to-purple-800 rounded-lg p-8 text-center">
            <h3 className="text-2xl font-semibold text-purple-900 dark:text-purple-100 mb-4">
              Procedure Type Analysis
            </h3>
            <div className="text-6xl font-bold text-purple-700 dark:text-purple-200">
              {data.count || 0}
            </div>
            <p className="text-purple-600 dark:text-purple-300 mt-2">
              {data.procedure} procedures (last {data.months} months)
            </p>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            CEO Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Healthcare Analytics & Insights
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <button
            onClick={() => setActiveFilter("monthly-procedures")}
            className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
              activeFilter === "monthly-procedures"
                ? "bg-blue-600 text-white shadow-lg"
                : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-600"
            }`}
          >
            Monthly Procedures
          </button>
          <button
            onClick={() => setActiveFilter("patient-demographics")}
            className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
              activeFilter === "patient-demographics"
                ? "bg-green-600 text-white shadow-lg"
                : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-600"
            }`}
          >
            Patient Demographics
          </button>
          <button
            onClick={() => setActiveFilter("procedure-types")}
            className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
              activeFilter === "procedure-types"
                ? "bg-purple-600 text-white shadow-lg"
                : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-600"
            }`}
          >
            Procedure Types
          </button>
        </div>

        {/* Chart Area */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          {renderChart()}
        </div>
      </div>
    </div>
  );
}
