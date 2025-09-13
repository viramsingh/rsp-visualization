import { useEffect, useState } from "react";
import "@mantine/core/styles.css";
import { MantineProvider, Container, Title } from "@mantine/core";
import { theme } from "./theme";
import Filters from "./components/Filters";
import Chart from "./components/Chart";
import { loadCSVFromUrl } from "./utils/csvLoader";
import type { Row } from "./types";

export default function App() {
  const [rows, setRows] = useState<Row[]>([]);
  const [city, setCity] = useState("");
  const [fuel, setFuel] = useState("");
  const [year, setYear] = useState("");

  const CSV_URL = "/data/fuel_prices.csv";

  useEffect(() => {
    loadCSVFromUrl(CSV_URL).then(setRows);
  }, []);

  // Dropdown options
  const cities = Array.from(new Set(rows.map((r) => r["Metro Cities"]))).filter(
    Boolean
  );
  const fuels = ["Petrol", "Diesel"];
  const years = Array.from(new Set(rows.map((r) => r.Year))).filter(Boolean);

  useEffect(() => {
    if (cities.length && !cities.includes(city)) setCity(cities[0]);
    if (fuels.length && !fuels.includes(fuel)) setFuel(fuels[0]);
    if (years.length && !years.includes(year)) setYear(years[8]);
  }, [cities, fuels, years]);

  return (
    <MantineProvider theme={theme}>
      <Container>
        <Title order={2} mb="md">
          Fuel Price Visualization
        </Title>

        {rows.length > 0 && (
          <Filters
            cities={cities}
            fuels={fuels}
            years={years}
            selectedCity={city}
            selectedFuel={fuel}
            selectedYear={year}
            onCityChange={setCity}
            onFuelChange={setFuel}
            onYearChange={setYear}
          />
        )}

        {rows.length > 0 && city && (
          <Chart data={rows} city={city} fuel={fuel} year={year} />
        )}
      </Container>
    </MantineProvider>
  );
}
