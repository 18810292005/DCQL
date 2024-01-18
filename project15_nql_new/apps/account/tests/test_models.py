from django.test import TestCase
from apps.account.models.users import User, UserRolesForAcceptanceModel, UserRolesForAcceptance
from mgedata.test.utils.instances import user_create, instance


class UserRolesForAcceptanceModelTest(TestCase):

    def setUp(self) -> None:
        self.user1 = User.objects.create(
            username='test1',
            password='test1_password',
            real_name='test1_real_name',
            email='test1@test.com',
        )
        self.user2 = User.objects.create(
            username='test2',
            password='test2_password',
            real_name='test2_real_name',
            email='test2@test.com',
        )
        self.urfa1 = UserRolesForAcceptanceModel.objects.create(
            user=self.user1,
            roles=[UserRolesForAcceptance.AcceptanceExpert, UserRolesForAcceptance.Member]
        )
        self.urfa2 = UserRolesForAcceptanceModel.objects.create(
            user=self.user2,
            roles=[UserRolesForAcceptance.AcceptanceExpert, UserRolesForAcceptance.GroupLeader]
        )

    def test_get_roles_good(self):
        self.assertEqual(self.urfa1.get_roles, [UserRolesForAcceptance.AcceptanceExpert, UserRolesForAcceptance.Member])

    def test_has_role_good(self):
        self.assertEqual(self.urfa1.has_role(UserRolesForAcceptance.GroupLeader), False)
        self.assertEqual(self.urfa2.has_role(UserRolesForAcceptance.GroupLeader), True)

    def test_get_all_acceptance_experts_good(self):
        self.assertEqual(UserRolesForAcceptanceModel.get_all_acceptance_experts(), [self.user1, self.user2])


class GetOrMakeForSsoTest(TestCase):

    @instance
    def setUp(self) -> None:
        self.user = user_create()
        self.user_make1 = User.get_or_make_for_sso(
            username='test',
            email=self.user.email,
            institution=""
        )
        self.user_make2 = User.get_or_make_for_sso(
            username='test',
            email='12345@123.com',
            institution="institution1",
        )

    def test_good(self):
        self.assertEqual(User.objects.count(), 2)
        # self.assertEqual(User.objects.all()[1].real_name, 'test')
        # self.assertEqual(User.objects.all()[1].username, 'test0')
        # self.assertEqual(User.objects.all()[1].institution, 'institution1')
        self.assertEqual(self.user_make2.institution, 'institution1')
        self.assertEqual(self.user, self.user_make1)
