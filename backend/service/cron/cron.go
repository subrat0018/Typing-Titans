package cron

import (
	"sort"
	"time"
	"typing-titans/dto"
	"typing-titans/service"
	"typing-titans/service/response"
)

const AvgLettersInAWord = 5

func RunCronJob() {
	ticker := time.NewTicker(1 * time.Second)
	/*
		   1. Game state update
		   		i. Created to InProgress
				ii. In Progress to End
		   2. Score update
		   		i. Traverse through each of the active game
					a. Traverse through all the users
					b. update
		   3. Broadcast
		   4. Remove Inactive Games
	*/
	for range ticker.C {
		handleGameUpdateState()
		handleScoreUpdate()
		handleBroadcastScores()
		removeInactiveGames()
	}
}

func handleGameUpdateState() {
	for _, game := range service.CurrentGames {
		handleGameUpdate(game)
	}
}

func handleGameUpdate(game *dto.Game) {
	switch game.StateMachine().CurrentState() {
	case dto.StateCreate:
		handleCreateUpdateState(game)
	case dto.StateInProgress:
		handleInProgressUpdateState(game)
	}
}

func handleCreateUpdateState(game *dto.Game) {
	if time.Now().Unix()-game.StateMachine().CreatedAt() >= 15 { // Could add this to game object
		game.StateMachine().SetCurrentState(dto.StateInProgress)
		game.StateMachine().SetStartsAt(time.Now().Unix())
		handleGameStartBroadcast(game)
	}

	if len(game.Users()) >= int(game.Limit()) {
		game.StateMachine().SetCurrentState(dto.StateInProgress)
		game.StateMachine().SetStartsAt(time.Now().Unix())
		handleGameStartBroadcast(game)
	}
}

func handleInProgressUpdateState(game *dto.Game) {
	if time.Now().Unix()-game.StateMachine().StartsAt() >= game.GameTime() {
		game.StateMachine().SetCurrentState(dto.StateEnd)
		handleGameEndBroadcast(game)
	}
}

func handleScoreUpdate() {
	for _, game := range service.CurrentGames {
		handleScoreUpdateForGame(game)
	}
}

func handleScoreUpdateForGame(game *dto.Game) {
	for _, user := range game.Users() {
		handleScoreUpdateForUser(user)
	}
}

// Could add more functionality such that accurracy. But for now only speed :)
func handleScoreUpdateForUser(user *dto.User) {
	if user.Stats().IsFinished() {
		return
	}
	totalCorrectChars := user.Stats().TotalCorrectChars()
	speed := float64(totalCorrectChars) / float64(AvgLettersInAWord)
	user.Stats().SetSpeed(speed)
}

func handleGameStartBroadcast(game *dto.Game) {
	for _, user := range game.Users() {
		conn := user.Conn()
		conn.WriteJSON(&response.GameResp{
			IsSuccess: true,
			Message:   "Game is started!!",
		})
	}
}

func handleGameEndBroadcast(game *dto.Game) {
	for _, user := range game.Users() {
		conn := user.Conn()
		conn.WriteJSON(&response.GameResp{
			IsSuccess: true,
			Message:   "Game ended!!",
		})
	}
}

func handleBroadcastScores() {
	for _, game := range service.CurrentGames {
		if game.StateMachine().CurrentState() != dto.StateCreate {
			continue
		}
		leaderBoard := calculateLeaderBoard(game.Users())
		broadcastLeaderBoard(game.Users(), leaderBoard)
	}
}

func broadcastLeaderBoard(users []*dto.User, leaderBoard []*response.UserStats) {
	for _, user := range users {
		conn := user.Conn()
		conn.WriteJSON(&response.GameResp{
			IsSuccess:   true,
			Message:     "User stats",
			LeaderBoard: leaderBoard,
		})
	}
}

func calculateLeaderBoard(users []*dto.User) []*response.UserStats {
	sort.Slice(users, func(i int, j int) bool {
		return users[i].Stats().Speed() > users[j].Stats().Speed()
	})
	var resp []*response.UserStats
	for pos, user := range users {
		resp = append(resp, &response.UserStats{
			Id:    user.UserID(),
			Name:  "", // Will have it fixed
			Speed: user.Stats().Speed(),
			Pos:   pos + 1,
		})
	}
	return resp
}

func removeInactiveGames() {
	// Could add history support with db push
	var updatedGames []*dto.Game
	for _, game := range service.CurrentGames {
		if game.StateMachine().CurrentState() == dto.StateEnd {
			continue
		}
		updatedGames = append(updatedGames, game)
	}
	service.CurrentGames = updatedGames
}
