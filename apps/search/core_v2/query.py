'''
Description: 构造核心query
Autor: liminghong.dev
Date: 2021-09-09 08:15:18
'''

from elasticsearch_dsl import Search, query

"""
基础类型定义
"""


class Query:
    def to_dsl(self) -> dict:
        raise NotImplementedError


class CompoundQuery(Query):
    def __init__(self, queries):
        self._queries = queries

    def to_dsl(self, prefix=()) -> dict:
        raise NotImplementedError

    def reverse(self):
        raise NotImplementedError


class FieldQuery(Query):
    def __init__(self, field_path: str, value=None, force_prefix=None):
        self._field_path = field_path
        self._value = value
        self._force_prefix = force_prefix

    def field_path_add(self, prefix=(), suffix=()) -> dict:
        return '.'.join(prefix + (self._field_path,) + suffix)

    def to_dsl(self, prefix=()) -> dict:
        prefix = self._force_prefix if self._force_prefix is not None else prefix
        return self._to_dsl(prefix)

    def _to_dsl(self, prefix=()):
        raise NotImplementedError

    def reverse(self):
        raise NotImplementedError


class NumericQuery(FieldQuery):
    def _to_dsl(self, prefix=()) -> dict:
        raise NotImplementedError

    def reverse(self):
        raise NotImplementedError


class StringQuery(FieldQuery):
    def _to_dsl(self, prefix=()) -> dict:
        raise NotImplementedError

    def reverse(self):
        raise NotImplementedError


class MultiQuery(FieldQuery):
    def _to_dsl(self, prefix=()) -> dict:
        raise NotImplementedError

    def reverse(self):
        raise NotImplementedError


"""
"""


class And(CompoundQuery):
    def to_dsl(self, prefix=()) -> dict:
        return query.Bool(must=[sub.to_dsl(prefix) for sub in self._queries])

    def reverse(self):
        return Or(queries=[q.reverse() for q in self._queries])


class Or(CompoundQuery):
    def to_dsl(self, prefix=()) -> dict:
        return query.Bool(should=[sub.to_dsl(prefix) for sub in self._queries])

    def reverse(self):
        return And(queries=[q.reverse() for q in self._queries])


"""
"""


class Null(FieldQuery):
    def _to_dsl(self, prefix=()) -> dict:
        return ~self.reverse()._to_dsl(prefix=prefix)

    def reverse(self):
        return NotNull(self._field_path, self._value)


class NotNull(FieldQuery):
    def _to_dsl(self, prefix=()) -> dict:
        return query.Exists(field=self.field_path_add(prefix=prefix))

    def reverse(self):
        return Null(self._field_path, self._value)


class Equal(FieldQuery):
    def _to_dsl(self, prefix=()) -> dict:
        return query.Term(**{self.field_path_add(prefix=prefix): self._value})

    def reverse(self):
        return NotEqual(self._field_path, self._value)


class NotEqual(FieldQuery):
    def _to_dsl(self, prefix=()) -> dict:
        return ~self.reverse()._to_dsl(prefix=prefix)

    def reverse(self):
        return Equal(self._field_path, self._value)


class In(FieldQuery):
    def _to_dsl(self, prefix=()):
        return query.Terms(**{self.field_path_add(prefix=prefix): self._value})

    def reverse(self):
        return NotIn(self._field_path, self._value)


class NotIn(FieldQuery):
    def _to_dsl(self, prefix=()) -> dict:
        return ~self.reverse()._to_dsl(prefix=prefix)

    def reverse(self):
        return In(self._field_path, self._value)


"""
"""


class StartsWith(StringQuery):
    def _to_dsl(self, prefix=()) -> dict:
        return query.Prefix(
            **{self.field_path_add(prefix=prefix): self._value})

    def reverse(self):
        return NotStartsWith(self._field_path, self._value)


class NotStartsWith(StringQuery):
    def _to_dsl(self, prefix=()) -> dict:
        return ~self.reverse()._to_dsl(prefix=prefix)

    def reverse(self):
        return StartsWith(self._field_path, self._value)


class EndsWith(StringQuery):
    def _to_dsl(self, prefix=()) -> dict:
        return query.Prefix(**{
            self.field_path_add(prefix=prefix, suffix=('reverse',)):
                self._value
        })

    def reverse(self):
        return NotEndsWith(self._field_path, self._value)


class NotEndsWith(StringQuery):
    def _to_dsl(self, prefix=()) -> dict:
        return ~self.reverse()._to_dsl(prefix=prefix)

    def reverse(self):
        return EndsWith(self._field_path, self._value)


class Contains(StringQuery):
    """
    字段类型必须为keyword
    """

    def _to_dsl(self, prefix=()) -> dict:
        return query.Wildcard(**{
            self.field_path_add(prefix=prefix): '*' + self._value + '*'
        })

    def reverse(self):
        return NotContains(self._field_path, self._value)


class NotContains(StringQuery):
    def _to_dsl(self, prefix=()) -> dict:
        return ~self.reverse()._to_dsl(prefix=prefix)

    def reverse(self):
        return Contains(self._field_path, self._value)


class StrictMatch(StringQuery):
    """
    字段类型必须为keyword
    """

    def _to_dsl(self, prefix=()) -> dict:
        return query.Term(**{self._field_path: self._value})

    def reverse(self):
        pass


class MatchPhrase(StringQuery):
    def _to_dsl(self, prefix=()) -> dict:
        return query.MatchPhrase(**{
            self.field_path_add(prefix=prefix, suffix=('text',)):
                {'query': self._value, 'slop': 10}
        })

    def reverse(self):
        pass


"""
"""


class Greater(NumericQuery):
    def _to_dsl(self, prefix=()) -> dict:
        return query.Range(
            **{self.field_path_add(prefix=prefix): {
                'gt': self._value
            }})

    def reverse(self):
        return NotGreater(self._field_path, self._value)


class NotGreater(NumericQuery):
    def _to_dsl(self, prefix=()) -> dict:
        return query.Range(
            **{self.field_path_add(prefix=prefix): {
                'lte': self._value
            }})

    def reverse(self):
        return Greater(self._field_path, self._value)


class Less(NumericQuery):
    def _to_dsl(self, prefix=()) -> dict:
        return query.Range(
            **{self.field_path_add(prefix=prefix): {
                'lt': self._value
            }})

    def reverse(self):
        return NotLess(self._field_path, self._value)


class NotLess(NumericQuery):
    def _to_dsl(self, prefix=()) -> dict:
        return query.Range(
            **{self.field_path_add(prefix=prefix): {
                'gte': self._value
            }})

    def reverse(self):
        return Less(self._field_path, self._value)


"""
"""


class Exists(MultiQuery):
    def _to_dsl(self, prefix=()) -> dict:
        return query.Nested(
            path=self.field_path_add(prefix=prefix),
            query=self._value.to_dsl(prefix),
        )

    def reverse(self):
        return All(self._field_path, self._value.reverse())


class NotExists(MultiQuery):
    def _to_dsl(self, prefix=()) -> dict:
        return ~self.reverse()._to_dsl(prefix=prefix)

    def reverse(self):
        return Exists(self._field_path, self._value)


class All(MultiQuery):
    def _to_dsl(self, prefix=()) -> dict:
        return query.Bool(must_not=[
            query.Nested(
                path=self.field_path_add(prefix=prefix),
                query=self._value.reverse().to_dsl(prefix),
            )
        ])

    def reverse(self):
        return NotExists(self._field_path, self._value.reverse())


class K(MultiQuery):
    def _to_dsl(self, prefix=()) -> dict:
        _term = query.Term(**{
            self.field_path_add(prefix=prefix, suffix=('_idx',)):
                self._value[0]
        })
        return query.Nested(
            path=self.field_path_add(prefix=prefix),
            query=query.Bool(must=[_term, self._value[1].to_dsl(prefix)]),
        )

    def reverse(self):
        return K(self._field_path, (self._value[0], self._value[1].reverse()))


"""
"""


class Sort(Query):
    def __init__(self, order_of_fields):
        self.desc, self.asc = 'desc', 'asc'
        self._order_of_fields = order_of_fields or dict()

        if not isinstance(self._order_of_fields, dict):
            raise ValueError('`order` must be a dict')
        for v in self._order_of_fields.values():
            if v not in (self.desc, self.asc):
                raise ValueError('`order` must be `desc` or `asc`')

    def to_dsl(self) -> set:
        keys = set()
        for k, v in self._order_of_fields.items():
            if v == self.asc:
                keys.add(k)
            elif v == self.desc:
                keys.add('-{}'.format(k))
        return keys


class BasicSearchDSL:
    def __init__(self, meta: dict, data: dict, text: dict, sort: set):
        self._meta = meta
        self._data = data
        self._text = text
        self._sort = sort

    def dsl_is_valid(self, dsl) -> bool:
        return dsl is not None

    def combine_dsl(self) -> dict:
        content = [
            x for x in (self._meta, self._data, self._text)
            if self.dsl_is_valid(x)
        ]
        ret = Search().sort(*self._sort).query(query.Bool(must=content))
        return ret.to_dict()


class QueryFactory:
    simpleField_operator = {
        'eq': Equal,
        'ne': NotEqual,
        'gt': Greater,
        'lt': Less,
        'gte': NotLess,
        'lte': NotGreater,
        'startswith': StartsWith,
        'nstartswith': NotStartsWith,
        'endswith': EndsWith,
        'nendswith': NotEndsWith,
        'contains': Contains,
        'ncontains': NotContains,
        'in': In,
        'nin': NotIn
    }

    singleField_operator = {
        'any': NotNull,
        'none': Null,
    }

    multiField_operator = {
        'exists': Exists,
        'nexists': NotExists,
        'all': All,
        'kth': K
    }

    @staticmethod
    def _produce(query: dict) -> dict:
        if query is None:
            return None

        if 'and' in query:
            return And(queries=[
                SingleTemplateQueryFactory._produce(q) for q in query['and']
            ])

        if 'or' in query:
            return Or(queries=[
                SingleTemplateQueryFactory._produce(q) for q in query['or']
            ])

        simpleField_operator = SingleTemplateQueryFactory.simpleField_operator
        multiField_operator = SingleTemplateQueryFactory.multiField_operator
        singleField_operator = SingleTemplateQueryFactory.singleField_operator
        field = None
        if 'field' in query:
            field = query['field']
            # 兼容旧接口
            if field == 'realname':
                field = 'real_name'
            elif field == 'category':
                field = 'category_id'

        if 'field' in query and 'op' in query and 'val' in query:

            if query['op'] in simpleField_operator:
                return simpleField_operator[query['op']](field, query.get('val'))

            if query['op'] in multiField_operator:
                return multiField_operator[query['op']](
                    field,
                    SingleTemplateQueryFactory._produce(query.get('val')))

        if 'field' in query and 'op' in query:
            if query['op'] in singleField_operator:
                return singleField_operator[query['op']](field)

        raise ValueError(
            'Wrong Format with {}, maybe `field` or `op` or `val` missing'.
            format(query))

    @staticmethod
    def to_dsl(_object: Query, prefix=()):
        return _object.to_dsl(prefix) if _object else None

    @staticmethod
    def _produce_meta(query: dict):
        return QueryFactory.to_dsl(QueryFactory._produce(query=query))

    @staticmethod
    def _produce_fulltext(query: str):
        if query is None:
            return None
        tokens = query.split()
        return QueryFactory.to_dsl(
            And(queries=[
                MatchPhrase(field_path='summary', value=token) for token in tokens
                # StrictMatch(field_path='subject', value=query),
                # StrictMatch(field_path='project', value=query),
                # StartsWith(field_path='subject', value=query),
                # StartsWith(field_path='project', value=query)
            ]))


class SingleTemplateQueryFactory(QueryFactory):
    @staticmethod
    def _produce_data(query: dict):
        return QueryFactory.to_dsl(_object=QueryFactory._produce(query=query),
                                   prefix=('content',))

    @staticmethod
    def produce(q: dict):
        basic_search = BasicSearchDSL(
            meta=SingleTemplateQueryFactory._produce_meta(q.get('meta')),
            data=SingleTemplateQueryFactory._produce_data(q.get('data')),
            text=SingleTemplateQueryFactory._produce_fulltext(q.get('text')),
            sort=Sort(q.get('sort')).to_dsl(),
        )
        return basic_search.combine_dsl()


class MultiTemplateQueryFactory(QueryFactory):
    @staticmethod
    def _produce_data(query: dict):
        query = Or(queries=[
            And(queries=[
                QueryFactory._produce(v['q']),
                Equal(field_path='template',
                      value=int(v['tid']),
                      force_prefix=())
            ]) for v in query
        ])
        return QueryFactory.to_dsl(_object=query, prefix=('content',))

    @staticmethod
    def produce(q: dict):
        basic_search = BasicSearchDSL(
            meta=MultiTemplateQueryFactory._produce_meta(q.get('meta')),
            data=MultiTemplateQueryFactory._produce_data(q.get('data') or []),
            text=MultiTemplateQueryFactory._produce_fulltext(q.get('text')),
            sort=Sort(q.get('sort')).to_dsl(),
        )
        return basic_search.combine_dsl()
