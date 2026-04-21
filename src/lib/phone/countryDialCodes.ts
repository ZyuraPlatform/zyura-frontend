export type CountryDialCode = {
  iso2: string;
  dialCode: string;
  name: string;
};

// Curated list (extend as needed).
export const countryDialCodes: CountryDialCode[] = [
  { iso2: "BH", dialCode: "+973", name: "Bahrain" },
  { iso2: "IN", dialCode: "+91", name: "India" },
  { iso2: "US", dialCode: "+1", name: "United States" },
  { iso2: "AE", dialCode: "+971", name: "United Arab Emirates" },
  { iso2: "GB", dialCode: "+44", name: "United Kingdom" },
];

