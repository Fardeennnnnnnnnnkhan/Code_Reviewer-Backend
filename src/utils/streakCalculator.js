export const calculateStreak = (activities) => {
    if (!activities || activities.length === 0) {
        return { currentStreak: 0, longestStreak: 0 };
    }

    const today = new Date();
    // Use local time for date string to avoid timezone issues when checking today
    const tzOffset = today.getTimezoneOffset() * 60000;
    const localISOTime = (new Date(today - tzOffset)).toISOString().split('T')[0];
    const todayStr = localISOTime;
    const yesterday = new Date(today - 86400000 - tzOffset);
    const yesterdayStr = yesterday.toISOString().split('T')[0];
    
    // Sort descending by date
    const sortedActivities = [...activities].sort((a, b) => new Date(b.date) - new Date(a.date));

    // Calculate current streak
    let currentStreak = 0;
    let trackingDate = todayStr;
    const dateSet = new Set(sortedActivities.map(a => a.date));
    
    if (dateSet.has(todayStr) || dateSet.has(yesterdayStr)) {
        if(!dateSet.has(todayStr) && dateSet.has(yesterdayStr)) {
            trackingDate = yesterdayStr;
            currentStreak = 1;
        } else {
            currentStreak = 1;
        }
        
        let prevDate = new Date(new Date(trackingDate).getTime() - 86400000).toISOString().split('T')[0];
        while(dateSet.has(prevDate)) {
            currentStreak++;
            prevDate = new Date(new Date(prevDate).getTime() - 86400000).toISOString().split('T')[0];
        }
    }

    // Calculate longest streak
    let longestStreak = 0;
    let tempStreak = 0;
    let expectedDate = null;
        
    for (const activity of sortedActivities) {
        if (!expectedDate) {
             tempStreak = 1;
             expectedDate = new Date(new Date(activity.date).getTime() - 86400000).toISOString().split('T')[0];
        } else if (activity.date === expectedDate) {
            tempStreak++;
            expectedDate = new Date(new Date(expectedDate).getTime() - 86400000).toISOString().split('T')[0];
        } else {
            if (tempStreak > longestStreak) longestStreak = tempStreak;
            tempStreak = 1;
            expectedDate = new Date(new Date(activity.date).getTime() - 86400000).toISOString().split('T')[0];
        }
    }
    if (tempStreak > longestStreak) longestStreak = tempStreak;

    return {
        currentStreak,
        longestStreak: Math.max(longestStreak, currentStreak)
    };
};
