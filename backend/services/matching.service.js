import pool from '../config/db.js';

export const calculateMatchScore = (user1, user2) => {
    let score = 0;
    let overlapSubjects = 0;
    if (user1.subjects && user2.subjects) {
      user1.subjects.forEach(sub => {
         if (user2.subjects.includes(sub)) overlapSubjects++;
      });
      score += (overlapSubjects / Math.max(user1.subjects.length, 1)) * 50;
    }

    let overlapSkills = 0;
    if (user1.skills && user2.skills) {
      user1.skills.forEach(skill => {
        if (user2.skills.includes(skill)) overlapSkills++;
      });
      score += (overlapSkills / Math.max(user1.skills.length, 1)) * 30;
    }

    // Time overlap rough calculation
    let timeOverlap = 0;
    if (user1.availability && user2.availability) {
        // Assume availability is an array of objects like {day: 'Mon', times: ['10:00-12:00']}
        // For simplicity, just check if they share any day
        const days1 = user1.availability.map(a => a.day);
        const days2 = user2.availability.map(a => a.day);
        
        days1.forEach(d => {
            if(days2.includes(d)) timeOverlap++;
        });
        
        if (timeOverlap > 0) score += 20;
    }

    return score;
}

export const getMatchesForUser = async (userId) => {
    const currentUserReq = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);
    if (currentUserReq.rows.length === 0) throw new Error('User not found');
    const currentUser = currentUserReq.rows[0];

    currentUser.subjects = typeof currentUser.subjects === 'string' ? JSON.parse(currentUser.subjects) : currentUser.subjects;
    currentUser.skills = typeof currentUser.skills === 'string' ? JSON.parse(currentUser.skills) : currentUser.skills;
    currentUser.availability = typeof currentUser.availability === 'string' ? JSON.parse(currentUser.availability) : currentUser.availability;

    const allUsersReq = await pool.query('SELECT * FROM users WHERE id != $1 AND is_active = true', [userId]);
    const allUsers = allUsersReq.rows.map(u => ({
        ...u,
        subjects: typeof u.subjects === 'string' ? JSON.parse(u.subjects) : u.subjects,
        skills: typeof u.skills === 'string' ? JSON.parse(u.skills) : u.skills,
        availability: typeof u.availability === 'string' ? JSON.parse(u.availability) : u.availability
    }));

    const matches = allUsers.map(user => {
        const score = calculateMatchScore(currentUser, user);
        return {
            userId: user.id,
            name: user.name,
            score: Math.round(score)
        };
    }).filter(m => m.score > 20).sort((a,b) => b.score - a.score);

    return matches;
}