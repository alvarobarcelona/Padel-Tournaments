// Utility to shuffle array
export const shuffle = (array) => {
    let currentIndex = array.length, randomIndex;
    while (currentIndex != 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }
    return array;
}

// Generate Americano Round
// Tries to pair players who haven't played together much
export const generateAmericanoRound = (players, matchHistory = []) => {
    // players: { id, name }[]
    // matchHistory: { round, matches: { team1: [id, id], team2: [id, id] }[] }[]

    // Clone and shuffle to add randomness
    let available = shuffle([...players]);
    const matches = [];

    // Simple greedy pairing for MVP
    // In a full implementation, we would use a graph weight algorithm to minimize repeats

    let courtIndex = 0;
    const courtCount = Math.floor(players.length / 4);

    while (available.length >= 4) {
        const p1 = available.pop();
        const p2 = available.pop();
        const p3 = available.pop();
        const p4 = available.pop();

        matches.push({
            id: crypto.randomUUID(),
            court: (courtIndex % courtCount) + 1,
            team1: [p1, p2],
            team2: [p3, p4],
            score1: 0,
            score2: 0,
            completed: false
        });
        courtIndex++;
    }

    // Handle leftovers (bye) - For MVP we assume multiple of 4 or handle in UI
    return matches;
};

// Generate Mexicano Round
// Based on current ranking
export const generateMexicanoRound = (players) => {
    // Sort players by score (descending)
    const sorted = [...players].sort((a, b) => b.score - a.score);

    const matches = [];
    const courtCount = Math.floor(sorted.length / 4);

    for (let i = 0; i < courtCount; i++) {
        // Get 4 players for this court
        const group = sorted.slice(i * 4, (i * 4) + 4);

        // Standard Mexicano: 1&4 vs 2&3 (Balanced)
        // group[0] is #1 (Best in this group)
        // group[3] is #4 (Worst in this group)

        matches.push({
            id: crypto.randomUUID(),
            court: i + 1,
            team1: [group[0], group[3]],
            team2: [group[1], group[2]],
            score1: 0,
            score2: 0,
            completed: false
        });
    }

    return matches;
};
