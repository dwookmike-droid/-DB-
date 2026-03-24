import os
import sys
import unittest

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "src"))

from onestop.analyze.chunks import split_sentence_into_chunks


class ChunkingTest(unittest.TestCase):
    def test_split_sentence_into_chunks_returns_multiple_segments(self):
        sentence = "The way we remember shapes the way we act in the future."
        chunks = split_sentence_into_chunks(sentence)
        self.assertGreaterEqual(len(chunks), 2)


if __name__ == "__main__":
    unittest.main()
