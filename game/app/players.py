import json

import requests


players = {}


def get_name(url) -> str:
    response = requests.get(f'{url}/name', timeout=10)
    if response.status_code == 200:
        return response.json()["name"]
    else:
        raise Exception


def get_running_pods(potential_players):
    """
    Get the pods running currently
    :param potential_players:
    :return:
    """
    running_pods = []
    for p in potential_players:
        url = f"http://{p['service']}:{p['port']}"
        try:
            name = get_name(url)
            running_pods.append(name)
            players[name] = url
        except Exception as e:
            print(e)
            print('WARNING: pod not running, skipping this player')
    return running_pods


def load_players(num_of_players: int) -> list:
    players.clear()
    # Reads players from players.json which is provided by a volume mounted config map. This can be updated live.
    with open("../config/players.json") as f:
        potential_players_list = json.load(f)['players']

    # Filter the players
    running_pods = get_running_pods(potential_players_list)

    # return list of players len of number of req players
    players_list = []
    counter = 0
    while len(players_list) < num_of_players:
        if counter > (len(running_pods) - 1):
            counter = 0
        players_list.append(running_pods[counter])
        counter += 1
    return players_list


def get_move(name: str, game_state: dict):
    try:
        url = players.get(name)
        response = requests.post(f'{url}/play', timeout=10, json=game_state)
        if response.status_code == 200:
            return response.json()["scoreList"]
        else:
            raise Exception(response.status_code)
    except Exception as e:
        print(e)
        return [0]
