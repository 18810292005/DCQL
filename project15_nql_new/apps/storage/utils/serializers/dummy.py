# -*- coding: utf-8 -*-

# @File   : public.py
# @Author : Yuvv
# @Date   : 2018/1/10


import re

from django.utils.translation import gettext as _
from django.conf import settings


f_dummy_fmt = '=== ' + _('Fill %(name)s here. (eg: %(value)s)') + ' ==='
p_dummy_pattern = re.compile(r'^===.*===$')
p_integer_pattern = re.compile(r'^[+\-]?\d+$')
p_of_url_pattern = re.compile(r'^%s(?P<name>_fs/\d{4}/\d{2}/\d{2}/[a-zA-Z0-9]{12}.*?)$' % settings.MEDIA_URL)

f_type_key = _('Type')
f_required_key = _('Required')
f_unit_key = _('Unit')
f_range_type_key = _('Range Type')
f_range_type_interval = _('Interval Type')
f_range_type_error = _('Error Type')
f_range_lb = _('Lower bound')
f_range_ub = _('Upper bound')
f_range_val = _('Value')
f_range_err = _('Error Type')
f_multiple_key = _('Multiple')
f_image_path = _('Image Path')
f_file_path = _('File Path')
f_options_key = _('Options')
f_groups_key = _('Groups')
f_array_type_key = _('Array Type')
f_heads_key = _('Heads')
f_fields_key = _('Fields')
f_selected = _('Selected')

d_title = _('Data Title')
d_title_eg = _('Fe3O4')
d_keywords = _('Keywords')
d_keywords_eg = _('Metal')
d_doi = 'DOI'
d_doi_eg = '10.1000/abc.123'
d_abstract = _('Abstract')
d_abstract_eg = _('Calculated through Bond energy')
d_purpose = _('Purpose')
d_purpose_eg = _('Graduation Project')
d_src_s = _('Source')
d_src_s_eg = _('Experiment')
d_src_r = _('Reference')
d_src_r_eg = 'Miller D. Material culture and mass consumption[J]. 1987.'
d_src_p = _('Project')
d_src_p_eg = _('National Key R&D Program of China (2016YFB0700500)')
d_src_o = _('Others')
d_src_o_eg = _('Material area...')
