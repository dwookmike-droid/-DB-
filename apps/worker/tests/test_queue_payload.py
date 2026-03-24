import os
import sys
import unittest

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "src"))

from onestop.jobs.process_document import build_job_payload


class QueuePayloadTest(unittest.TestCase):
    def test_build_job_payload_contains_document_id(self):
        payload = build_job_payload("doc_123")
        self.assertEqual(payload["document_id"], "doc_123")


if __name__ == "__main__":
    unittest.main()
