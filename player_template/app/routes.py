from flask import jsonify, request
from app import app


@app.get('/name')
def name():
    return jsonify({"name": "Spartacus"})


@app.route('/play', methods=['POST'])
def play():
    req = request.json
    print(req)
    # req = {"score":0, "playerCount":4}

    score_list = [1, 2, 3]
    # create your own score list
    return jsonify({'scoreList': score_list})
