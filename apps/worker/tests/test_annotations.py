import os
import sys
import unittest

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "src"))

from onestop.analyze.annotations import build_annotation_drafts


class AnnotationDraftTest(unittest.TestCase):
    def test_build_annotation_drafts_creates_grammar_and_vocab_slots(self):
        drafts = build_annotation_drafts(
            chunk_text="The way we remember",
            syntax_label="noun_clause",
            vocab_items=[{"lemma": "way"}],
        )
        kinds = [draft["type"] for draft in drafts]
        self.assertIn("grammar", kinds)
        self.assertIn("vocab", kinds)


if __name__ == "__main__":
    unittest.main()
