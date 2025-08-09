package dto

import "github.com/gorilla/websocket"

type User struct {
	userID           string
	stats            *Stats
	currentWordIndex int64
	conn             *websocket.Conn
}

func (u *User) Conn() *websocket.Conn {
	if u == nil {
		return &websocket.Conn{}
	}
	return u.conn
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

func NewUser(userID string, stats *Stats, currentWordIndex int64, conn *websocket.Conn) *User {
	return &User{
		userID:           userID,
		stats:            stats,
		currentWordIndex: currentWordIndex,
		conn:             conn,
	}
}

func (u *User) IsEmpty() bool {
	return (u == nil || (u.userID == "" && u.stats.IsEmpty() && u.currentWordIndex == 0 && u.conn == nil))
}
