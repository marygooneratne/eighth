import numpy as np
i = [0, 1, 2]
s = [0, 1, 2]
e = [2, 3, 3]
d = ['small', 'small', 'large']

def max_meetings(D, s, d, e, i):
    '''
    Args:
        D : total timeframe
        s : list of start times where s[i] is the start time for meeting i
        e : list of end times where e[i] is the end time for meeting i
        d : list of size where d[i] is the size of meeting i
        i : list of meeting IDs
    '''
    #init arr such that arr[i] is an array of all meetings that start at i
    arr = {}
    for meeting in i:
        if s[meeting] not in arr.keys():
            arr[s[meeting]] = []
        arr[s[meeting]].append(meeting) #O(n)
    
    dp = np.zeros(D+1)
    print(dp)
    for start_idx in reversed(range(0, D)): #O(D) 
        start_at_idx = arr[start_idx] #O(1)
        options = []
        for id in start_at_idx:
            options.append(dp[e[id]] + 1)
            if d[id] == 'small':
                for m in start_at_idx:
                    if m is not id and d[m] == 'small':
                        options.append(2+ dp[e[m]])
                        options.append(2+ dp[e[id]])
            print(options)
        dp[start_idx] = max(options)
    
    return dp[0]

print(max_meetings(3, s, d, e, i))
