from apps.account.models.users import *
from django.contrib.auth.hashers import make_password
from mgedata.test.utils.instances.instances import INSTANCES


def user_create():
    if "user" in INSTANCES:
        return INSTANCES[INSTANCES.index("user") + 1]
    user = User(
        username='test',
        real_name='testReal',
        email='123@123.com',
        password=make_password('123456')
    )
    user.save()
    user.password = '123456'
    INSTANCES.extend(["user", user])
    return user


def loginHistory_create():
    if "loginHistory" in INSTANCES:
        return INSTANCES[INSTANCES.index("loginHistory") + 1]
    user = user_create()
    loginHistory = LoginHistory(
        username=user,
        # login_time= models.DateTimeField(auto_now_add=True)
        ip='192.168.100.100'
    )
    loginHistory.save()
    INSTANCES.extend(["loginHistory", loginHistory])
    return loginHistory


def adminMaterialCategory_create():
    if "authorityOfPrivateMaterialCategory" in INSTANCES:
        return INSTANCES[INSTANCES.index("authorityOfPrivateMaterialCategory") + 1]
    user = user_create()
    authorityOfPrivateMaterialCategory = AuthorityOfPrivateMaterialCategory(
        user=user,
        # category = models.ForeignKey(to='storage.MaterialCategory', on_delete=models.CASCADE)
        timestamp=models.DateTimeField(auto_now_add=True)
    )
    authorityOfPrivateMaterialCategory.save()
    INSTANCES.extend(["authorityOfPrivateMaterialCategory", authorityOfPrivateMaterialCategory])
    return authorityOfPrivateMaterialCategory, user

#
# def tokenInformation_create():
#     if "tokenInformation" in INSTANCES:
#         return INSTANCES[INSTANCES.index("tokenInformation") + 1]
#     tokenInformation = TokenInformation(
#         token='models.CharField(max_length=500)'
#     )
#     tokenInformation.save()
#     INSTANCES.extend(["tokenInformation", tokenInformation])
#     return tokenInformation
