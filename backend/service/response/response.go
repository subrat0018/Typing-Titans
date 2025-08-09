package response

type GameResp struct {
	IsSuccess   bool
	Message     string
	LeaderBoard []*UserStats
}

type UserStats struct {
	Id    string
	Name  string
	Speed float64
	Pos   int
}
