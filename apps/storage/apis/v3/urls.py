from rest_framework.routers import SimpleRouter

from .template import TemplateViewSet, SnippetViewSet

router = SimpleRouter(trailing_slash=False)
router.register(r'templates', TemplateViewSet, basename='templates')
router.register(r'snippets', SnippetViewSet, basename='snippets')

urlpatterns = router.urls
