package service

import (
	"fmt"
	"time"
	"typing-titans/dto"
	"typing-titans/service/request"
	"typing-titans/service/response"

	"github.com/google/uuid"
)

const LIMIT = 5

var currentGames = []*dto.Game{}
var clientToGameMap = map[string]*dto.Game{}

func HandleGame(clientID string, event *request.Event) *response.GameResp {
	eventType := event.GetEventType()
	data := event.GetData()
	switch eventType {
	case request.EventTypeJoin:
		return handleJoinEvent(clientID)
	case request.EventTypeUpdate:
		return handleUpdateEvent(clientID, data)

	}
	return nil

}

func handleJoinEvent(clientID string) *response.GameResp {
	for _, game := range currentGames {
		if int(game.Limit()) == len(game.Users()) {
			continue
		}

		if game.StateMachine().CurrentState() != dto.StateCreate {
			continue
		}

		if time.Now().Unix()-game.StateMachine().CreatedAt() > 15 {
			continue
		}
		users := game.Users()
		userStats := dto.NewStats(0, 0, 0, false)
		users = append(users, dto.NewUser(clientID, userStats, 0))
		game.SetUsers(users)
		clientToGameMap[clientID] = game
		return nil
	}

	stateMachine := dto.NewStateMachine(time.Now().Unix(), 0, dto.StateCreate)
	gameID, err := uuid.NewUUID()
	if err != nil {
		return &response.GameResp{
			IsSuccess: false,
			Message:   fmt.Sprintf("err: %v", err.Error()),
		}
	}
	paragraph := getDefaultParagraph() // Will customize it later
	game := dto.NewGame(stateMachine, []*dto.User{}, gameID.String(), paragraph, LIMIT)
	currentGames = append(currentGames, game)
	return nil
}

func handleUpdateEvent(clientID string, data *request.Data) *response.GameResp {
	game, found := clientToGameMap[clientID]
	if !found {
		return &response.GameResp{
			IsSuccess: false,
			Message:   fmt.Sprintf("The user is not in any game, clientID: %v", clientID),
		}
	}
	if game.StateMachine().CurrentState() != dto.StateInProgress {
		return &response.GameResp{
			IsSuccess: false,
			Message:   "The game is not in a running state",
		}
	}
	user := game.GetUserByUserID(clientID)
	if user.IsEmpty() {
		return &response.GameResp{
			IsSuccess: false,
			Message:   fmt.Sprintf("User is not found in the game sus!!, userID: %v, gameID: %v", clientID, game.ID()),
		}
	}

	if user.Stats().IsFinished() {
		fmt.Printf("User %v is spamming :(", clientID)
		return &response.GameResp{
			IsSuccess: true,
			Message:   "You have finished the game",
		}
	}

	para := game.Paragraph()
	index := user.CurrentWordIndex()
	word := para[index]
	correctChars := user.Stats().TotalCorrectChars()
	if word == data.GetWord() {
		correctChars += int64(len(word))
	}
	index++
	isFinished := index == int64(len(para))
	user.Stats().SetTotalCorrectChars(correctChars)
	user.Stats().SetUpdatedAt(time.Now().Unix())
	user.Stats().SetIsFinished(isFinished)
	return &response.GameResp{
		IsSuccess: true,
	}
}
