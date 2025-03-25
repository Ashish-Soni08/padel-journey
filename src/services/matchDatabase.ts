
// Type definitions for match data
export interface MatchData {
  id: string;
  date: Date;
  matchType: "training" | "competitive";
  matchFormat: "1v1" | "2v2";
  player1: string;
  player2?: string;
  player3?: string;
  result?: "win" | "loss" | "training";
  duration: string;
  venue: string;
  notes?: string;
}

// Initial data
const initialMatches: MatchData[] = [
  { 
    id: "1",
    date: new Date("2025-03-24"),
    matchType: "training",
    matchFormat: "2v2",
    player1: "Rishi",
    player2: "Nik",
    player3: "Alberto",
    result: "training",
    duration: "60",
    venue: "PadelCity Leipzig",
    notes: "New training session with different partners"
  },
  { 
    id: "2",
    date: new Date("2025-03-15"),
    matchType: "training",
    matchFormat: "2v2",
    player1: "Johanna",
    player2: "Anoosha",
    player3: "Renna",
    result: "training",
    duration: "60",
    venue: "PadelCity Leipzig",
    notes: "Good session focusing on backhand shots"
  },
  { 
    id: "3",
    date: new Date("2025-03-13"),
    matchType: "training",
    matchFormat: "2v2",
    player1: "Jannes",
    player2: "Carolin",
    player3: "Jonathan",
    result: "training",
    duration: "90",
    venue: "PadelCity Leipzig",
    notes: "Worked on serves and returns"
  },
  { 
    id: "4",
    date: new Date("2025-03-09"),
    matchType: "training",
    matchFormat: "2v2",
    player1: "Kerstin",
    player2: "Annie",
    player3: "Bella",
    result: "training",
    duration: "75",
    venue: "Sportpark Augustusweg",
    notes: "Focused on positioning and strategy"
  },
  { 
    id: "5",
    date: new Date("2025-02-17"),
    matchType: "training",
    matchFormat: "2v2",
    player1: "Stephan",
    player2: "John",
    player3: "Christian",
    result: "training",
    duration: "60",
    venue: "Sportpark Augustusweg",
    notes: "Practice match with new partners"
  },
  { 
    id: "6",
    date: new Date("2024-11-26"),
    matchType: "training",
    matchFormat: "1v1",
    player1: "Manoj",
    result: "training",
    duration: "60",
    venue: "PadelCity Leipzig",
    notes: "Individual technique session"
  }
];

// Key for localStorage
const STORAGE_KEY = 'padel_matches';

// Initialize database if it doesn't exist
const initializeDatabase = (): void => {
  if (!localStorage.getItem(STORAGE_KEY)) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialMatches));
  }
};

// Get all matches
export const getAllMatches = (): MatchData[] => {
  initializeDatabase();
  const data = localStorage.getItem(STORAGE_KEY);
  
  if (!data) return [];
  
  try {
    // Parse the JSON and convert date strings back to Date objects
    return JSON.parse(data, (key, value) => {
      // Check if the key is 'date' and the value is a string
      if (key === 'date' && typeof value === 'string') {
        return new Date(value);
      }
      return value;
    });
  } catch (error) {
    console.error('Error parsing match data:', error);
    return [];
  }
};

// Add a new match
export const addMatch = (match: Omit<MatchData, 'id'>): MatchData => {
  const matches = getAllMatches();
  
  // Create a new match with a generated ID
  const newMatch: MatchData = {
    ...match,
    id: Date.now().toString() // Simple ID generation
  };
  
  // Add to array and save back to localStorage
  matches.unshift(newMatch); // Add to beginning of array
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(matches));
  
  return newMatch;
};

// Get match stats
export const getMatchStats = () => {
  const matches = getAllMatches();
  
  // Total matches
  const totalMatches = matches.length;
  
  // Total duration in minutes
  const totalDuration = matches.reduce((total, match) => {
    const minutes = parseInt(match.duration.replace(/[^0-9]/g, ''));
    return isNaN(minutes) ? total : total + minutes;
  }, 0);
  
  // Matches by result
  const resultCounts = {
    win: matches.filter(match => match.result === 'win').length,
    loss: matches.filter(match => match.result === 'loss').length,
    training: matches.filter(match => match.result === 'training').length
  };
  
  // Matches by month (for current year)
  const currentYear = new Date().getFullYear();
  const monthlyMatches = Array(12).fill(0);
  
  matches.forEach(match => {
    if (match.date.getFullYear() === currentYear) {
      const month = match.date.getMonth();
      monthlyMatches[month]++;
    }
  });
  
  return {
    totalMatches,
    totalDuration,
    resultCounts,
    monthlyMatches
  };
};

// Reset the database to initial state (for testing)
export const resetDatabase = (): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(initialMatches));
};
