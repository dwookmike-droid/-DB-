import os
import sys
import unittest

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "src"))

from onestop.analyze.vocab import extract_vocabulary_candidates


class VocabularyTest(unittest.TestCase):
    def test_extract_vocabulary_candidates_returns_content_words(self):
        items = extract_vocabulary_candidates("Memory shapes future behavior.")
        lemmas = [item["lemma"] for item in items]
        self.assertIn("memory", lemmas)
        self.assertIn("shape", lemmas)


if __name__ == "__main__":
    unittest.main()
