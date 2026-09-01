import unittest
import os
import sys

# Add project root to sys.path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

from analyzer.app.analysis_engine import analyze_pcap_file
from analyzer.app.scoring.security_score import calculate_security_score
from analyzer.app.scoring.risk_score import calculate_risk_score
from analyzer.app.security.configuration_assessment import run_full_security_assessment

class TestIPsecAnalyzer(unittest.TestCase):
    def setUp(self):
        self.pcap_path = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), "data", "pcaps", "ipsec_test.pcap")

    def test_pcap_analysis(self):
        self.assertTrue(os.path.exists(self.pcap_path))
        result = analyze_pcap_file(self.pcap_path)

        self.assertIn("id", result)
        self.assertIn("vpnDetection", result)
        self.assertEqual(result["vpnDetection"]["protocol"], "IPsec")
        self.assertEqual(result["vpnDetection"]["ikeVersion"], "IKEv2")

        scores = result.get("scores", {})
        self.assertGreaterEqual(scores.get("securityScore", 0), 0)
        self.assertLessEqual(scores.get("securityScore", 0), 100)

    def test_security_scoring(self):
        vpn_info = {
            "protocol": "IPsec",
            "ikeVersion": "IKEv2",
            "encryption": "AES-128-CBC",
            "authentication": "HMAC-SHA256",
            "dhGroup": "MODP-2048 (Group 14)",
            "pfs": "Enabled",
            "replayProtection": "Enabled"
        }
        features = {"ipsec_features": {"packet_timing_pattern": "PERIODIC"}}
        assessment_res = run_full_security_assessment(vpn_info, features)
        assessment = assessment_res["assessment"]

        sec_score = calculate_security_score(vpn_info, assessment)
        self.assertGreaterEqual(sec_score["score"], 80)
        self.assertIn(sec_score["grade"], ["GOOD", "EXCELLENT"])

        risk_score = calculate_risk_score(sec_score["score"], assessment_res["threats"])
        self.assertLessEqual(risk_score["riskScore"], 50)
        self.assertEqual(risk_score["riskLevel"], "LOW")

if __name__ == "__main__":
    unittest.main()
