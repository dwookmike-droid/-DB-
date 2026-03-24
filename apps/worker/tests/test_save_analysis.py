import os
import sys
import unittest

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "src"))

from onestop.persist.save_analysis import normalize_document_result


class SaveAnalysisTest(unittest.TestCase):
    def test_normalize_document_result_contains_sentences_chunks_and_annotations(self):
        result = normalize_document_result(
            {"sentences": [], "chunks": [], "annotations": []}
        )
        self.assertTrue(
            {"sentences", "chunks", "annotations"}.issubset(set(result.keys()))
        )


if __name__ == "__main__":
    unittest.main()
