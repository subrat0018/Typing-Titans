package service

import (
	"fmt"
	"time"
	"typing-titans/dto"
	"typing-titans/service/request"
	"typing-titans/service/response"

	"github.com/google/uuid"
	"github.com/gorilla/websocket"
)

const LIMIT = 5
const GAMETIME = 15

var CurrentGames = []*dto.Game{}
var clientToGameMap = map[string]*dto.Game{}

func HandleGame(clientID string, event *request.Event, conn *websocket.Conn) *response.GameResp {
	eventType := event.GetEventType()
	data := event.GetData()
	switch eventType {
	case request.EventTypeJoin:
		return handleJoinEvent(clientID, conn)
	case request.EventTypeUpdate:
		return handleUpdateEvent(clientID, data)

	}
	return nil

}

func handleJoinEvent(clientID string, conn *websocket.Conn) *response.GameResp {
	if _, found := clientToGameMap[clientID]; found {
		return &response.GameResp{
			IsSuccess: true,
			Message:   "You are already in a game",
		}
	}

	for _, game := range CurrentGames {
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
		users = append(users, dto.NewUser(clientID, userStats, 0, conn))
		game.SetUsers(users)
		clientToGameMap[clientID] = game
		return &response.GameResp{
			IsSuccess: true,
			Message:   "You have joined the game :))",
		}
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
	gameTime := GAMETIME               // Will add some customization to it
	game := dto.NewGame(stateMachine, []*dto.User{}, gameID.String(), paragraph, LIMIT, int64(gameTime))
	clientToGameMap[clientID] = game
	CurrentGames = append(CurrentGames, game)
	return &response.GameResp{
		IsSuccess: true,
		Message:   "You have joined the game :))",
	}
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
