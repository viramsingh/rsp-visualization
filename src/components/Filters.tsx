import { Select, Group } from "@mantine/core";

interface FiltersProps {
  cities: string[];
  fuels: string[];
  years: string[];
  selectedCity: string;
  selectedFuel: string;
  selectedYear: string;
  onCityChange: (value: string) => void;
  onFuelChange: (value: string) => void;
  onYearChange: (value: string) => void;
}

export default function Filters({
  cities,
  fuels,
  years,
  selectedCity,
  selectedFuel,
  selectedYear,
  onCityChange,
  onFuelChange,
  onYearChange,
}: FiltersProps) {
  return (
    <Group grow>
      <Select
        label="Metro City"
        placeholder="Select city"
        data={cities}
        value={selectedCity}
        onChange={(value) => onCityChange(value || "")}
      />

      <Select
        label="Fuel Type"
        placeholder="Select fuel"
        data={fuels}
        value={selectedFuel}
        onChange={(value) => onFuelChange(value || "")}
      />

      <Select
        label="Year"
        placeholder="Select year"
        data={years}
        value={selectedYear}
        onChange={(value) => onYearChange(value || "")}
      />
    </Group>
  );
}
