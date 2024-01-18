import os
import unittest
from django.test import TestCase

from mongoengine import connect, disconnect

from mgedata.generic.template import Template


class TestTemplate(TestCase):

    @classmethod
    def setUpClass(cls):
        disconnect()
        connect('mgedata', host='mongomock://localhost')

    @classmethod
    def tearDownClass(cls):
        disconnect()

    def test_creation(self):
        t = Template(id=2, title='lalalal')
        self.assertEqual(t['id'], 2)
        self.assertEqual(t['title'], 'lalalal')

    def test_setitem(self):
        t = Template()
        t['id'] = 100
        t['abstract'] = 'abstract'
        self.assertEqual(t['id'], 100)
        self.assertEqual(t['abstract'], 'abstract')


if __name__ == '__main__':
    unittest.main(verbosity=2)
