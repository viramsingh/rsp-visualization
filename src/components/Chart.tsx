import * as echarts from "echarts";
import { useEffect, useRef } from "react";
import type { Row } from "../types";

interface ChartProps {
  data: Row[];
  city: string;
  fuel: string;
  year: string;
}

export default function Chart({ data, city, fuel, year }: ChartProps) {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    let chart =
      echarts.getInstanceByDom(chartRef.current) ||
      echarts.init(chartRef.current);

    // Filter data by city, fuel, and year
    const filteredData = data.filter((row) => {
      const isCityMatch = row["Metro Cities"]?.trim() === city;
      const isFuelMatch =
        (row["Products "] || "").trim().toLowerCase() === fuel.toLowerCase();
      const isYearMatch = row.Year?.includes(year);
      return isCityMatch && isFuelMatch && isYearMatch;
    });

    console.log("Filtered Data:", filteredData);

    // Group prices by month
    const monthlyPrices: Record<string, number[]> = {};
    filteredData.forEach((row) => {
      const month = getMonthCode(row.Month || "");
      const price = parseFloat(
        row[
          "Retail Selling Price (Rsp) Of Petrol And Diesel (UOM:INR/L(IndianRupeesperLitre)), Scaling Factor:1"
        ] || "0"
      );
      if (!monthlyPrices[month]) monthlyPrices[month] = [];
      monthlyPrices[month].push(price);
    });

    // Sort months in calendar order
    const monthOrder = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const months = Object.keys(monthlyPrices).sort(
      (a, b) => monthOrder.indexOf(a) - monthOrder.indexOf(b)
    );

    // Compute monthly average prices
    const averagePrices = months.map(
      (month) =>
        monthlyPrices[month].reduce((sum, price) => sum + price, 0) /
        monthlyPrices[month].length
    );

    // Set chart options
    chart.setOption({
      title: { text: `Monthly Avg RSP - ${fuel} in ${city} (${year})` },
      tooltip: { trigger: "axis" },
      xAxis: { type: "category", data: months },
      yAxis: { type: "value", name: "Price" },
      series: [{ type: "bar", data: averagePrices }],
    });

    // Handle responsive resizing
    const handleResize = () => chart?.resize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      chart?.dispose();
    };
  }, [data, city, fuel, year]);

  return <div ref={chartRef} style={{ width: "100%", height: "400px" }} />;
}

function getMonthCode(month: string): string {
  const name = month.split(",")[0].trim().toLowerCase();
  const monthMap: Record<string, string> = {
    january: "Jan",
    february: "Feb",
    march: "Mar",
    april: "Apr",
    may: "May",
    june: "Jun",
    july: "Jul",
    august: "Aug",
    september: "Sep",
    october: "Oct",
    november: "Nov",
    december: "Dec",
  };
  return monthMap[name] || name;
}
