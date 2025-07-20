package dto

type Game struct {
	stateMachine *StateMachine
	users        []*User
	id           string
	paragraph    []string
}
