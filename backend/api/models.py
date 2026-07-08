from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.utils import timezone

class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('The Email field must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        if password:
            user.set_password(password)
        else:
            user.set_unusable_password()
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('role', 'ADMINISTRATOR')
        extra_fields.setdefault('status', 'ACTIVE')
        return self.create_user(email, password, **extra_fields)

class User(AbstractUser):
    username = None
    email = models.EmailField(unique=True, primary_key=True)
    phone = models.CharField(max_length=20, blank=True, default='')
    role = models.CharField(
        max_length=20,
        choices=[
            ('GUEST', 'GUEST'),
            ('JOB_SEEKER', 'JOB_SEEKER'),
            ('RECRUITER', 'RECRUITER'),
            ('ADMINISTRATOR', 'ADMINISTRATOR')
        ],
        default='GUEST'
    )
    status = models.CharField(
        max_length=20,
        choices=[
            ('ACTIVE', 'ACTIVE'),
            ('PENDING', 'PENDING'),
            ('BLOCKED', 'BLOCKED')
        ],
        default='ACTIVE'
    )
    name = models.CharField(max_length=255)
    failed_attempts = models.IntegerField(default=0)
    is_locked = models.BooleanField(default=False)
    lockout_until = models.DateTimeField(null=True, blank=True)
    otp_secret = models.CharField(max_length=10, null=True, blank=True)
    otp_verified = models.BooleanField(default=False)
    temp_password = models.CharField(max_length=255, null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['name']

    objects = CustomUserManager()

    def __str__(self):
        return f"{self.name} ({self.email})"

class Employer(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True, related_name='employer_profile')
    company_name = models.CharField(max_length=255)
    industry = models.CharField(max_length=255, blank=True, default='')
    location = models.CharField(max_length=255, blank=True, default='')
    employees = models.CharField(max_length=50, blank=True, default='')
    rating = models.FloatField(default=5.0)
    response_rate = models.CharField(max_length=10, default='100%')
    about = models.TextField(blank=True, default='')
    website = models.URLField(blank=True, default='')
    status = models.CharField(
        max_length=20,
        choices=[
            ('PENDING', 'PENDING'),
            ('APPROVED', 'APPROVED'),
            ('REJECTED', 'REJECTED')
        ],
        default='PENDING'
    )
    logo = models.CharField(max_length=500, blank=True, default='')
    verified_at = models.DateTimeField(null=True, blank=True)
    verified_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='verified_employers')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    soft_deleted = models.BooleanField(default=False)

    def __str__(self):
        return self.company_name

class Job(models.Model):
    id = models.CharField(max_length=100, primary_key=True)
    company = models.ForeignKey(Employer, on_delete=models.CASCADE, related_name='jobs')
    title = models.CharField(max_length=255)
    location = models.CharField(max_length=255)
    work_mode = models.CharField(
        max_length=20,
        choices=[
            ('remote', 'remote'),
            ('hybrid', 'hybrid'),
            ('onsite', 'onsite')
        ],
        default='hybrid'
    )
    experience_range = models.CharField(max_length=50, default='0-2 Yrs')
    salary_range = models.CharField(max_length=50, default='Negotiable')
    tags = models.JSONField(default=list)
    description = models.TextField()
    status = models.CharField(
        max_length=20,
        choices=[
            ('DRAFT', 'DRAFT'),
            ('PUBLISHED', 'PUBLISHED'),
            ('CLOSED', 'CLOSED')
        ],
        default='PUBLISHED'
    )
    posted_date = models.DateField(default=timezone.localdate)
    deadline = models.DateField(null=True, blank=True)
    applicants_count = models.IntegerField(default=0)
    featured = models.BooleanField(default=False)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='created_jobs')
    updated_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='updated_jobs')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    soft_deleted = models.BooleanField(default=False)

    def __str__(self):
        return self.title

class Candidate(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True, related_name='candidate_profile')
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100, blank=True, default='')
    phone = models.CharField(max_length=20, blank=True, default='')
    current_status = models.CharField(max_length=100, default='Fresher')
    experience = models.CharField(max_length=50, default='0')
    current_city = models.CharField(max_length=100, default='Bengaluru')
    preferred_location = models.CharField(max_length=255, default='Bengaluru')
    expected_salary = models.CharField(max_length=50, default='6 LPA')
    current_salary = models.CharField(max_length=50, default='0 LPA')
    remote_preference = models.CharField(
        max_length=20,
        choices=[
            ('Remote', 'Remote'),
            ('Hybrid', 'Hybrid'),
            ('Onsite', 'Onsite')
        ],
        default='Hybrid'
    )
    availability = models.CharField(max_length=100, default='Immediate')
    preferred_roles = models.JSONField(default=list)
    preferred_industries = models.CharField(max_length=255, default='Information Technology')
    employment_type = models.CharField(max_length=100, default='Full-time')
    work_mode = models.CharField(max_length=50, default='Hybrid')
    notice_period = models.CharField(max_length=100, default='Immediate')
    open_to_work = models.BooleanField(default=True)
    profile_strength = models.IntegerField(default=40)
    resume_score = models.IntegerField(default=0)
    education = models.JSONField(default=list)
    experience_history = models.JSONField(default=list)
    skills = models.JSONField(default=list)
    projects = models.TextField(blank=True, default='')
    certifications = models.TextField(blank=True, default='')
    languages = models.CharField(max_length=255, default='English')
    bio = models.TextField(blank=True, default='')
    state = models.CharField(max_length=100, blank=True, default='Telangana')
    country = models.CharField(max_length=100, blank=True, default='India')
    linkedin = models.CharField(max_length=255, blank=True, default='')
    portfolio = models.CharField(max_length=255, blank=True, default='')
    saved_jobs = models.ManyToManyField(Job, blank=True, related_name='saved_by_candidates')
    recent_searches = models.JSONField(default=list)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    soft_deleted = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.first_name} {self.last_name}"

class Application(models.Model):
    id = models.CharField(max_length=100, primary_key=True)
    job = models.ForeignKey(Job, on_delete=models.CASCADE, related_name='applications')
    candidate = models.ForeignKey(Candidate, on_delete=models.CASCADE, related_name='applications')
    status = models.CharField(
        max_length=50,
        choices=[
            ('Applied', 'Applied'),
            ('Screening', 'Screening'),
            ('Shortlisted', 'Shortlisted'),
            ('Interview', 'Interview'),
            ('HR', 'HR'),
            ('Offer', 'Offer'),
            ('Rejected', 'Rejected'),
            ('Accepted', 'Accepted'),
            ('Joined', 'Joined')
        ],
        default='Applied'
    )
    applied_date = models.DateField(default=timezone.localdate)
    resume_url = models.CharField(max_length=500, default='Standard Digital Resume')
    resume_score = models.IntegerField(default=75)
    timeline = models.JSONField(default=list)
    notes = models.TextField(blank=True, default='')
    interview_notes = models.TextField(blank=True, default='')
    interview_schedule = models.CharField(max_length=255, blank=True, default='')
    candidate_score = models.IntegerField(null=True, blank=True)
    ranking_score = models.IntegerField(default=75)
    soft_deleted = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='created_applications')
    updated_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='updated_applications')

    def __str__(self):
        return f"{self.candidate} -> {self.job}"

class Interview(models.Model):
    id = models.CharField(max_length=100, primary_key=True)
    application = models.ForeignKey(Application, on_delete=models.CASCADE, related_name='interviews')
    title = models.CharField(max_length=255)
    scheduled_at = models.DateTimeField()
    link = models.CharField(max_length=500, blank=True, default='')
    notes = models.TextField(blank=True, default='')
    status = models.CharField(
        max_length=20,
        choices=[
            ('SCHEDULED', 'SCHEDULED'),
            ('COMPLETED', 'COMPLETED'),
            ('CANCELLED', 'CANCELLED')
        ],
        default='SCHEDULED'
    )
    feedback = models.TextField(blank=True, default='')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title

class SystemLog(models.Model):
    id = models.CharField(max_length=100, primary_key=True)
    timestamp = models.DateTimeField(default=timezone.now)
    type = models.CharField(
        max_length=20,
        choices=[
            ('AUTH', 'AUTH'),
            ('SECURITY', 'SECURITY'),
            ('AUDIT', 'AUDIT'),
            ('AI', 'AI')
        ]
    )
    message = models.TextField()
    email = models.CharField(max_length=255, null=True, blank=True)

    def __str__(self):
        return f"[{self.type}] {self.message}"


class SubscriptionPlan(models.Model):
    id = models.CharField(max_length=100, primary_key=True)
    name = models.CharField(max_length=255)
    price = models.CharField(max_length=100)
    period = models.CharField(max_length=50, default='Monthly')
    users_count = models.IntegerField(default=0)
    status = models.CharField(max_length=20, default='Active')

    def __str__(self):
        return self.name


class Coupon(models.Model):
    code = models.CharField(max_length=100, primary_key=True)
    discount = models.CharField(max_length=100)
    type = models.CharField(max_length=50, default='Percentage')
    usage = models.IntegerField(default=0)
    status = models.CharField(max_length=20, default='Active')

    def __str__(self):
        return self.code


class Notification(models.Model):
    id = models.CharField(max_length=100, primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notifications')
    title = models.CharField(max_length=255)
    message = models.TextField()
    read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.email} - {self.title}"

