import os
import unittest

import django

from mgedata.generic.data_fields import *

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "mgedata.test_settings")
django.setup()


class TestStringField(unittest.TestCase):
    def setUp(self) -> None:
        self.f1 = StringField('字符串')
        self.f2 = StringField('field1')
        self.f3 = StringField('@what hello')

    def test_get_name(self):
        self.assertEqual(self.f1.name, '字符串')
        self.assertEqual(self.f2.name, 'field1')
        self.assertEqual(self.f3.name, '@what hello')

    def test_set_and_get_value(self):
        with self.assertRaises(AttributeError):
            self.assertEqual(self.f1.value, None)
            self.assertEqual(self.f2.value, None)
            self.assertEqual(self.f3.value, None)

        self.f1.create()
        self.f1.set('value1')
        self.f2.create()
        self.f3.create()

        with self.assertRaises(AttributeError):
            self.f3.unit
        self.assertEqual(self.f1.value, 'value1')


class TestNumericField(unittest.TestCase):
    def setUp(self) -> None:
        self.f1 = NumericField('数值型')
        self.f2 = NumericField('field2')
        self.f3 = NumericField('with unit', misc={'unit': 'C'})

    def test_get_name(self):
        self.assertEqual(self.f1.name, '数值型')
        self.assertEqual(self.f2.name, 'field2')
        self.assertEqual(self.f3.name, 'with unit')

    def test_get_unit(self):
        self.assertEqual(self.f1.unit, None)
        self.assertEqual(self.f2.unit, None)
        self.assertEqual(self.f3.unit, 'C')

    def test_set_and_get_value(self):
        with self.assertRaises(AttributeError):
            self.assertEqual(self.f1.value, None)
            self.assertEqual(self.f2.value, None)
            self.assertEqual(self.f3.value, None)

        self.f2.create()
        self.f2.set(1.45)
        with self.assertRaises(AttributeError):
            self.assertEqual(self.f1.value, None)
        self.assertAlmostEqual(self.f2.value, 1.45)
        with self.assertRaises(AttributeError):
            self.assertEqual(self.f3.value, None)


class TestChoiceField(unittest.TestCase):
    def setUp(self) -> None:
        self.f1 = ChoiceField('候选型', misc={'opt': ['A', 'Bob', 'Crow'], 'grp': []})
        self.f2 = ChoiceField('choice', misc={'opt': ['Hello'], 'grp': []})
        self.f3 = ChoiceField('hello', misc={'opt': ['good', 'not'], 'grp': []})

    def test_get_name(self):
        self.assertEqual(self.f1.name, '候选型')
        self.assertEqual(self.f2.name, 'choice')
        self.assertEqual(self.f3.name, 'hello')

    def test_create(self):
        with self.assertRaises(ValueError):
            ChoiceField('test', misc='123')

    def test_set_and_get_value(self):
        with self.assertRaises(AttributeError):
            self.assertEqual(self.f1.value, None)
            self.assertEqual(self.f2.value, None)
            self.assertEqual(self.f3.value, None)

        self.f1.create()
        self.f2.create()
        self.f3.create()
        self.f2.set('Hello')
        self.f3.set('not')

        self.assertEqual(self.f2.value, 'Hello')
        self.assertEqual(self.f3.value, 'not')


class TestIntervalField(unittest.TestCase):

    def setUp(self) -> None:
        self.f1 = IntervalField('区间型', misc={'unit': 'T'})
        self.f2 = IntervalField('interval')
        self.f3 = IntervalField('@@@####')

    def test_get_name(self):
        self.assertEqual(self.f1.name, '区间型')
        self.assertEqual(self.f2.name, 'interval')
        self.assertEqual(self.f3.name, '@@@####')

    def test_get_unit(self):
        self.assertEqual(self.f1.unit, 'T')
        self.assertEqual(self.f2.unit, None)
        self.assertEqual(self.f3.unit, None)

    def test_set_and_get_value(self):
        with self.assertRaises(AttributeError):
            self.assertEqual(self.f1.value, None)
            self.assertEqual(self.f2.value, None)
            self.assertEqual(self.f3.value, None)

        self.f1.create()
        self.f3.create()
        self.f1.set({'lb': 10.0, 'ub': 20.0})
        self.f3.set({'lb': -45, 'ub': 1000})

        self.assertEqual(self.f1.value['lb'], 10)
        self.assertEqual(self.f1.value['ub'], 20)
        with self.assertRaises(AttributeError):
            self.assertEqual(self.f2.value, None)
        self.assertEqual(self.f3.value['lb'], -45)
        self.assertEqual(self.f3.value['ub'], 1000)


class TestErrorField(unittest.TestCase):

    def setUp(self) -> None:
        self.f1 = ErrorField('误差型', misc={'unit': 'C'})
        self.f2 = ErrorField('error', misc={'unit': 'q'})
        self.f3 = ErrorField('$$$')

    def test_get_name(self):
        self.assertEqual(self.f1.name, '误差型')
        self.assertEqual(self.f2.name, 'error')
        self.assertEqual(self.f3.name, '$$$')

    def test_get_unit(self):
        self.assertEqual(self.f1.unit, 'C')
        self.assertEqual(self.f2.unit, 'q')
        self.assertEqual(self.f3.unit, None)

    def test_set_and_get_value(self):
        with self.assertRaises(AttributeError):
            self.assertEqual(self.f1.value, None)
            self.assertEqual(self.f2.value, None)
            self.assertEqual(self.f3.value, None)

        self.f1.create()
        self.f3.create()
        self.f1.set({'val': 5.0, 'err': 1.0})
        with self.assertRaises(AttributeError):
            self.f2.set('abc')
        self.f3.set({'val': -10.0, 'err': 1.0})

        self.assertEqual(self.f1.value['val'], 5.0)
        self.assertEqual(self.f1.value['err'], 1.0)
        with self.assertRaises(AttributeError):
            self.assertEqual(self.f2.value, None)
        self.assertEqual(self.f3.value['val'], -10)
        self.assertEqual(self.f3.value['err'], 1)


class TestArrayField(unittest.TestCase):

    def setUp(self) -> None:
        self.f1 = ArrayField('数组-字符串', misc={'element_type': StringValue})
        self.f2 = ArrayField('数组-数值', misc={'element_type': NumericValue})
        self.f3 = ArrayField('数组-候选型', misc={'element_type': ChoiceValue, 'opt': ['A', 'B'], 'grp': []})
        self.f4 = ArrayField('数组-区间型', misc={'element_type': IntervalValue, 'unit': 'C'})
        self.f5 = ArrayField('数组-误差型', misc={'element_type': ErrorValue})
        self.f6 = ArrayField('数组-容器', misc={
            'element_type': ContainerValue,
            'fields': [
                StringField('字符串'),
                NumericField('数值型', misc={'unit': 'T'}),
                ChoiceField('候选型', misc={'opt': ['A', 'B'], 'grp': []})
            ]
        })
        self.f7 = ArrayField('数组-生成器', misc={
            'element_type': GeneratorValue,
            'fields': [
                StringField('字符串'),
                NumericField('数值型', misc={'unit': 'T'}),
                ChoiceField('候选型', misc={'opt': ['A', 'B'], 'grp': []})
            ]
        })

    def test_get_name(self):
        self.assertEqual(self.f1.name, '数组-字符串')
        self.assertEqual(self.f2.name, '数组-数值')
        self.assertEqual(self.f3.name, '数组-候选型')
        self.assertEqual(self.f4.name, '数组-区间型')
        self.assertEqual(self.f5.name, '数组-误差型')

    def test_set_and_get_value_string(self):
        with self.assertRaises(TypeError):
            self.f1[0]

        self.f1.create()
        self.f1.create_and_append("123")
        self.f1.create_and_append("good example")
        self.assertEqual(self.f1[0].value, "123")
        self.assertEqual(self.f1[1].value, "good example")
        self.f1.pop()
        with self.assertRaises(IndexError):
            self.f1[1]

    def test_set_and_get_value_numeric(self):
        self.f2.create()
        self.f2.create_and_append(4.0)
        self.assertEqual(self.f2[0].value, 4.0)

    def test_set_and_get_value_choice(self):
        with self.assertRaises(AttributeError):
            self.f3.create_and_append('B')
        self.f3.create()
        self.f3.create_and_append('A')
        with self.assertRaises(IndexError):
            self.f3[1]

    def test_set_and_get_value_interval(self):
        self.f4.create()
        self.f4.create_and_append()
        self.f4[0].set({'lb': 1, 'ub': 8})

    def test_set_and_get_value_container(self):
        with self.assertRaises(TypeError):
            self.f6['字符串']
        self.f6.create()
        self.f6.create_and_append()
        self.f6[0]['字符串'].create()
        self.f6[0]['字符串'].set('good')
        self.assertEqual(self.f6[0]['字符串'].value, 'good')

    def test_set_and_get_value_generator(self):
        self.f7.create()
        self.f7.create_and_append()
        self.f7[0].select('字符串')
        self.f7[0].field.set('good')
        self.assertEqual(self.f7[0].field.value, 'good')


class TestContainerField(unittest.TestCase):

    def setUp(self) -> None:
        self.f1 = ContainerField('容器型', misc={
            'fields': [
                StringField('字符型'),
                NumericField('数值型', misc={'unit': 'C'})]
        })

    def test_get_name(self):
        self.assertEqual(self.f1.name, '容器型')

    def test_set_and_get_value_string(self):
        self.f1.create()
        with self.assertRaises(AttributeError):
            self.assertEqual(self.f1['字符型'].value, None)
        with self.assertRaises(AttributeError):
            self.f1['字符型'].set(123)
        self.f1['字符型'].create()
        self.f1['字符型'].set('hello')
        self.assertEqual(self.f1['字符型'].value, 'hello')


class TestGeneratorField(unittest.TestCase):

    def setUp(self) -> None:
        self.f1 = GeneratorField('生成器', misc={
            'fields': [
                StringField('字符型'),
                NumericField('数值型', misc={'unit': 'C'})]
        })

    def test_get_name(self):
        self.assertEqual(self.f1.name, '生成器')

    def test_set_and_get_value_string(self):
        self.f1.create()
        self.f1.select('字符型')
        self.f1.field.set('good')
        self.assertEqual(self.f1.field.value, 'good')
        self.f1.select('数值型')
        self.f1.field.set(123.0)
        self.assertEqual(self.f1.field.value, 123.0)
        self.f1.select('字符型')
        self.assertEqual(self.f1.field.value, None)


if __name__ == '__main__':
    unittest.main(verbosity=2)
