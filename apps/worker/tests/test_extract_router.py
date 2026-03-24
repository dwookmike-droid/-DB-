import os
import sys
import unittest

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "src"))

from onestop.extract.router import get_extractor


class ExtractRouterTest(unittest.TestCase):
    def test_get_extractor_returns_pdf_extractor(self):
        extractor = get_extractor("pdf")
        self.assertEqual(extractor.__name__, "extract_pdf_text")


if __name__ == "__main__":
    unittest.main()
