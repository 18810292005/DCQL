from rest_framework.permissions import BasePermission
from apps.account.models.users import UserRole


class IsUploadOwner(BasePermission):

    def has_permission(self, request, view):
        return request.user.is_authenticated

    def has_object_permission(self, request, view, obj):
        return obj.user == request.user or request.user.has_role(UserRole.DATA_ADMIN)
