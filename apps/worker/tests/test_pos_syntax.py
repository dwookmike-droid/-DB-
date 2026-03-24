import os
import sys
import unittest

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "src"))

from onestop.analyze.pos import tag_tokens


class PosSyntaxTest(unittest.TestCase):
    def test_tag_tokens_marks_main_verb(self):
        tags = tag_tokens("Memory shapes behavior.")
        self.assertTrue(any(token["pos"] == "VERB" for token in tags))


if __name__ == "__main__":
    unittest.main()
