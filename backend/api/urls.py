from django.urls import path
from api import views

urlpatterns = [
    # Auth
    path('auth/register', views.register_user, name='register'),
    path('auth/login', views.login_user, name='login'),
    path('auth/forgot-password', views.forgot_password, name='forgot_password'),
    path('auth/reset-password', views.reset_password, name='reset_password'),
    
    # Jobs
    path('jobs', views.jobs_list_create, name='jobs_list_create'),
    path('jobs/<str:pk>', views.job_detail, name='job_detail'),
    
    # Profile
    path('profile/me', views.profile_me, name='profile_me'),
    path('profile/update', views.profile_update, name='profile_update'),
    path('profile/bookmark/<str:jobId>', views.bookmark_job, name='bookmark_job'),
    
    # Applications
    path('applications/apply', views.apply_job, name='apply_job'),
    path('applications', views.applications_list, name='applications_list'),
    path('applications/<str:pk>/status', views.update_application_status, name='update_application_status'),
    
    # Admin
    path('admin/verifications', views.admin_verifications, name='admin_verifications'),
    path('admin/verifications/<str:userId>/action', views.admin_verification_action, name='admin_verification_action'),
    path('admin/logs', views.admin_logs, name='admin_logs'),
    path('admin/analytics', views.admin_analytics, name='admin_analytics'),
    path('admin/users', views.admin_users, name='admin_users'),
    path('admin/users/<str:email>/toggle-block', views.admin_toggle_block, name='admin_toggle_block'),
    path('admin/users/<str:email>/delete', views.admin_user_delete, name='admin_user_delete'),
    path('admin/companies', views.admin_companies, name='admin_companies'),
    path('admin/companies/<str:email>', views.admin_company_detail, name='admin_company_detail'),
    
    # Subscription Plans & Coupons
    path('admin/plans', views.admin_plans, name='admin_plans'),
    path('admin/plans/<str:pk>', views.admin_plan_detail, name='admin_plan_detail'),
    path('admin/coupons', views.admin_coupons, name='admin_coupons'),
    path('admin/coupons/<str:code>', views.admin_coupon_detail, name='admin_coupon_detail'),

    # Notifications
    path('notifications', views.user_notifications, name='user_notifications'),
    path('notifications/<str:pk>', views.user_notifications, name='user_notification_action'),

    # Companies
    path('companies', views.public_companies, name='public_companies'),

    # Gemini
    path('gemini/analyze', views.gemini_analyze, name='gemini_analyze'),

    # Copilot
    path('copilot/dashboard', views.copilot_dashboard, name='copilot_dashboard'),
    path('copilot/conversations', views.copilot_conversations, name='copilot_conversations'),
    path('copilot/conversations/<str:pk>', views.copilot_conversation_detail, name='copilot_conversation_detail'),
    path('copilot/resume/analyze', views.copilot_resume_analyze, name='copilot_resume_analyze'),
    path('copilot/resume/optimize', views.copilot_resume_optimize, name='copilot_resume_optimize'),
    path('copilot/cover-letter', views.copilot_cover_letter, name='copilot_cover_letter'),
    path('copilot/roadmap', views.copilot_roadmap, name='copilot_roadmap'),
    path('copilot/skill-gap', views.copilot_skill_gap, name='copilot_skill_gap'),
    path('copilot/learning', views.copilot_learning, name='copilot_learning'),
    path('copilot/salary', views.copilot_salary_prediction, name='copilot_salary_prediction'),
    path('copilot/interview/questions', views.copilot_interview_questions, name='copilot_interview_questions'),
    path('copilot/interview/<str:session_id>/evaluate', views.copilot_interview_evaluate, name='copilot_interview_evaluate'),
    path('copilot/interview/history', views.copilot_interview_history, name='copilot_interview_history'),
    path('copilot/job-match', views.copilot_job_match, name='copilot_job_match'),
    path('copilot/company-insight', views.copilot_company_insight, name='copilot_company_insight'),
    path('copilot/strategy', views.copilot_application_strategy, name='copilot_application_strategy'),
    path('copilot/analytics', views.copilot_analytics, name='copilot_analytics'),
    path('copilot/memory', views.copilot_memory, name='copilot_memory'),
]
