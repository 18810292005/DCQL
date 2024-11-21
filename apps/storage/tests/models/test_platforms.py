from django.test import TestCase

from apps.storage.models.platform import Platforms


class TestPlatforms(TestCase):

    def test_get_platform_code_list(self):
        ls = Platforms.get_platform_code_list()
        for code in ls:
            self.assertIsInstance(code, int)

    def test_verify_code(self):
        correct_test_case = [0, 1, 2, 3]
        error_test_case = [-1, 4, 5]

        for code in correct_test_case:
            self.assertTrue(Platforms.verify_platform_code(code))

        for code in error_test_case:
            self.assertFalse(Platforms.verify_platform_code(code))
