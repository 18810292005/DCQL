# -*- coding: utf-8 -*-

# @File   : urls.py
# @Author : Yuvv
# @Date   : 2018/6/1


from .views import SSOServer

sso_server = SSOServer()

urlpatterns = sso_server.get_urls()
