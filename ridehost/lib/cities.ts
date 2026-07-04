export interface City {
  id: string;
  name: string;
  state: string;
}

export const INDIA_CITIES: City[] = [
  // Andhra Pradesh
  { id: "visakhapatnam", name: "Visakhapatnam", state: "Andhra Pradesh" },
  { id: "vijayawada", name: "Vijayawada", state: "Andhra Pradesh" },
  { id: "tirupati", name: "Tirupati", state: "Andhra Pradesh" },
  { id: "guntur", name: "Guntur", state: "Andhra Pradesh" },
  { id: "nellore", name: "Nellore", state: "Andhra Pradesh" },
  { id: "kakinada", name: "Kakinada", state: "Andhra Pradesh" },
  // Arunachal Pradesh
  { id: "itanagar", name: "Itanagar", state: "Arunachal Pradesh" },
  // Assam
  { id: "guwahati", name: "Guwahati", state: "Assam" },
  { id: "dibrugarh", name: "Dibrugarh", state: "Assam" },
  { id: "jorhat", name: "Jorhat", state: "Assam" },
  // Bihar
  { id: "patna", name: "Patna", state: "Bihar" },
  { id: "gaya", name: "Gaya", state: "Bihar" },
  { id: "muzaffarpur", name: "Muzaffarpur", state: "Bihar" },
  { id: "bhagalpur", name: "Bhagalpur", state: "Bihar" },
  // Chhattisgarh
  { id: "raipur", name: "Raipur", state: "Chhattisgarh" },
  { id: "bilaspur-cg", name: "Bilaspur", state: "Chhattisgarh" },
  { id: "durg", name: "Durg", state: "Chhattisgarh" },
  // Goa
  { id: "panaji", name: "Panaji", state: "Goa" },
  { id: "margao", name: "Margao", state: "Goa" },
  { id: "vasco", name: "Vasco da Gama", state: "Goa" },
  // Gujarat
  { id: "ahmedabad", name: "Ahmedabad", state: "Gujarat" },
  { id: "surat", name: "Surat", state: "Gujarat" },
  { id: "vadodara", name: "Vadodara", state: "Gujarat" },
  { id: "rajkot", name: "Rajkot", state: "Gujarat" },
  { id: "bhavnagar", name: "Bhavnagar", state: "Gujarat" },
  { id: "gandhinagar", name: "Gandhinagar", state: "Gujarat" },
  { id: "jamnagar", name: "Jamnagar", state: "Gujarat" },
  // Haryana
  { id: "gurgaon", name: "Gurgaon", state: "Haryana" },
  { id: "faridabad", name: "Faridabad", state: "Haryana" },
  { id: "chandigarh-hr", name: "Chandigarh", state: "Haryana" },
  { id: "ambala", name: "Ambala", state: "Haryana" },
  { id: "panipat", name: "Panipat", state: "Haryana" },
  { id: "karnal", name: "Karnal", state: "Haryana" },
  // Himachal Pradesh
  { id: "shimla", name: "Shimla", state: "Himachal Pradesh" },
  { id: "manali", name: "Manali", state: "Himachal Pradesh" },
  { id: "dharamshala", name: "Dharamshala", state: "Himachal Pradesh" },
  { id: "kullu", name: "Kullu", state: "Himachal Pradesh" },
  // Jharkhand
  { id: "ranchi", name: "Ranchi", state: "Jharkhand" },
  { id: "jamshedpur", name: "Jamshedpur", state: "Jharkhand" },
  { id: "dhanbad", name: "Dhanbad", state: "Jharkhand" },
  // Karnataka
  { id: "bangalore", name: "Bangalore", state: "Karnataka" },
  { id: "mysore", name: "Mysore", state: "Karnataka" },
  { id: "mangalore", name: "Mangalore", state: "Karnataka" },
  { id: "hubli", name: "Hubli", state: "Karnataka" },
  { id: "belgaum", name: "Belgaum", state: "Karnataka" },
  { id: "coorg", name: "Coorg", state: "Karnataka" },
  { id: "hassan", name: "Hassan", state: "Karnataka" },
  // Kerala
  { id: "thiruvananthapuram", name: "Thiruvananthapuram", state: "Kerala" },
  { id: "kochi", name: "Kochi", state: "Kerala" },
  { id: "kozhikode", name: "Kozhikode", state: "Kerala" },
  { id: "thrissur", name: "Thrissur", state: "Kerala" },
  { id: "alappuzha", name: "Alappuzha", state: "Kerala" },
  { id: "munnar", name: "Munnar", state: "Kerala" },
  // Madhya Pradesh
  { id: "bhopal", name: "Bhopal", state: "Madhya Pradesh" },
  { id: "indore", name: "Indore", state: "Madhya Pradesh" },
  { id: "gwalior", name: "Gwalior", state: "Madhya Pradesh" },
  { id: "jabalpur", name: "Jabalpur", state: "Madhya Pradesh" },
  { id: "ujjain", name: "Ujjain", state: "Madhya Pradesh" },
  // Maharashtra
  { id: "mumbai", name: "Mumbai", state: "Maharashtra" },
  { id: "pune", name: "Pune", state: "Maharashtra" },
  { id: "nagpur", name: "Nagpur", state: "Maharashtra" },
  { id: "nashik", name: "Nashik", state: "Maharashtra" },
  { id: "aurangabad", name: "Aurangabad", state: "Maharashtra" },
  { id: "kolhapur", name: "Kolhapur", state: "Maharashtra" },
  { id: "solapur", name: "Solapur", state: "Maharashtra" },
  { id: "thane", name: "Thane", state: "Maharashtra" },
  { id: "lonavala", name: "Lonavala", state: "Maharashtra" },
  { id: "mahabaleshwar", name: "Mahabaleshwar", state: "Maharashtra" },
  // Manipur
  { id: "imphal", name: "Imphal", state: "Manipur" },
  // Meghalaya
  { id: "shillong", name: "Shillong", state: "Meghalaya" },
  // Mizoram
  { id: "aizawl", name: "Aizawl", state: "Mizoram" },
  // Nagaland
  { id: "kohima", name: "Kohima", state: "Nagaland" },
  // Odisha
  { id: "bhubaneswar", name: "Bhubaneswar", state: "Odisha" },
  { id: "cuttack", name: "Cuttack", state: "Odisha" },
  { id: "puri", name: "Puri", state: "Odisha" },
  { id: "rourkela", name: "Rourkela", state: "Odisha" },
  // Punjab
  { id: "amritsar", name: "Amritsar", state: "Punjab" },
  { id: "ludhiana", name: "Ludhiana", state: "Punjab" },
  { id: "jalandhar", name: "Jalandhar", state: "Punjab" },
  { id: "patiala", name: "Patiala", state: "Punjab" },
  { id: "mohali", name: "Mohali", state: "Punjab" },
  // Rajasthan
  { id: "jaipur", name: "Jaipur", state: "Rajasthan" },
  { id: "jodhpur", name: "Jodhpur", state: "Rajasthan" },
  { id: "udaipur", name: "Udaipur", state: "Rajasthan" },
  { id: "ajmer", name: "Ajmer", state: "Rajasthan" },
  { id: "kota", name: "Kota", state: "Rajasthan" },
  { id: "bikaner", name: "Bikaner", state: "Rajasthan" },
  { id: "jaisalmer", name: "Jaisalmer", state: "Rajasthan" },
  { id: "pushkar", name: "Pushkar", state: "Rajasthan" },
  // Sikkim
  { id: "gangtok", name: "Gangtok", state: "Sikkim" },
  // Tamil Nadu
  { id: "chennai", name: "Chennai", state: "Tamil Nadu" },
  { id: "coimbatore", name: "Coimbatore", state: "Tamil Nadu" },
  { id: "madurai", name: "Madurai", state: "Tamil Nadu" },
  { id: "tiruchirappalli", name: "Tiruchirappalli", state: "Tamil Nadu" },
  { id: "salem", name: "Salem", state: "Tamil Nadu" },
  { id: "tirunelveli", name: "Tirunelveli", state: "Tamil Nadu" },
  { id: "ooty", name: "Ooty", state: "Tamil Nadu" },
  { id: "vellore", name: "Vellore", state: "Tamil Nadu" },
  // Telangana
  { id: "hyderabad", name: "Hyderabad", state: "Telangana" },
  { id: "warangal", name: "Warangal", state: "Telangana" },
  { id: "nizamabad", name: "Nizamabad", state: "Telangana" },
  // Tripura
  { id: "agartala", name: "Agartala", state: "Tripura" },
  // Uttar Pradesh
  { id: "lucknow", name: "Lucknow", state: "Uttar Pradesh" },
  { id: "kanpur", name: "Kanpur", state: "Uttar Pradesh" },
  { id: "agra", name: "Agra", state: "Uttar Pradesh" },
  { id: "varanasi", name: "Varanasi", state: "Uttar Pradesh" },
  { id: "allahabad", name: "Prayagraj", state: "Uttar Pradesh" },
  { id: "meerut", name: "Meerut", state: "Uttar Pradesh" },
  { id: "mathura", name: "Mathura", state: "Uttar Pradesh" },
  { id: "noida", name: "Noida", state: "Uttar Pradesh" },
  { id: "ghaziabad", name: "Ghaziabad", state: "Uttar Pradesh" },
  { id: "bareilly", name: "Bareilly", state: "Uttar Pradesh" },
  // Uttarakhand
  { id: "dehradun", name: "Dehradun", state: "Uttarakhand" },
  { id: "haridwar", name: "Haridwar", state: "Uttarakhand" },
  { id: "rishikesh", name: "Rishikesh", state: "Uttarakhand" },
  { id: "nainital", name: "Nainital", state: "Uttarakhand" },
  { id: "mussoorie", name: "Mussoorie", state: "Uttarakhand" },
  // West Bengal
  { id: "kolkata", name: "Kolkata", state: "West Bengal" },
  { id: "howrah", name: "Howrah", state: "West Bengal" },
  { id: "durgapur", name: "Durgapur", state: "West Bengal" },
  { id: "siliguri", name: "Siliguri", state: "West Bengal" },
  { id: "darjeeling", name: "Darjeeling", state: "West Bengal" },
  // Union Territories
  { id: "new-delhi", name: "New Delhi", state: "Delhi" },
  { id: "delhi-ncr", name: "Delhi NCR", state: "Delhi" },
  { id: "dwarka-delhi", name: "Dwarka", state: "Delhi" },
  { id: "port-blair", name: "Port Blair", state: "Andaman & Nicobar" },
  { id: "chandigarh-ut", name: "Chandigarh", state: "Chandigarh" },
  { id: "silvassa", name: "Silvassa", state: "Dadra & Nagar Haveli" },
  { id: "daman", name: "Daman", state: "Daman & Diu" },
  { id: "kavaratti", name: "Kavaratti", state: "Lakshadweep" },
  { id: "pondicherry", name: "Pondicherry", state: "Puducherry" },
  { id: "jammu", name: "Jammu", state: "Jammu & Kashmir" },
  { id: "srinagar", name: "Srinagar", state: "Jammu & Kashmir" },
  { id: "leh", name: "Leh", state: "Ladakh" },
  { id: "kargil", name: "Kargil", state: "Ladakh" },
];

export const CITIES_BY_STATE = INDIA_CITIES.reduce<Record<string, City[]>>((acc, city) => {
  if (!acc[city.state]) acc[city.state] = [];
  acc[city.state].push(city);
  return acc;
}, {});
