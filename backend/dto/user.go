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

func NewUser(userID string) *User {
	return &User{
		userID: userID,
	}
}
