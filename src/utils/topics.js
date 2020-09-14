const topics = [
  { value: "youtube", label: "Youtube Trending Data" },
  // {value: 'olympicsBySports', label: 'Olympics by Sports'},
  // {value: 'olympicsByCountries', label: 'Olympics By Countries'}
];
const youtube = [
  { value: "Gaming", label: "Gaming" },
  { value: "Howto & Style", label: "Howto & Style" },
  { value: "News & Politics", label: "News & Politics" },
  { value: "Pets & Animals", label: "Pets & Animals" },
  { value: "Music", label: "Music" },
  { value: "People & Blogs", label: "People & Blogs" },
  { value: "Science & Technology", label: "Science & Technology" },
  { value: "Sports", label: "Sports" },
];

const olympicsBySports = [
  { value: "Equestrianism", label: "Equestrianism" },
  { value: "Diving", label: "Diving" },
  { value: "Boxing", label: "Boxing" },
  { value: "Football", label: "Football" },
  { value: "Water Polo", label: "Water Polo" },
  { value: "Athletics", label: "Athletics" },
  { value: "Sailing", label: "Sailing" },
  { value: "Wrestling", label: "Wrestling" },
  { value: "Rowing", label: "Rowing" },
  { value: "Swimming", label: "Swimming" },
  { value: "Cycling", label: "Cycling" },
  { value: "Shooting", label: "Shooting" },
  { value: "Weightlifting", label: "Weightlifting" },
];

const olympicsByCountries = [
  { value: "Italy", label: "Italy" },
  { value: "United States", label: "United States" },
  { value: "Denmark", label: "Denmark" },
  { value: "France", label: "France" },
  { value: "Great Britain", label: "Great Britain" },
  { value: "Hungary", label: "Hungary" },
  { value: "Netherlands", label: "Netherlands" },
  { value: "Switzerland", label: "Switzerland" },
  { value: "Argentina", label: "Argentina" },
  { value: "Austria", label: "Austria" },
];

export default {
  topics,
  topicOptions: {
    youtube,
    olympicsBySports,
    olympicsByCountries,
  },
};
