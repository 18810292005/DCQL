from apps.storage.constraint.parse_expression import parse_expression
from mgedata.test import MGETestCase


class TestExceptionCatcher:
    def __init__(self, test_name=""):
        print(f"Start test:{test_name}")

    def __enter__(self):
        print(60 * '=')

    def __exit__(self, exc_type, exc_value, exc_traceback):
        print(60 * '=')
        if exc_type:
            print(f"Raise exception:{exc_value}")
        else:
            print("Running Successfully")
        print('\n')
        return True


class ExpressionTester(MGETestCase):
    def setUp(self):
        pass

    # def test_value(self):
    #     e1 = 'value < 3 AND value>=-1'
    #     c1 = parse_expression(e1)
    #     c1.validate(0)
    #     with TestExceptionCatcher():
    #         c1.validate(5)
    #
    #     with TestExceptionCatcher():
    #         c1.validate(-2)
    #
    #     e1 = 'value in [1,2,3'
    #     c1 = parse_expression(e1)
    #     with TestExceptionCatcher():
    #         c1.validate(0)
    #     with TestExceptionCatcher():
    #         c1.validate(5)
    #     with TestExceptionCatcher():
    #         c1.validate(-2)

    def test_length(self):
        e1 = 'length < 3'
        c1 = parse_expression(e1)
        with TestExceptionCatcher():
            c1.validate('hi')
        with TestExceptionCatcher():
            c1.validate('testing')
        with TestExceptionCatcher():
            c1.validate(5)
