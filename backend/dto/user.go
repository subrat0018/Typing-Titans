package dto

type User struct {
	userID           string
	stats            *Stats
	currentWordIndex int64
}

func (u *User) UserID() string {
	if u == nil {
		return ""
	}
	return u.userID
}

func (u *User) Stats() *Stats {
	if u == nil {
		return &Stats{}
	}
	return u.stats
}

func (u *User) CurrentWordIndex() int64 {
	if u == nil {
		return 0
	}
	return u.currentWordIndex
}

func NewUser(userID string, stats *Stats, currentWordIndex int64) *User {
	return &User{
		userID:           userID,
		stats:            stats,
		currentWordIndex: currentWordIndex,
	}
}

func (u *User) IsEmpty() bool {
	return (u == nil || (u.userID == "" && u.stats.IsEmpty() && u.currentWordIndex == 0))
}
