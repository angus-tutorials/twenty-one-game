from flask import render_template, jsonify, request
from app import app
from app.players import load_players, get_move

@app.get('/')
@app.get('/index')
def index():
    return render_template('index.html')


@app.get('/load')
def load():


    args = request.args
    # Angus's front end logic to prevent non-ints from being passed
    # todo handle errors not identifying the technology, no stack trace etc
    number_of_players = int(args.get("players"))
    # todo return correct number of players
    name_list = load_players(number_of_players)
    print(name_list)
    return jsonify({"names": name_list})


@app.route('/play', methods=['POST'])
def play():
    """Takes parameters from the POST request from a player and returns their chosen numbers in json format
    e.g. {"score":1, "playerCount":4}
    param str: name
    param int: score
    param int: playerCount
    :return json: scoreList
    """

    req = request.json
    name = req["name"]  # Angus sends the name and this corresponds to the pod I need to get
    game_state = {"score": req['score'], "playerCount": req['playerCount']}
    player_chosen_numbers = get_move(name, game_state)  # query pod for it's numbers players return their numbers
    print(f'{name} plays {player_chosen_numbers}')
    return jsonify({'scoreList': player_chosen_numbers}) # returns score list in json format TODO: update JS
