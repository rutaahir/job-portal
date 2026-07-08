from rest_framework import serializers
from api.models import User, Employer, Candidate, Job, Application, Interview, SystemLog, SubscriptionPlan, Coupon, Notification

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['email', 'phone', 'role', 'status', 'name']

class EmployerSerializer(serializers.ModelSerializer):
    companyName = serializers.CharField(source='company_name')
    responseRate = serializers.CharField(source='response_rate')
    verifiedAt = serializers.DateTimeField(source='verified_at', read_only=True)
    verifiedBy = serializers.EmailField(source='verified_by.email', read_only=True)
    email = serializers.EmailField(source='user.email', read_only=True)

    class Meta:
        model = Employer
        fields = [
            'companyName', 'industry', 'location', 'employees', 'rating',
            'responseRate', 'about', 'website', 'status', 'logo',
            'verifiedAt', 'verifiedBy', 'email'
        ]

class JobSerializer(serializers.ModelSerializer):
    companyId = serializers.EmailField(source='company.user.email', read_only=True)
    companyName = serializers.CharField(source='company.company_name', read_only=True)
    companyLogo = serializers.CharField(source='company.logo', read_only=True)
    experienceRange = serializers.CharField(source='experience_range')
    salaryRange = serializers.CharField(source='salary_range')
    workMode = serializers.CharField(source='work_mode')
    postedDate = serializers.DateField(source='posted_date')
    applicantsCount = serializers.IntegerField(source='applicants_count', read_only=True)

    class Meta:
        model = Job
        fields = [
            'id', 'companyId', 'companyName', 'companyLogo', 'title', 'location',
            'workMode', 'experienceRange', 'salaryRange', 'tags', 'description',
            'postedDate', 'applicantsCount', 'featured', 'status', 'deadline'
        ]

class CandidateSerializer(serializers.ModelSerializer):
    id = serializers.EmailField(source='user.email', read_only=True)
    name = serializers.SerializerMethodField()
    firstName = serializers.CharField(source='first_name')
    lastName = serializers.CharField(source='last_name')
    currentStatus = serializers.CharField(source='current_status')
    currentCity = serializers.CharField(source='current_city')
    preferredLocation = serializers.CharField(source='preferred_location')
    expectedSalary = serializers.CharField(source='expected_salary')
    currentSalary = serializers.CharField(source='current_salary')
    remotePreference = serializers.CharField(source='remote_preference')
    preferredRoles = serializers.JSONField(source='preferred_roles')
    preferredIndustries = serializers.CharField(source='preferred_industries')
    employmentType = serializers.CharField(source='employment_type')
    workMode = serializers.CharField(source='work_mode')
    noticePeriod = serializers.CharField(source='notice_period')
    openToWork = serializers.BooleanField(source='open_to_work')
    profileStrength = serializers.IntegerField(source='profile_strength')
    resumeScore = serializers.IntegerField(source='resume_score')
    experienceHistory = serializers.JSONField(source='experience_history')
    recentSearches = serializers.JSONField(source='recent_searches')
    savedJobs = serializers.PrimaryKeyRelatedField(many=True, read_only=True)

    class Meta:
        model = Candidate
        fields = [
            'id', 'name', 'firstName', 'lastName', 'phone', 'currentStatus',
            'experience', 'currentCity', 'preferredLocation', 'expectedSalary',
            'currentSalary', 'remotePreference', 'availability', 'preferredRoles',
            'preferredIndustries', 'employmentType', 'workMode', 'noticePeriod',
            'openToWork', 'profileStrength', 'resumeScore', 'education',
            'experienceHistory', 'skills', 'projects', 'certifications',
            'languages', 'bio', 'savedJobs', 'recentSearches',
            'state', 'country', 'linkedin', 'portfolio'
        ]

    def get_name(self, obj):
        return f"{obj.first_name} {obj.last_name}".strip()

class ApplicationSerializer(serializers.ModelSerializer):
    jobId = serializers.CharField(source='job.id', read_only=True)
    candidateId = serializers.EmailField(source='candidate.user.email', read_only=True)
    appliedDate = serializers.DateField(source='applied_date', read_only=True)
    resumeUrl = serializers.CharField(source='resume_url')
    resumeScore = serializers.IntegerField(source='resume_score')
    interviewNotes = serializers.CharField(source='interview_notes')
    interviewSchedule = serializers.CharField(source='interview_schedule')
    candidateScore = serializers.IntegerField(source='candidate_score', required=False, allow_null=True)
    rankingScore = serializers.IntegerField(source='ranking_score')
    job = JobSerializer(read_only=True)
    candidate = CandidateSerializer(read_only=True)

    class Meta:
        model = Application
        fields = [
            'id', 'jobId', 'candidateId', 'status', 'appliedDate', 'resumeUrl',
            'resumeScore', 'timeline', 'notes', 'interviewNotes', 'interviewSchedule',
            'candidateScore', 'rankingScore', 'job', 'candidate'
        ]

class InterviewSerializer(serializers.ModelSerializer):
    applicationId = serializers.CharField(source='application.id')
    scheduledAt = serializers.DateTimeField(source='scheduled_at')

    class Meta:
        model = Interview
        fields = [
            'id', 'applicationId', 'title', 'scheduledAt', 'link', 'notes',
            'status', 'feedback'
        ]

class SystemLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = SystemLog
        fields = ['id', 'timestamp', 'type', 'message', 'email']

class SubscriptionPlanSerializer(serializers.ModelSerializer):
    class Meta:
        model = SubscriptionPlan
        fields = ['id', 'name', 'price', 'period', 'users_count', 'status']

class CouponSerializer(serializers.ModelSerializer):
    class Meta:
        model = Coupon
        fields = ['code', 'discount', 'type', 'usage', 'status']


class NotificationSerializer(serializers.ModelSerializer):
    createdAt = serializers.DateTimeField(source='created_at', read_only=True)

    class Meta:
        model = Notification
        fields = ['id', 'title', 'message', 'read', 'createdAt']

