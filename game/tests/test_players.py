import unittest
from app.players import load_players


class TestPlayers(unittest.TestCase):
    def test_load_players(self):
        number_of_players = 100
        names = load_players(number_of_players)
        self.assertEqual(number_of_players, len(names))

    def test_load_players_less_than_number_player(self):
        number_of_players = 1
        names = load_players(number_of_players)
        self.assertEqual(number_of_players, len(names))


if __name__ == '__main__':
    unittest.main()
