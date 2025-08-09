package dto

import (
	"sync"
)

type Game struct {
	stateMachine *StateMachine
	users        []*User
	id           string
	paragraph    []string
	limit        int64
	gameTime     int64
	mutex        *sync.Mutex
}

func (g *Game) GameTime() int64 {
	if g == nil {
		return 0
	}
	return g.gameTime
}

func (g *Game) StateMachine() *StateMachine {
	if g == nil {
		return &StateMachine{}
	}
	return g.stateMachine
}

func (g *Game) Users() []*User {
	if g == nil {
		return []*User{}
	}
	return g.users
}

func (g *Game) ID() string {
	if g == nil {
		return ""
	}
	return g.id
}

func (g *Game) Paragraph() []string {
	if g == nil {
		return []string{}
	}
	return g.paragraph
}

func (g *Game) Limit() int64 {
	if g == nil {
		return 0
	}
	return g.limit
}

func (g *Game) Mutex() *sync.Mutex {
	if g == nil {
		return &sync.Mutex{}
	}
	return g.mutex
}

func NewGame(
	stateMachine *StateMachine,
	users []*User,
	id string,
	paragraph []string,
	limit int64,
	gameTime int64,
) *Game {
	return &Game{
		stateMachine: stateMachine,
		users:        users,
		id:           id,
		paragraph:    paragraph,
		limit:        limit,
		mutex:        &sync.Mutex{},
		gameTime:     gameTime,
	}
}

func (g *Game) SetUsers(users []*User) {
	if g == nil {
		g = &Game{}
	}
	g.users = users
}

func (g *Game) GetUserByUserID(userID string) *User {
	for _, user := range g.Users() {
		if user.UserID() == userID {
			return user
		}
	}
	return &User{}
}
