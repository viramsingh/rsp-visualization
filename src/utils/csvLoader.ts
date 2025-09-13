import Papa from "papaparse";
import type { Row } from "../types";

export async function loadCSVFromUrl(url: string): Promise<Row[]> {
  return new Promise((resolve, reject) => {
    Papa.parse<Row>(url, {
      download: true,
      header: true,
      skipEmptyLines: true,
      complete: (result) => {
        const cleanedData = result.data.map((row) => ({
          ...row,
          "Retail Selling Price (Rsp) Of Petrol And Diesel (UOM:INR/L(IndianRupeesperLitre)), Scaling Factor:1":
            row[
              "Retail Selling Price (Rsp) Of Petrol And Diesel (UOM:INR/L(IndianRupeesperLitre)), Scaling Factor:1"
            ]?.trim() || "0",
        }));

        resolve(cleanedData);
      },
      error: (err) => reject(err),
    });
  });
}
