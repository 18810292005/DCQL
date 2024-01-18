from django.urls import path
from django.views.generic import TemplateView

from .views import certificate_pdf, evaluation_pdf, external_to_pdf

urlpatterns = [
    path('external_pdf', external_to_pdf),
    path('<key>/pdf', certificate_pdf, name='certificate_pdf'),
    path('<key>/evaluation_pdf', evaluation_pdf, name='evaluation_pdf'),
    path('<key>', TemplateView.as_view(template_name='certificate.html'), name='show_certificate'),
]
