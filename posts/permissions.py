from rest_framework import permissions


class IsAuthorOfPost(permissions.BasePermission):
    def has_object_permissions(self, request, view, post):
        if request.user:
            return post.author == request.user
        return False