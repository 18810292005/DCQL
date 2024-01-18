from django.urls import path
from apps.certificate.apis.acceptance import one_dispatch, get_acceptance_data, get_acceptance_data_filter
from apps.certificate.apis.evaluation import make_evaluation, dispatches, evaluation_points, evaluation_results, \
    get_evaluation_data_filter
from apps.certificate.apis.acceptance import (acceptances_view, get_all_acceptance_experts,
                                              one_acceptance, get_all_leaders)
from apps.certificate.apis.certificate import certificates, verify_certificate, download_data, statistics_for_nmdms, \
    statistics_for_nmdms_full
from apps.certificate.apis.template_recommend import (template_list,
                                                      template_recommend,
                                                      score_of_template,
                                                      can_go_next_or_not,
                                                      expert_avg_score,
                                                      user_template_score
                                                      )

urlpatterns = [
    path('certificates/', certificates, name='certificates'),
    path('certificates/<str:key>', verify_certificate, name='verify_certificate'),
    path('certificates/<str:key>/data', download_data, name='download_data'),
    path('evaluations/', make_evaluation, name='make_evaluation'),
    path('evaluations/filter', get_evaluation_data_filter, name='check_data'),
    path('evaluations/points', evaluation_points, name='evaluation_points'),
    path('evaluations/<int:acceptance_id>', evaluation_results, name='evaluation_results'),
    path('acceptances/', acceptances_view, name='acceptances'),
    path('acceptances/data', get_acceptance_data, name='acceptances'),
    path('acceptances/filter', get_acceptance_data_filter, name='check_data'),
    # path('acceptances/<int:acceptance_id>/signatures', acceptance_signatures, name='acceptance_signatures'),
    path('acceptances/<int:acceptance_id>/', one_acceptance, name='retract_acceptance'),
    path('dispatches', dispatches, name='dispatches'),
    path('dispatches/<int:acceptance_id>', one_dispatch, name='one_dispatch'),
    path('experts', get_all_acceptance_experts, name='get_all_acceptance_experts'),
    path('groupleaders/', get_all_leaders, name='get_all_leaders'),
    path('nmdms/<str:ps_id>/', statistics_for_nmdms, name='statistics_for_nmdms'),
    path('nmdms_stats/<str:ps_id>/', statistics_for_nmdms_full, name='statistics_for_nmdms_full'),
    path('templates', template_list, name='template_list'),
    path('templates/score', template_recommend, name='template_recommend'),
    path('templates/view_score/<int:template_id>', score_of_template, name='score_of_template'),
    path('templates/go_next_or_not/<int:acceptance_id>', can_go_next_or_not, name='can_go_next_or_not'),
    path('templates/expert_avg_score/<int:acceptance_id>', expert_avg_score, name='expert_avg_score'),
    path('templates/user_template_score/<int:template_id>', user_template_score, name='user_template_score')
]
