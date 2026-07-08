from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
from django.core.paginator import Paginator
from django.db.models import Q
from api.auth import SimpleEmailAuthentication
from api.models import User, Candidate, Employer, Job, Application, Interview, SystemLog, SubscriptionPlan, Coupon, Notification
from api.serializers import (
    UserSerializer, EmployerSerializer, CandidateSerializer,
    JobSerializer, ApplicationSerializer, SystemLogSerializer,
    SubscriptionPlanSerializer, CouponSerializer, NotificationSerializer
)
import datetime
import time
import os
import json
import random
from google import genai

# Helper for adding system logs
def add_system_log(log_type, message, email=None):
    log_id = f"log-{int(time.time() * 1000)}"
    return SystemLog.objects.create(
        id=log_id,
        type=log_type,
        message=message,
        email=email
    )

# ----------------- 1. AUTHENTICATION REST ENDPOINTS -----------------

@api_view(['POST'])
@authentication_classes([])
@permission_classes([])
def register_user(request):
    try:
        data = request.data
        email = data.get('email')
        password = data.get('password')
        role = data.get('role')
        name = data.get('name')
        phone = data.get('phone', '')
        details = data.get('details', {})

        if not email or not password or not role or not name:
            return Response(
                {'error': 'All core registration attributes (email, password, role, name) are required.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        if User.objects.filter(email__iexact=email).exists():
            return Response(
                {'error': 'An account with this email identifier is already registered.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        user_status = 'PENDING' if role == 'RECRUITER' else 'ACTIVE'
        
        user = User.objects.create(
            email=email,
            phone=phone,
            role=role,
            status=user_status,
            name=name,
            otp_verified=False,
            temp_password=password
        )
        user.set_password(password)
        user.save()

        if role == 'JOB_SEEKER':
            name_parts = name.split(' ')
            first_name = name_parts[0] if name_parts else name
            last_name = ' '.join(name_parts[1:]) if len(name_parts) > 1 else ''
            
            Candidate.objects.create(
                user=user,
                first_name=first_name,
                last_name=last_name,
                phone=phone,
                current_status='Fresher',
                experience='0',
                current_city=details.get('city', 'Bengaluru'),
                preferred_location='Bengaluru',
                expected_salary='6 LPA',
                current_salary='0 LPA',
                remote_preference='Hybrid',
                availability='Immediate',
                preferred_roles=[details.get('role', 'Software Engineer')],
                preferred_industries='Information Technology',
                employment_type='Full-time',
                work_mode='Hybrid',
                notice_period='Immediate',
                open_to_work=True,
                profile_strength=40,
                resume_score=0,
                education=details.get('education', ''),
                skills=details.get('skills', []),
                bio=''
            )
            add_system_log('AUTH', f"New candidate registration completed: {email}", email)
        
        elif role == 'RECRUITER':
            Employer.objects.create(
                user=user,
                company_name=details.get('companyName', f"{name} Enterprises"),
                industry=details.get('industry', 'Technology'),
                location=details.get('location', 'Bengaluru'),
                employees='10-50',
                rating=5.0,
                response_rate='100%',
                about=details.get('about', 'Enterprising high-growth organization.'),
                website=details.get('website', 'https://technoadviser.com'),
                status='PENDING',
                logo='https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=150'
            )
            add_system_log('AUTH', f"New employer company registration pending administrative review: {email}", email)

        return Response({
            'message': 'Registration transaction committed successfully.',
            'status': user.status,
            'email': user.email,
            'name': user.name,
            'role': user.role
        }, status=status.HTTP_201_CREATED)

    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@authentication_classes([])
@permission_classes([])
def login_user(request):
    try:
        data = request.data
        email = data.get('email')
        password = data.get('password')

        if not email or not password:
            return Response(
                {'error': 'Email and password fields must not be empty.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            user = User.objects.get(email__iexact=email)
        except User.DoesNotExist:
            add_system_log('SECURITY', f"Failed login attempt for non-existent identifier: {email}")
            return Response(
                {'error': 'Invalid authentication credentials.'},
                status=status.HTTP_401_UNAUTHORIZED
            )

        # Lockout verification
        if user.is_locked and user.lockout_until:
            if timezone.now() < user.lockout_until:
                return Response(
                    {'error': 'Account locked due to repetitive failures. Try again in 5 minutes.'},
                    status=status.HTTP_403_FORBIDDEN
                )
            else:
                user.is_locked = False
                user.failed_attempts = 0
                user.lockout_until = None
                user.save()

        # Verify Password
        if not user.check_password(password):
            user.failed_attempts += 1
            if user.failed_attempts >= 5:
                user.is_locked = True
                user.lockout_until = timezone.now() + datetime.timedelta(minutes=5)
            user.save()

            add_system_log('SECURITY', f"Incorrect password attempt ({user.failed_attempts}/5) for user: {email}", email)

            if user.is_locked:
                return Response(
                    {'error': 'Account has been locked for 5 minutes due to consecutive authentication errors.'},
                    status=status.HTTP_403_FORBIDDEN
                )
            return Response(
                {'error': f"Invalid credentials. Attempt {user.failed_attempts} of 5 before administrative lockout."},
                status=status.HTTP_401_UNAUTHORIZED
            )

        # Check status
        if user.status == 'BLOCKED':
            return Response(
                {'error': 'This user account is administratively blocked.'},
                status=status.HTTP_403_FORBIDDEN
            )

        if user.role == 'RECRUITER' and user.status == 'PENDING':
            return Response(
                {'error': 'Your recruiter profile verification is pending admin approval.'},
                status=status.HTTP_403_FORBIDDEN
            )

        if user.role == 'RECRUITER' and user.status == 'REJECTED':
            return Response(
                {'error': 'Your recruiter profile verification has been rejected. Please contact customer support.'},
                status=status.HTTP_403_FORBIDDEN
            )

        user.failed_attempts = 0
        user.is_locked = False
        user.lockout_until = None
        user.save()

        add_system_log('AUTH', f"Successful login transaction for user: {email}", email)

        return Response({
            'token': user.email, # email is the simple Bearer token
            'user': {
                'email': user.email,
                'name': user.name,
                'role': user.role,
                'status': user.status
            }
        }, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@authentication_classes([])
@permission_classes([])
def forgot_password(request):
    try:
        email = request.data.get('email')
        if not email:
            return Response({'error': 'Email is required.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(email__iexact=email)
        except User.DoesNotExist:
            return Response(
                {'error': 'No account matching this email address was discovered.'},
                status=status.HTTP_404_NOT_FOUND
            )

        otp = str(random.randint(100000, 999999))
        user.otp_secret = otp
        user.save()

        # Print OTP to terminal as requested
        print("\n" + "="*50)
        print(f" OTP GENERATED FOR: {email}")
        print(f" SECURITY VERIFICATION CODE: {otp}")
        print("="*50 + "\n")

        add_system_log('AUTH', f"Password recovery OTP dispatched for user: {email}", email)

        return Response({
            'message': 'One-Time Password (OTP) generated. Check terminal console or simulation logs.',
            'otp': otp
        }, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@authentication_classes([])
@permission_classes([])
def reset_password(request):
    try:
        data = request.data
        email = data.get('email')
        otp = data.get('otp')
        password = data.get('password')

        if not email or not otp or not password:
            return Response({'error': 'Email, OTP, and password are required.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(email__iexact=email)
        except User.DoesNotExist:
            return Response({'error': 'Invalid verification token or OTP sequence.'}, status=status.HTTP_400_BAD_REQUEST)

        if user.otp_secret != otp:
            return Response({'error': 'Invalid verification token or OTP sequence.'}, status=status.HTTP_400_BAD_REQUEST)

        user.set_password(password)
        user.otp_secret = None
        user.failed_attempts = 0
        user.is_locked = False
        user.lockout_until = None
        user.save()

        add_system_log('AUTH', f"Password reset committed successfully for user: {email}", email)

        return Response({'message': 'Password has been updated successfully.'}, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# ----------------- 2. JOBS ENDPOINTS -----------------

@api_view(['GET', 'POST'])
@authentication_classes([SimpleEmailAuthentication])
@permission_classes([])
def jobs_list_create(request):
    if request.method == 'GET':
        try:
            q = request.query_params.get('q')
            work_mode = request.query_params.get('workMode')
            location = request.query_params.get('location')
            company_id = request.query_params.get('companyId')
            sort = request.query_params.get('sort')
            page = int(request.query_params.get('page', 1))
            limit = int(request.query_params.get('limit', 10))

            jobs_qs = Job.objects.filter(soft_deleted=False)

            if company_id:
                jobs_qs = jobs_qs.filter(company__user__email__iexact=company_id)
            else:
                jobs_qs = jobs_qs.filter(status='PUBLISHED')

            if q:
                jobs_qs = jobs_qs.filter(
                    Q(title__icontains=q) |
                    Q(description__icontains=q) |
                    Q(tags__icontains=q) # SQLite JSON search fallback: icontains is fine for search
                )

            if work_mode:
                jobs_qs = jobs_qs.filter(work_mode__iexact=work_mode)

            if location:
                jobs_qs = jobs_qs.filter(location__icontains=location)

            if sort == 'oldest':
                jobs_qs = jobs_qs.order_by('posted_date', 'id')
            else:
                # default: newest
                jobs_qs = jobs_qs.order_by('-posted_date', '-id')

            paginator = Paginator(jobs_qs, limit)
            paged_jobs = paginator.get_page(page)

            serializer = JobSerializer(paged_jobs, many=True)

            return Response({
                'jobs': serializer.data,
                'totalCount': jobs_qs.count(),
                'page': page,
                'totalPages': paginator.num_pages
            }, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    elif request.method == 'POST':
        # Create Job vacancy
        if not request.user or not request.user.is_authenticated:
            return Response({'detail': 'Authentication credentials were not provided.'}, status=status.HTTP_401_UNAUTHORIZED)
        
        if request.user.role not in ['RECRUITER', 'ADMINISTRATOR']:
            return Response({'error': 'Forbidden: Restricted to roles [RECRUITER, ADMINISTRATOR]'}, status=status.HTTP_403_FORBIDDEN)

        try:
            data = request.data
            title = data.get('title')
            location = data.get('location')
            description = data.get('description')
            work_mode = data.get('workMode', 'hybrid')
            experience_range = data.get('experienceRange', '0-2 Yrs')
            salary_range = data.get('salaryRange', 'Negotiable')
            tags = data.get('tags', [])
            job_status = data.get('status', 'PUBLISHED')
            deadline_str = data.get('deadline')

            if not title or not location or not description:
                return Response(
                    {'error': 'Job title, location and description parameters are required.'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Get employer profile
            try:
                employer = Employer.objects.get(user=request.user)
            except Employer.DoesNotExist:
                return Response({'error': 'Employer profile not initialized.'}, status=status.HTTP_400_BAD_REQUEST)

            job_id = f"job-{int(time.time() * 1000)}"
            
            deadline = None
            if deadline_str:
                try:
                    deadline = datetime.datetime.strptime(deadline_str, "%Y-%m-%d").date()
                except ValueError:
                    pass
            if not deadline:
                deadline = (timezone.now() + datetime.timedelta(days=30)).date()

            job = Job.objects.create(
                id=job_id,
                company=employer,
                title=title,
                location=location,
                work_mode=work_mode,
                experience_range=experience_range,
                salary_range=salary_range,
                tags=tags,
                description=description,
                status=job_status,
                deadline=deadline,
                created_by=request.user
            )

            add_system_log('AUDIT', f"New vacancy posted: {title} at {employer.company_name}", request.user.email)

            serializer = JobSerializer(job)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET', 'PUT', 'DELETE'])
@authentication_classes([SimpleEmailAuthentication])
@permission_classes([])
def job_detail(request, pk):
    try:
        job = Job.objects.get(id=pk, soft_deleted=False)
    except Job.DoesNotExist:
        return Response({'error': 'Specified job vacancy not found.'}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = JobSerializer(job)
        return Response(serializer.data, status=status.HTTP_200_OK)

    elif request.method == 'PUT':
        if not request.user or not request.user.is_authenticated:
            return Response({'detail': 'Authentication credentials were not provided.'}, status=status.HTTP_401_UNAUTHORIZED)
            
        if request.user.role not in ['RECRUITER', 'ADMINISTRATOR']:
            return Response({'error': 'Forbidden'}, status=status.HTTP_403_FORBIDDEN)

        if request.user.role != 'ADMINISTRATOR' and job.company.user != request.user:
            return Response({'error': 'Permission Denied: Unowned asset modification restricted.'}, status=status.HTTP_403_FORBIDDEN)

        try:
            data = request.data
            job.title = data.get('title', job.title)
            job.location = data.get('location', job.location)
            job.work_mode = data.get('workMode', job.work_mode)
            job.experience_range = data.get('experienceRange', job.experience_range)
            job.salary_range = data.get('salaryRange', job.salary_range)
            job.tags = data.get('tags', job.tags)
            job.description = data.get('description', job.description)
            job.status = data.get('status', job.status)
            
            deadline_str = data.get('deadline')
            if deadline_str:
                try:
                    job.deadline = datetime.datetime.strptime(deadline_str, "%Y-%m-%d").date()
                except ValueError:
                    pass

            job.updated_by = request.user
            job.save()

            serializer = JobSerializer(job)
            return Response(serializer.data, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    elif request.method == 'DELETE':
        if not request.user or not request.user.is_authenticated:
            return Response({'detail': 'Authentication credentials were not provided.'}, status=status.HTTP_401_UNAUTHORIZED)
            
        if request.user.role not in ['RECRUITER', 'ADMINISTRATOR']:
            return Response({'error': 'Permission Denied.'}, status=status.HTTP_403_FORBIDDEN)

        if request.user.role != 'ADMINISTRATOR' and job.company.user != request.user:
            return Response({'error': 'Permission Denied.'}, status=status.HTTP_403_FORBIDDEN)

        job.soft_deleted = True
        job.save()

        add_system_log('AUDIT', f"Vacancy posting withdrawn/deleted: {job.title}", request.user.email)
        return Response({'message': 'Job posting successfully withdrawn.'}, status=status.HTTP_200_OK)


# ----------------- 3. PROFILE DATA & RESUME PARSING -----------------

@api_view(['GET'])
@authentication_classes([SimpleEmailAuthentication])
@permission_classes([IsAuthenticated])
def profile_me(request):
    try:
        user_data = UserSerializer(request.user).data
        response_payload = {'user': user_data}

        if request.user.role == 'JOB_SEEKER':
            try:
                candidate = Candidate.objects.get(user=request.user)
                response_payload['candidate'] = CandidateSerializer(candidate).data
            except Candidate.DoesNotExist:
                response_payload['candidate'] = None

        elif request.user.role == 'RECRUITER':
            try:
                employer = Employer.objects.get(user=request.user)
                response_payload['employer'] = EmployerSerializer(employer).data
            except Employer.DoesNotExist:
                response_payload['employer'] = None

        return Response(response_payload, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@authentication_classes([SimpleEmailAuthentication])
@permission_classes([IsAuthenticated])
def profile_update(request):
    try:
        user = request.user
        data = request.data

        if user.role == 'JOB_SEEKER':
            try:
                candidate = Candidate.objects.get(user=user)
            except Candidate.DoesNotExist:
                candidate = Candidate(user=user)

            candidate.first_name = data.get('firstName', candidate.first_name)
            candidate.last_name = data.get('lastName', candidate.last_name)
            candidate.phone = data.get('phone', candidate.phone)
            candidate.current_status = data.get('currentStatus', candidate.current_status)
            candidate.experience = data.get('experience', candidate.experience)
            candidate.current_city = data.get('city', candidate.current_city)
            candidate.preferred_location = data.get('preferredLocation', candidate.preferred_location)
            candidate.expected_salary = data.get('expectedSalary', candidate.expected_salary)
            candidate.current_salary = data.get('currentSalary', candidate.current_salary)
            candidate.remote_preference = data.get('remotePreference', candidate.remote_preference)
            candidate.availability = data.get('availability', candidate.availability)
            candidate.preferred_roles = data.get('preferredRoles', candidate.preferred_roles)
            candidate.preferred_industries = data.get('preferredIndustries', candidate.preferred_industries)
            candidate.employment_type = data.get('employmentType', candidate.employment_type)
            candidate.work_mode = data.get('workMode', candidate.work_mode)
            candidate.notice_period = data.get('noticePeriod', candidate.notice_period)
            candidate.open_to_work = data.get('openToWork', candidate.open_to_work)
            candidate.profile_strength = data.get('profileStrength', candidate.profile_strength)
            candidate.resume_score = data.get('resumeScore', candidate.resume_score)
            candidate.education = data.get('education', candidate.education)
            candidate.experience_history = data.get('experienceHistory', candidate.experience_history)
            candidate.skills = data.get('skills', candidate.skills)
            candidate.projects = data.get('projects', candidate.projects)
            candidate.certifications = data.get('certifications', candidate.certifications)
            candidate.languages = data.get('languages', candidate.languages)
            candidate.bio = data.get('bio', candidate.bio)
            candidate.recent_searches = data.get('recentSearches', candidate.recent_searches)
            candidate.state = data.get('state', candidate.state)
            candidate.country = data.get('country', candidate.country)
            candidate.linkedin = data.get('linkedin', candidate.linkedin)
            candidate.portfolio = data.get('portfolio', candidate.portfolio)
            candidate.save()

            # Update User phone too if provided
            if 'phone' in data:
                user.phone = data['phone']
                user.save()

            add_system_log('AUDIT', f"Candidate professional attributes updated: {user.email}", user.email)
            serializer = CandidateSerializer(candidate)
            return Response(serializer.data, status=status.HTTP_200_OK)

        elif user.role == 'RECRUITER':
            try:
                employer = Employer.objects.get(user=user)
            except Employer.DoesNotExist:
                employer = Employer(user=user)

            employer.company_name = data.get('companyName', employer.company_name)
            employer.industry = data.get('industry', employer.industry)
            employer.location = data.get('location', employer.location)
            employer.employees = data.get('employees', employer.employees)
            employer.rating = data.get('rating', employer.rating)
            employer.response_rate = data.get('responseRate', employer.response_rate)
            employer.about = data.get('about', employer.about)
            employer.website = data.get('website', employer.website)
            employer.logo = data.get('logo', employer.logo)
            employer.save()

            add_system_log('AUDIT', f"Employer company specifications synchronized: {user.email}", user.email)
            serializer = EmployerSerializer(employer)
            return Response(serializer.data, status=status.HTTP_200_OK)

        return Response(
            {'error': 'Profile operations supported for recruitment roles only.'},
            status=status.HTTP_400_BAD_REQUEST
        )

    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@authentication_classes([SimpleEmailAuthentication])
@permission_classes([IsAuthenticated])
def bookmark_job(request, jobId):
    if request.user.role != 'JOB_SEEKER':
        return Response({'error': 'Role restricted.'}, status=status.HTTP_403_FORBIDDEN)

    try:
        candidate = Candidate.objects.get(user=request.user)
    except Candidate.DoesNotExist:
        return Response({'error': 'Candidate profile not initialized.'}, status=status.HTTP_404_NOT_FOUND)

    try:
        job = Job.objects.get(id=jobId, soft_deleted=False)
    except Job.DoesNotExist:
        return Response({'error': 'Job not found.'}, status=status.HTTP_404_NOT_FOUND)

    if candidate.saved_jobs.filter(id=jobId).exists():
        candidate.saved_jobs.remove(job)
    else:
        candidate.saved_jobs.add(job)

    saved_job_ids = list(candidate.saved_jobs.values_list('id', flat=True))
    return Response({'savedJobs': saved_job_ids}, status=status.HTTP_200_OK)


# ----------------- 4. APPLICATIONS & ATS ACTIONS -----------------

@api_view(['POST'])
@authentication_classes([SimpleEmailAuthentication])
@permission_classes([IsAuthenticated])
def apply_job(request):
    if request.user.role != 'JOB_SEEKER':
        return Response({'error': 'Role restricted.'}, status=status.HTTP_403_FORBIDDEN)

    try:
        data = request.data
        job_id = data.get('jobId')
        resume_url = data.get('resumeUrl', 'Standard Digital Resume')
        resume_score = data.get('resumeScore')

        if not job_id:
            return Response({'error': 'jobId attribute is mandatory.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            job = Job.objects.get(id=job_id, soft_deleted=False)
        except Job.DoesNotExist:
            return Response({'error': 'Job posting not found.'}, status=status.HTTP_404_NOT_FOUND)

        try:
            candidate = Candidate.objects.get(user=request.user)
        except Candidate.DoesNotExist:
            return Response({'error': 'Candidate profile not initialized.'}, status=status.HTTP_400_BAD_REQUEST)

        # Check existing application
        if Application.objects.filter(job=job, candidate=candidate).exists():
            return Response(
                {'error': 'An application proposal has already been dispatched for this vacancy.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        app_id = f"app-{int(time.time() * 1000)}"
        
        final_resume_score = resume_score if resume_score is not None else candidate.resume_score
        if final_resume_score == 0:
            final_resume_score = 75

        timeline = [
            {
                'status': 'Applied',
                'timestamp': timezone.now().isoformat(),
                'note': 'Application proposal filed successfully.'
            }
        ]

        ranking_score = random.randint(65, 95)

        application = Application.objects.create(
            id=app_id,
            job=job,
            candidate=candidate,
            status='Applied',
            resume_url=resume_url,
            resume_score=final_resume_score,
            timeline=timeline,
            ranking_score=ranking_score,
            created_by=request.user
        )

        # Increment Job applicant count
        job.applicants_count += 1
        job.save()

        # Create a notification for the employer (recruiter)
        recruiter_user = job.company.user
        notif_id = f"notif-{int(time.time() * 1000)}"
        Notification.objects.create(
            id=notif_id,
            user=recruiter_user,
            title="New Job Application",
            message=f"Candidate {candidate.first_name} {candidate.last_name} applied for '{job.title}'."
        )

        add_system_log('AUDIT', f"Application filed for position: {job.title} at {job.company.company_name}", request.user.email)

        serializer = ApplicationSerializer(application)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
@authentication_classes([SimpleEmailAuthentication])
@permission_classes([IsAuthenticated])
def applications_list(request):
    try:
        user = request.user
        if user.role == 'JOB_SEEKER':
            try:
                candidate = Candidate.objects.get(user=user)
                apps = Application.objects.filter(candidate=candidate, soft_deleted=False)
            except Candidate.DoesNotExist:
                apps = Application.objects.none()
            
            serializer = ApplicationSerializer(apps, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)

        elif user.role == 'RECRUITER':
            apps = Application.objects.filter(job__company__user=user, soft_deleted=False)
            serializer = ApplicationSerializer(apps, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)

        elif user.role == 'ADMINISTRATOR':
            apps = Application.objects.filter(soft_deleted=False)
            serializer = ApplicationSerializer(apps, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)

        return Response([], status=status.HTTP_200_OK)

    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['PATCH'])
@authentication_classes([SimpleEmailAuthentication])
@permission_classes([IsAuthenticated])
def update_application_status(request, pk):
    try:
        application = Application.objects.get(id=pk, soft_deleted=False)
    except Application.DoesNotExist:
        return Response({'error': 'Application record not found.'}, status=status.HTTP_404_NOT_FOUND)

    if request.user.role == 'JOB_SEEKER':
        if application.candidate.user != request.user:
            return Response({'error': 'Unauthorized: Access restricted.'}, status=status.HTTP_403_FORBIDDEN)
    elif request.user.role not in ['RECRUITER', 'ADMINISTRATOR']:
        return Response(
            {'error': 'Forbidden: Restricted to roles [RECRUITER, ADMINISTRATOR, JOB_SEEKER]'},
            status=status.HTTP_403_FORBIDDEN
        )

    try:
        data = request.data
        status_val = data.get('status')
        note = data.get('note')
        rating = data.get('rating')
        notes = data.get('notes')
        interview_schedule = data.get('interviewSchedule')
        interview_notes = data.get('interviewNotes')

        timeline = application.timeline or []
        
        if status_val and status_val != application.status:
            timeline.append({
                'status': status_val,
                'timestamp': timezone.now().isoformat(),
                'note': note or f"Application status transitioned to {status_val}"
            })
            application.status = status_val
            application.timeline = timeline

        if rating is not None:
            application.candidate_score = int(rating)

        if notes is not None:
            application.notes = notes

        if interview_schedule is not None:
            application.interview_schedule = interview_schedule

        if interview_notes is not None:
            application.interview_notes = interview_notes

        application.updated_by = request.user
        application.save()

        add_system_log('AUDIT', f"Application status changed for app {pk}: {status_val}", request.user.email)

        serializer = ApplicationSerializer(application)
        return Response(serializer.data, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# ----------------- 5. ADMINISTRATIVE PANEL ENDPOINTS -----------------

@api_view(['GET'])
@authentication_classes([SimpleEmailAuthentication])
@permission_classes([IsAuthenticated])
def admin_verifications(request):
    if request.user.role != 'ADMINISTRATOR':
        return Response({'error': 'Forbidden'}, status=status.HTTP_403_FORBIDDEN)

    employers = Employer.objects.filter(status='PENDING')
    serializer = EmployerSerializer(employers, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['POST'])
@authentication_classes([SimpleEmailAuthentication])
@permission_classes([IsAuthenticated])
def admin_verification_action(request, userId):
    if request.user.role != 'ADMINISTRATOR':
        return Response({'error': 'Forbidden'}, status=status.HTTP_403_FORBIDDEN)

    try:
        employer = Employer.objects.get(user__email__iexact=userId)
    except Employer.DoesNotExist:
        return Response({'error': 'Employer registration record not discovered.'}, status=status.HTTP_404_NOT_FOUND)

    action = request.data.get('action') # 'APPROVE' or 'REJECT'
    status_val = 'APPROVED' if action == 'APPROVE' else 'REJECTED'

    employer.status = status_val
    employer.verified_at = timezone.now()
    employer.verified_by = request.user
    employer.save()

    target_user = employer.user
    target_user.status = 'ACTIVE' if status_val == 'APPROVED' else 'REJECTED'
    target_user.save()

    if status_val == 'APPROVED':
        # Retrieve the temp_password and dispatch simulated email
        raw_password = target_user.temp_password or "YOUR_REGISTERED_PASSWORD"
        print(f"\n" + "="*50)
        print("SIMULATED EMAIL DISPATCH")
        print(f"To: {target_user.email}")
        print("Subject: TechnoAdviser Recruiter Account Approved!")
        print("Body:")
        print(f"Dear {employer.company_name},")
        print("We are pleased to inform you that your recruiter account has been approved by our administrators.")
        print("You can now access your workspace and post job openings using the details below:")
        print("  Login URL: http://localhost:5173/")
        print(f"  Email: {target_user.email}")
        print(f"  Password: {raw_password}")
        print("="*50 + "\n", flush=True)

        target_user.temp_password = None
        target_user.save()
    elif status_val == 'REJECTED':
        print(f"\n" + "="*50)
        print("SIMULATED EMAIL DISPATCH")
        print(f"To: {target_user.email}")
        print("Subject: TechnoAdviser Recruiter Account Application Status")
        print("Body:")
        print(f"Dear {employer.company_name},")
        print("Thank you for your interest in joining TechnoAdviser.")
        print("We regret to inform you that your registration application has been rejected by our administrators during manual verification check.")
        print("Please contact our customer support team at support@technoadviser.com for further queries and details.")
        print("="*50 + "\n", flush=True)

    add_system_log('AUDIT', f"Employer verification set to {status_val} for email {userId}", request.user.email)
    return Response({'message': f"Employer status updated to {status_val}."}, status=status.HTTP_200_OK)


@api_view(['GET', 'POST'])
@authentication_classes([SimpleEmailAuthentication])
@permission_classes([IsAuthenticated])
def admin_logs(request):
    if request.user.role != 'ADMINISTRATOR':
        return Response({'error': 'Forbidden'}, status=status.HTTP_403_FORBIDDEN)

    if request.method == 'GET':
        logs = SystemLog.objects.all().order_by('-timestamp')[:500]
        serializer = SystemLogSerializer(logs, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    elif request.method == 'POST':
        log_type = request.data.get('type', 'AUDIT')
        message = request.data.get('message')
        if not message:
            return Response({'error': 'Message is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        log = add_system_log(log_type, message, request.user.email)
        serializer = SystemLogSerializer(log)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


@api_view(['GET'])
@authentication_classes([SimpleEmailAuthentication])
@permission_classes([IsAuthenticated])
def admin_analytics(request):
    if request.user.role != 'ADMINISTRATOR':
        return Response({'error': 'Forbidden'}, status=status.HTTP_403_FORBIDDEN)

    try:
        candidates_count = Candidate.objects.count()
        employers_count = Employer.objects.count()
        jobs_count = Job.objects.count()
        applications_count = Application.objects.count()
        active_jobs = Job.objects.filter(status='PUBLISHED', soft_deleted=False).count()
        pending_verifications = Employer.objects.filter(status='PENDING').count()
        admins_count = User.objects.filter(role='ADMINISTRATOR').count()

        today = timezone.localdate()
        months_list = []
        for i in range(6, -1, -1):
            m = today.month - i
            y = today.year
            while m <= 0:
                m += 12
                y -= 1
            months_list.append((y, m))

        month_names = {
            1: 'Jan', 2: 'Feb', 3: 'Mar', 4: 'Apr', 5: 'May', 6: 'Jun',
            7: 'Jul', 8: 'Aug', 9: 'Sep', 10: 'Oct', 11: 'Nov', 12: 'Dec'
        }

        growth_chart = []
        for y, m in months_list:
            c_cnt = Candidate.objects.filter(created_at__year=y, created_at__month=m).count()
            e_cnt = Employer.objects.filter(created_at__year=y, created_at__month=m).count()
            j_cnt = Job.objects.filter(posted_date__year=y, posted_date__month=m).count()

            growth_chart.append({
                'month': month_names[m],
                'candidates': c_cnt,
                'employers': e_cnt,
                'jobs': j_cnt
            })

        recent_logs = SystemLog.objects.all().order_by('-timestamp')[:4]
        recent_activities = []
        for l in recent_logs:
            badge = 'Audit'
            style = 'bg-blue-500/10 text-blue-500 border-blue-500/15'
            if l.type == 'AUTH':
                badge = 'Auth'
                style = 'bg-purple-500/10 text-purple-500 border-purple-500/15'
            elif l.type == 'SECURITY':
                badge = 'Security'
                style = 'bg-rose-500/10 text-rose-500 border-rose-500/15'
            elif l.type == 'AI':
                badge = 'AI'
                style = 'bg-amber-500/10 text-amber-500 border-amber-500/15'

            recent_activities.append({
                'text': l.message,
                'user': l.email or 'System Log',
                'time': l.timestamp.strftime('%d %b, %H:%M'),
                'badge': badge,
                'style': style
            })

        # Provide fallback activity if empty
        if not recent_activities:
            recent_activities = [
                {
                    'text': 'Initial administrator platform configuration',
                    'user': 'system@technoadviser.com',
                    'time': 'Just now',
                    'badge': 'Audit',
                    'style': 'bg-blue-500/10 text-blue-500 border-blue-500/15'
                }
            ]

        # Country demographics calculation
        countries = {}
        for c in Candidate.objects.all():
            loc = (c.current_city or '') + ' ' + (c.preferred_location or '')
            loc_lower = loc.lower()
            if 'india' in loc_lower or 'bengaluru' in loc_lower or 'mumbai' in loc_lower or 'delhi' in loc_lower:
                countries['India'] = countries.get('India', 0) + 1
            elif 'usa' in loc_lower or 'united states' in loc_lower or 'ca' in loc_lower or 'york' in loc_lower:
                countries['United States'] = countries.get('United States', 0) + 1
            elif 'uk' in loc_lower or 'united kingdom' in loc_lower or 'london' in loc_lower:
                countries['United Kingdom'] = countries.get('United Kingdom', 0) + 1
            elif 'canada' in loc_lower:
                countries['Canada'] = countries.get('Canada', 0) + 1
            else:
                countries['Others'] = countries.get('Others', 0) + 1

        for e in Employer.objects.all():
            loc = e.location or ''
            loc_lower = loc.lower()
            if 'india' in loc_lower or 'bengaluru' in loc_lower or 'mumbai' in loc_lower or 'delhi' in loc_lower:
                countries['India'] = countries.get('India', 0) + 1
            elif 'usa' in loc_lower or 'united states' in loc_lower or 'ca' in loc_lower or 'york' in loc_lower:
                countries['United States'] = countries.get('United States', 0) + 1
            elif 'uk' in loc_lower or 'united kingdom' in loc_lower or 'london' in loc_lower:
                countries['United Kingdom'] = countries.get('United Kingdom', 0) + 1
            elif 'canada' in loc_lower:
                countries['Canada'] = countries.get('Canada', 0) + 1
            else:
                countries['Others'] = countries.get('Others', 0) + 1

        total_loc = sum(countries.values())
        demographics = []
        if total_loc > 0:
            demographics = [
                {
                    'country': k,
                    'pct': int(round((v / total_loc) * 100)),
                    'color': 'bg-orange-500' if k == 'India' else ('bg-blue-500' if k == 'United States' else ('bg-emerald-500' if k == 'United Kingdom' else ('bg-purple-500' if k == 'Canada' else 'bg-zinc-500')))
                }
                for k, v in countries.items()
            ]
            demographics.sort(key=lambda x: x['pct'], reverse=True)
        else:
            demographics = [
                { 'country': 'India', 'pct': 100, 'color': 'bg-orange-500' }
            ]

        return Response({
            'stats': {
                'candidatesCount': candidates_count,
                'employersCount': employers_count,
                'jobsCount': jobs_count,
                'applicationsCount': applications_count,
                'activeJobs': active_jobs,
                'pendingVerifications': pending_verifications,
                'adminsCount': admins_count
            },
            'growthChart': growth_chart,
            'recentActivities': recent_activities,
            'demographics': demographics
        }, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
@authentication_classes([SimpleEmailAuthentication])
@permission_classes([IsAuthenticated])
def admin_users(request):
    if request.user.role != 'ADMINISTRATOR':
        return Response({'error': 'Forbidden'}, status=status.HTTP_403_FORBIDDEN)

    users = User.objects.all()
    serializer = UserSerializer(users, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['POST'])
@authentication_classes([SimpleEmailAuthentication])
@permission_classes([IsAuthenticated])
def admin_toggle_block(request, email):
    if request.user.role != 'ADMINISTRATOR':
        return Response({'error': 'Forbidden'}, status=status.HTTP_403_FORBIDDEN)

    try:
        user = User.objects.get(email__iexact=email)
    except User.DoesNotExist:
        return Response({'error': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)

    target_status = 'ACTIVE' if user.status == 'BLOCKED' else 'BLOCKED'
    user.status = target_status
    user.save()

    add_system_log('SECURITY', f"User account toggled status to {target_status}: {email}", request.user.email)
    return Response({'message': f"User status changed to {target_status}.", 'status': target_status}, status=status.HTTP_200_OK)


@api_view(['DELETE'])
@authentication_classes([SimpleEmailAuthentication])
@permission_classes([IsAuthenticated])
def admin_user_delete(request, email):
    if request.user.role != 'ADMINISTRATOR':
        return Response({'error': 'Forbidden'}, status=status.HTTP_403_FORBIDDEN)

    try:
        user = User.objects.get(email__iexact=email)
    except User.DoesNotExist:
        return Response({'error': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)

    if user == request.user:
        return Response({'error': 'Cannot delete your own admin account.'}, status=status.HTTP_400_BAD_REQUEST)

    user_email = user.email
    user.delete()
    add_system_log('AUDIT', f"Deleted user account: {user_email}", request.user.email)
    return Response({'message': 'User deleted successfully.'}, status=status.HTTP_200_OK)


@api_view(['GET', 'POST'])
@authentication_classes([SimpleEmailAuthentication])
@permission_classes([IsAuthenticated])
def admin_companies(request):
    if request.user.role != 'ADMINISTRATOR':
        return Response({'error': 'Forbidden'}, status=status.HTTP_403_FORBIDDEN)

    if request.method == 'GET':
        employers = Employer.objects.all()
        serializer = EmployerSerializer(employers, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    elif request.method == 'POST':
        company_name = request.data.get('companyName')
        industry = request.data.get('industry')
        location = request.data.get('location')

        if not company_name or not industry:
            return Response({'error': 'companyName and industry are required.'}, status=status.HTTP_400_BAD_REQUEST)

        # Create user
        base_email = company_name.lower().replace(' ', '')
        email = f"{base_email}@example.com"
        count = 1
        while User.objects.filter(email=email).exists():
            email = f"{base_email}{count}@example.com"
            count += 1

        user = User.objects.create(
            email=email,
            role='RECRUITER',
            status='ACTIVE',
            name=company_name
        )
        user.set_password('Password@123')
        user.save()

        employer = Employer.objects.create(
            user=user,
            company_name=company_name,
            industry=industry,
            location=location or 'Remote / Global',
            status='APPROVED'
        )

        # Print simulated email to terminal for onboarded brand
        print(f"\n" + "="*50)
        print("SIMULATED EMAIL DISPATCH (ONBOARDED BRAND)")
        print(f"To: {email}")
        print("Subject: TechnoAdviser Recruiter Account Created!")
        print("Body:")
        print(f"Dear {company_name},")
        print("A recruiter workspace has been created for your brand by the Administrator.")
        print("You can now access your workspace and post job openings using the details below:")
        print("  Login URL: http://localhost:5173/")
        print(f"  Email: {email}")
        print("  Password: Password@123")
        print("="*50 + "\n", flush=True)

        add_system_log('AUDIT', f"Onboarded new corporate brand: {company_name} ({email})", request.user.email)

        serializer = EmployerSerializer(employer)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


@api_view(['DELETE'])
@authentication_classes([SimpleEmailAuthentication])
@permission_classes([IsAuthenticated])
def admin_company_detail(request, email):
    if request.user.role != 'ADMINISTRATOR':
        return Response({'error': 'Forbidden'}, status=status.HTTP_403_FORBIDDEN)

    try:
        user = User.objects.get(email__iexact=email)
        employer = Employer.objects.get(user=user)
    except (User.DoesNotExist, Employer.DoesNotExist):
        return Response({'error': 'Company record not found.'}, status=status.HTTP_404_NOT_FOUND)

    employer.delete()
    user.delete()

    add_system_log('AUDIT', f"Deleted corporate business profile: {email}", request.user.email)
    return Response({'message': 'Company profile pruned successfully.'}, status=status.HTTP_200_OK)


@api_view(['GET', 'POST'])
@authentication_classes([SimpleEmailAuthentication])
@permission_classes([IsAuthenticated])
def admin_plans(request):
    if request.user.role != 'ADMINISTRATOR':
        return Response({'error': 'Forbidden'}, status=status.HTTP_403_FORBIDDEN)

    if request.method == 'GET':
        plans = SubscriptionPlan.objects.all()
        serializer = SubscriptionPlanSerializer(plans, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    elif request.method == 'POST':
        name = request.data.get('name')
        price = request.data.get('price')
        period = request.data.get('period', 'Monthly')

        if not name or not price:
            return Response({'error': 'name and price are required'}, status=status.HTTP_400_BAD_REQUEST)

        plan_id = f"plan-{int(time.time())}"
        plan = SubscriptionPlan.objects.create(
            id=plan_id,
            name=name,
            price=price,
            period=period,
            users_count=0,
            status='Active'
        )
        add_system_log('AUDIT', f"Created subscription plan: {name}", request.user.email)
        serializer = SubscriptionPlanSerializer(plan)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


@api_view(['PUT', 'DELETE'])
@authentication_classes([SimpleEmailAuthentication])
@permission_classes([IsAuthenticated])
def admin_plan_detail(request, pk):
    if request.user.role != 'ADMINISTRATOR':
        return Response({'error': 'Forbidden'}, status=status.HTTP_403_FORBIDDEN)

    try:
        plan = SubscriptionPlan.objects.get(pk=pk)
    except SubscriptionPlan.DoesNotExist:
        return Response({'error': 'Plan not found'}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'PUT':
        price = request.data.get('price')
        status_val = request.data.get('status')
        if price:
            plan.price = price
        if status_val:
            plan.status = status_val
        plan.save()
        add_system_log('AUDIT', f"Updated subscription plan details: {plan.name}", request.user.email)
        serializer = SubscriptionPlanSerializer(plan)
        return Response(serializer.data, status=status.HTTP_200_OK)

    elif request.method == 'DELETE':
        plan.delete()
        add_system_log('AUDIT', f"Deleted subscription plan: {pk}", request.user.email)
        return Response({'message': 'Plan deleted successfully'}, status=status.HTTP_200_OK)


@api_view(['GET', 'POST'])
@authentication_classes([SimpleEmailAuthentication])
@permission_classes([IsAuthenticated])
def admin_coupons(request):
    if request.user.role != 'ADMINISTRATOR':
        return Response({'error': 'Forbidden'}, status=status.HTTP_403_FORBIDDEN)

    if request.method == 'GET':
        coupons = Coupon.objects.all()
        serializer = CouponSerializer(coupons, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    elif request.method == 'POST':
        code = request.data.get('code')
        discount = request.data.get('discount')
        type_val = request.data.get('type', 'Percentage')

        if not code or not discount:
            return Response({'error': 'code and discount are required'}, status=status.HTTP_400_BAD_REQUEST)

        code_upper = code.upper().replace(' ', '')
        if Coupon.objects.filter(code=code_upper).exists():
            return Response({'error': 'Coupon with this code already exists'}, status=status.HTTP_400_BAD_REQUEST)

        coupon = Coupon.objects.create(
            code=code_upper,
            discount=discount,
            type=type_val,
            usage=0,
            status='Active'
        )
        add_system_log('AUDIT', f"Created promotion coupon: {code_upper}", request.user.email)
        serializer = CouponSerializer(coupon)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


@api_view(['PUT'])
@authentication_classes([SimpleEmailAuthentication])
@permission_classes([IsAuthenticated])
def admin_coupon_detail(request, code):
    if request.user.role != 'ADMINISTRATOR':
        return Response({'error': 'Forbidden'}, status=status.HTTP_403_FORBIDDEN)

    try:
        coupon = Coupon.objects.get(code__iexact=code)
    except Coupon.DoesNotExist:
        return Response({'error': 'Coupon not found'}, status=status.HTTP_404_NOT_FOUND)

    status_val = request.data.get('status')
    if status_val:
        coupon.status = status_val
    coupon.save()
    add_system_log('AUDIT', f"Updated coupon status: {coupon.code} to {coupon.status}", request.user.email)
    serializer = CouponSerializer(coupon)
    return Response(serializer.data, status=status.HTTP_200_OK)


# ----------------- 6. GEMINI AI INTUITIVE API ENDPOINTS -----------------

@api_view(['POST'])
@authentication_classes([SimpleEmailAuthentication])
@permission_classes([IsAuthenticated])
def gemini_analyze(request):
    try:
        data = request.data
        raw_text = data.get('rawText')
        profile_data = data.get('profileData')
        
        candidate_text = raw_text or json.dumps(profile_data or {})

        if not candidate_text or not candidate_text.strip():
            return Response({'error': 'Text prompt parameters must not be empty.'}, status=status.HTTP_400_BAD_REQUEST)

        gemini_api_key = os.environ.get("GEMINI_API_KEY")
        
        if not gemini_api_key:
            return Response({'error': 'AI analysis will be available after backend integration.'}, status=status.HTTP_503_SERVICE_UNAVAILABLE)

        try:
            # Initialize Google GenAI client
            client = genai.Client(api_key=gemini_api_key)
            
            # Execute standard generative Content with standard gemini-3.5-flash model
            prompt = (
                "Analyze the following professional resume description or candidate JSON profile to "
                "generate structured career feedback in a high-fidelity recruitment context. "
                "Return JSON data adhering exactly to the specified JSON schema.\n"
                f"Candidate Profile Data:\n{candidate_text}\n\n"
                "Return exactly standard JSON with fields:\n"
                "- \"score\": number between 1 and 100 representing ATS score,\n"
                "- \"parsedSummary\": brief summary string of candidates background,\n"
                "- \"strengths\": array of strings describing key strengths,\n"
                "- \"skillGaps\": array of objects with fields \"skill\" and \"reason\",\n"
                "- \"roadmap\": array of strings listing sequential, concrete next learning roadmap steps,\n"
                "- \"questions\": array of strings with 3 realistic, targeted interview mock preparation questions."
            )

            response = client.models.generate_content(
                model='gemini-2.5-flash',
                contents=prompt,
                config={
                    'response_mime_type': 'application/json'
                }
            )

            text_output = response.text or ''
            parsed = json.loads(text_output)
            add_system_log('AI', f"Successful dynamic Gemini model invocation completed for candidate: {request.user.email}", request.user.email)
            return Response(parsed, status=status.HTTP_200_OK)

        except Exception as gemini_err:
            return Response({'error': f"AI analysis error: {str(gemini_err)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET', 'PATCH'])
@authentication_classes([SimpleEmailAuthentication])
@permission_classes([IsAuthenticated])
def user_notifications(request, pk=None):
    if request.method == 'GET':
        notifications = Notification.objects.filter(user=request.user).order_by('-created_at')
        serializer = NotificationSerializer(notifications, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    elif request.method == 'PATCH':
        if not pk:
            return Response({'error': 'Notification ID required.'}, status=status.HTTP_400_BAD_REQUEST)
        if pk == 'read-all':
            Notification.objects.filter(user=request.user, read=False).update(read=True)
            return Response({'message': 'All notifications marked as read.'}, status=status.HTTP_200_OK)
        else:
            try:
                notification = Notification.objects.get(id=pk, user=request.user)
                notification.read = True
                notification.save()
                serializer = NotificationSerializer(notification)
                return Response(serializer.data, status=status.HTTP_200_OK)
            except Notification.DoesNotExist:
                return Response({'error': 'Notification not found.'}, status=status.HTTP_404_NOT_FOUND)


@api_view(['GET'])
@authentication_classes([])
@permission_classes([])
def public_companies(request):
    employers = Employer.objects.filter(status='APPROVED')
    serializer = EmployerSerializer(employers, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


# ----------------- 7. AI CAREER COPILOT API ENDPOINTS -----------------
import time
from api.models import (
    Resume, ResumeVersion, ResumeAnalysis, ResumeOptimization,
    Conversation, ConversationMessage, AIRecommendation, CareerRoadmap,
    LearningRecommendation, SalaryPrediction as SalaryPredictionModel,
    InterviewSession, SkillGapAnalysis as SkillGapAnalysisModel,
    JobMatchAnalysis, CompanyInsight as CompanyInsightModel, CoverLetter as CoverLetterModel,
    AssessmentResult as AssessmentResultModel
)
from api.copilot_utils import (
    generate_copilot_dashboard_data,
    generate_copilot_chat_response,
    generate_resume_analysis,
    generate_resume_optimization,
    generate_cover_letter,
    generate_career_roadmap,
    generate_learning_recommendation,
    generate_interview_questions,
    evaluate_mock_interview,
    generate_salary_prediction,
    generate_job_match_explanation,
    generate_company_insights,
    generate_application_strategy
)

@api_view(['GET'])
@authentication_classes([SimpleEmailAuthentication])
@permission_classes([IsAuthenticated])
def copilot_dashboard(request):
    try:
        candidate = Candidate.objects.get(user=request.user)
    except Candidate.DoesNotExist:
        return Response({'error': 'Candidate profile not initialized.'}, status=status.HTTP_404_NOT_FOUND)
    
    data = generate_copilot_dashboard_data(candidate)
    return Response(data, status=status.HTTP_200_OK)

@api_view(['GET', 'POST'])
@authentication_classes([SimpleEmailAuthentication])
@permission_classes([IsAuthenticated])
def copilot_conversations(request):
    try:
        candidate = Candidate.objects.get(user=request.user)
    except Candidate.DoesNotExist:
        return Response({'error': 'Candidate profile not initialized.'}, status=status.HTTP_404_NOT_FOUND)
        
    if request.method == 'GET':
        conversations = Conversation.objects.filter(candidate=candidate).order_by('-is_pinned', '-updated_at')
        data = []
        for c in conversations:
            data.append({
                'id': c.id,
                'title': c.title,
                'is_favorite': c.is_favorite,
                'is_pinned': c.is_pinned,
                'updated_at': c.updated_at.isoformat()
            })
        return Response(data, status=status.HTTP_200_OK)
        
    elif request.method == 'POST':
        title = request.data.get('title', 'New Conversation')
        c_id = f"conv-{int(time.time() * 1000)}"
        conv = Conversation.objects.create(
            id=c_id,
            candidate=candidate,
            title=title
        )
        return Response({
            'id': conv.id,
            'title': conv.title,
            'is_favorite': conv.is_favorite,
            'is_pinned': conv.is_pinned
        }, status=status.HTTP_201_CREATED)

@api_view(['GET', 'POST', 'DELETE', 'PATCH'])
@authentication_classes([SimpleEmailAuthentication])
@permission_classes([IsAuthenticated])
def copilot_conversation_detail(request, pk):
    try:
        candidate = Candidate.objects.get(user=request.user)
        conv = Conversation.objects.get(id=pk, candidate=candidate)
    except (Candidate.DoesNotExist, Conversation.DoesNotExist):
        return Response({'error': 'Conversation not found.'}, status=status.HTTP_404_NOT_FOUND)
        
    if request.method == 'GET':
        messages = ConversationMessage.objects.filter(conversation=conv).order_by('created_at')
        msg_data = [{
            'id': m.id,
            'sender': m.sender,
            'text': m.text,
            'created_at': m.created_at.isoformat()
        } for m in messages]
        return Response({
            'id': conv.id,
            'title': conv.title,
            'is_favorite': conv.is_favorite,
            'is_pinned': conv.is_pinned,
            'messages': msg_data
        }, status=status.HTTP_200_OK)
        
    elif request.method == 'POST':
        text = request.data.get('text')
        if not text:
            return Response({'error': 'Message text is required.'}, status=status.HTTP_400_BAD_REQUEST)
            
        # Save user message
        u_msg_id = f"msg-usr-{int(time.time() * 1000)}"
        ConversationMessage.objects.create(
            id=u_msg_id,
            conversation=conv,
            sender='user',
            text=text
        )
        
        # Load conversation history context
        history = list(ConversationMessage.objects.filter(conversation=conv).order_by('created_at')[:10])
        history_formatted = [{'sender': h.sender, 'text': h.text} for h in history]
        
        # Generate AI response
        ai_reply_text = generate_copilot_chat_response(candidate, text, history_formatted)
        
        # Save AI message
        ai_msg_id = f"msg-ai-{int(time.time() * 1000)}"
        ConversationMessage.objects.create(
            id=ai_msg_id,
            conversation=conv,
            sender='ai',
            text=ai_reply_text
        )
        
        # Update updated_at of conversation
        conv.save()
        
        return Response({
            'user_message': {
                'id': u_msg_id,
                'sender': 'user',
                'text': text
            },
            'ai_message': {
                'id': ai_msg_id,
                'sender': 'ai',
                'text': ai_reply_text
            }
        }, status=status.HTTP_200_OK)
        
    elif request.method == 'PATCH':
        title = request.data.get('title')
        is_favorite = request.data.get('is_favorite')
        is_pinned = request.data.get('is_pinned')
        
        if title is not None:
            conv.title = title
        if is_favorite is not None:
            conv.is_favorite = is_favorite
        if is_pinned is not None:
            conv.is_pinned = is_pinned
        conv.save()
        return Response({
            'id': conv.id,
            'title': conv.title,
            'is_favorite': conv.is_favorite,
            'is_pinned': conv.is_pinned
        }, status=status.HTTP_200_OK)
        
    elif request.method == 'DELETE':
        conv.delete()
        return Response({'message': 'Conversation deleted successfully.'}, status=status.HTTP_200_OK)

@api_view(['POST', 'GET'])
@authentication_classes([SimpleEmailAuthentication])
@permission_classes([IsAuthenticated])
def copilot_resume_analyze(request):
    try:
        candidate = Candidate.objects.get(user=request.user)
    except Candidate.DoesNotExist:
        return Response({'error': 'Candidate profile not initialized.'}, status=status.HTTP_404_NOT_FOUND)
        
    if request.method == 'POST':
        resume_file = request.FILES.get('file')
        file_name = request.data.get('fileName', 'uploaded_resume.pdf')
        
        content_text = ""
        if resume_file:
            content_text = f"Parsed resume from file upload {file_name}."
            
        r_id = f"res-{int(time.time() * 1000)}"
        resume = Resume.objects.create(
            id=r_id,
            candidate=candidate,
            name=file_name,
            content_text=content_text
        )
        
        analysis = generate_resume_analysis(candidate, file_name, content_text)
        
        ra_id = f"anl-{int(time.time() * 1000)}"
        ResumeAnalysis.objects.create(
            id=ra_id,
            candidate=candidate,
            resume=resume,
            ats_score=analysis['ats_score'],
            formatting_score=analysis['formatting_score'],
            grammar_score=analysis['grammar_score'],
            keyword_score=analysis['keyword_score'],
            analysis_data=analysis['analysis_data']
        )
        
        candidate.resume_score = analysis['ats_score']
        candidate.save()
        
        return Response({
            'resume_id': resume.id,
            'name': resume.name,
            'ats_score': analysis['ats_score'],
            'formatting_score': analysis['formatting_score'],
            'grammar_score': analysis['grammar_score'],
            'keyword_score': analysis['keyword_score'],
            'analysis_data': analysis['analysis_data']
        }, status=status.HTTP_201_CREATED)
        
    elif request.method == 'GET':
        analyses = ResumeAnalysis.objects.filter(candidate=candidate).order_by('-created_at')
        data = [{
            'id': a.id,
            'resume_name': a.resume.name,
            'ats_score': a.ats_score,
            'formatting_score': a.formatting_score,
            'grammar_score': a.grammar_score,
            'keyword_score': a.keyword_score,
            'analysis_data': a.analysis_data,
            'created_at': a.created_at.isoformat()
        } for a in analyses]
        return Response(data, status=status.HTTP_200_OK)

@api_view(['POST'])
@authentication_classes([SimpleEmailAuthentication])
@permission_classes([IsAuthenticated])
def copilot_resume_optimize(request):
    try:
        candidate = Candidate.objects.get(user=request.user)
    except Candidate.DoesNotExist:
        return Response({'error': 'Candidate profile not initialized.'}, status=status.HTTP_404_NOT_FOUND)
        
    resume_text = request.data.get('resumeText', '')
    opt_data = generate_resume_optimization(candidate, resume_text)
    
    resume = Resume.objects.filter(candidate=candidate).first()
    if not resume:
        resume = Resume.objects.create(
            id=f"res-{int(time.time() * 1000)}",
            candidate=candidate,
            name="Primary Profile Resume",
            content_text=resume_text
        )
        
    ResumeOptimization.objects.create(
        id=f"opt-{int(time.time() * 1000)}",
        candidate=candidate,
        resume=resume,
        before_content=opt_data['before_content'],
        after_content=opt_data['after_content']
    )
    
    return Response(opt_data, status=status.HTTP_200_OK)

@api_view(['POST', 'GET'])
@authentication_classes([SimpleEmailAuthentication])
@permission_classes([IsAuthenticated])
def copilot_cover_letter(request):
    try:
        candidate = Candidate.objects.get(user=request.user)
    except Candidate.DoesNotExist:
        return Response({'error': 'Candidate profile not initialized.'}, status=status.HTTP_404_NOT_FOUND)
        
    if request.method == 'POST':
        job_title = request.data.get('jobTitle', 'Software Engineer')
        company_name = request.data.get('companyName', 'Technology Enterprise')
        tone = request.data.get('tone', 'professional')
        
        letter_text = generate_cover_letter(candidate, job_title, company_name, tone)
        
        cl = CoverLetterModel.objects.create(
            id=f"cl-{int(time.time() * 1000)}",
            candidate=candidate,
            job_title=job_title,
            company_name=company_name,
            letter_text=letter_text,
            tone=tone
        )
        
        return Response({
            'id': cl.id,
            'job_title': cl.job_title,
            'company_name': cl.company_name,
            'letter_text': cl.letter_text,
            'tone': cl.tone,
            'created_at': cl.created_at.isoformat()
        }, status=status.HTTP_201_CREATED)
        
    elif request.method == 'GET':
        letters = CoverLetterModel.objects.filter(candidate=candidate).order_by('-created_at')
        data = [{
            'id': l.id,
            'job_title': l.job_title,
            'company_name': l.company_name,
            'letter_text': l.letter_text,
            'tone': l.tone,
            'created_at': l.created_at.isoformat()
        } for l in letters]
        return Response(data, status=status.HTTP_200_OK)

@api_view(['POST', 'GET'])
@authentication_classes([SimpleEmailAuthentication])
@permission_classes([IsAuthenticated])
def copilot_roadmap(request):
    try:
        candidate = Candidate.objects.get(user=request.user)
    except Candidate.DoesNotExist:
        return Response({'error': 'Candidate profile not initialized.'}, status=status.HTTP_404_NOT_FOUND)
        
    if request.method == 'POST':
        target_role = request.data.get('targetRole', 'Tech Lead')
        roadmap_res = generate_career_roadmap(candidate, target_role)
        
        CareerRoadmap.objects.create(
            id=f"rdm-{int(time.time() * 1000)}",
            candidate=candidate,
            target_role=target_role,
            roadmap_data=roadmap_res['roadmap_data']
        )
        return Response(roadmap_res, status=status.HTTP_201_CREATED)
        
    elif request.method == 'GET':
        roadmaps = CareerRoadmap.objects.filter(candidate=candidate).order_by('-created_at')
        data = [{
            'id': r.id,
            'target_role': r.target_role,
            'roadmap_data': r.roadmap_data,
            'created_at': r.created_at.isoformat()
        } for r in roadmaps]
        return Response(data, status=status.HTTP_200_OK)

@api_view(['POST'])
@authentication_classes([SimpleEmailAuthentication])
@permission_classes([IsAuthenticated])
def copilot_skill_gap(request):
    try:
        candidate = Candidate.objects.get(user=request.user)
    except Candidate.DoesNotExist:
        return Response({'error': 'Candidate profile not initialized.'}, status=status.HTTP_404_NOT_FOUND)
        
    job_title = request.data.get('jobTitle', 'Senior Developer')
    job_description = request.data.get('jobDescription', '')
    
    missing_skills = ["System Design", "Docker", "DevOps Pipelines"]
    if "kubernetes" in job_description.lower():
        missing_skills.append("Kubernetes")
    if "aws" in job_description.lower():
        missing_skills.append("AWS Cloud Orchestration")
        
    learning = generate_learning_recommendation(candidate, missing_skills)
    
    analysis_data = {
        'missing_skills': missing_skills,
        'learning': learning
    }
    
    SkillGapAnalysisModel.objects.create(
        id=f"gap-{int(time.time() * 1000)}",
        candidate=candidate,
        job_title=job_title,
        job_description=job_description,
        analysis_data=analysis_data
    )
    
    return Response(analysis_data, status=status.HTTP_200_OK)

@api_view(['POST'])
@authentication_classes([SimpleEmailAuthentication])
@permission_classes([IsAuthenticated])
def copilot_learning(request):
    try:
        candidate = Candidate.objects.get(user=request.user)
    except Candidate.DoesNotExist:
        return Response({'error': 'Candidate profile not initialized.'}, status=status.HTTP_404_NOT_FOUND)
        
    skills = request.data.get('skills', [])
    learning = generate_learning_recommendation(candidate, skills)
    return Response(learning, status=status.HTTP_200_OK)

@api_view(['POST'])
@authentication_classes([SimpleEmailAuthentication])
@permission_classes([IsAuthenticated])
def copilot_salary_prediction(request):
    try:
        candidate = Candidate.objects.get(user=request.user)
    except Candidate.DoesNotExist:
        return Response({'error': 'Candidate profile not initialized.'}, status=status.HTTP_404_NOT_FOUND)
        
    role = request.data.get('role', 'Developer')
    location = request.data.get('location', 'Bengaluru')
    
    salary_res = generate_salary_prediction(candidate, role, location)
    
    SalaryPredictionModel.objects.create(
        id=f"sal-{int(time.time() * 1000)}",
        candidate=candidate,
        experience=salary_res['experience'],
        skills=salary_res['skills'],
        location=salary_res['location'],
        min_salary=salary_res['min_salary'],
        avg_salary=salary_res['avg_salary'],
        max_salary=salary_res['max_salary'],
        market_demand=salary_res['market_demand'],
        growth_rate=salary_res['growth_rate']
    )
    
    return Response(salary_res, status=status.HTTP_200_OK)

@api_view(['POST'])
@authentication_classes([SimpleEmailAuthentication])
@permission_classes([IsAuthenticated])
def copilot_interview_questions(request):
    try:
        candidate = Candidate.objects.get(user=request.user)
    except Candidate.DoesNotExist:
        return Response({'error': 'Candidate profile not initialized.'}, status=status.HTTP_404_NOT_FOUND)
        
    round_type = request.data.get('roundType', 'Technical')
    role = request.data.get('role', 'Software Engineer')
    
    questions = generate_interview_questions(candidate, round_type, role)
    
    session = InterviewSession.objects.create(
        id=f"int-{int(time.time() * 1000)}",
        candidate=candidate,
        round_type=round_type,
        role=role,
        questions=questions,
        answers={},
        evaluation={},
        completed=False
    )
    
    return Response({
        'session_id': session.id,
        'round_type': session.round_type,
        'role': session.role,
        'questions': [{
            'id': q['id'],
            'question': q['question'],
            'type': q['type'],
            'difficulty': q['difficulty'],
            'hint': q['hint']
        } for q in questions]
    }, status=status.HTTP_201_CREATED)

@api_view(['POST'])
@authentication_classes([SimpleEmailAuthentication])
@permission_classes([IsAuthenticated])
def copilot_interview_evaluate(request, session_id):
    try:
        candidate = Candidate.objects.get(user=request.user)
        session = InterviewSession.objects.get(id=session_id, candidate=candidate)
    except (Candidate.DoesNotExist, InterviewSession.DoesNotExist):
        return Response({'error': 'Interview session not found.'}, status=status.HTTP_404_NOT_FOUND)
        
    answers = request.data.get('answers', {})
    session.answers = answers
    
    evaluation = evaluate_mock_interview(session.questions, answers)
    session.evaluation = evaluation
    session.completed = True
    session.save()
    
    return Response(evaluation, status=status.HTTP_200_OK)

@api_view(['GET'])
@authentication_classes([SimpleEmailAuthentication])
@permission_classes([IsAuthenticated])
def copilot_interview_history(request):
    try:
        candidate = Candidate.objects.get(user=request.user)
    except Candidate.DoesNotExist:
        return Response({'error': 'Candidate profile not initialized.'}, status=status.HTTP_404_NOT_FOUND)
        
    sessions = InterviewSession.objects.filter(candidate=candidate, completed=True).order_by('-created_at')
    data = [{
        'id': s.id,
        'round_type': s.round_type,
        'role': s.role,
        'evaluation': s.evaluation,
        'created_at': s.created_at.isoformat()
    } for s in sessions]
    return Response(data, status=status.HTTP_200_OK)

@api_view(['POST'])
@authentication_classes([SimpleEmailAuthentication])
@permission_classes([IsAuthenticated])
def copilot_job_match(request):
    try:
        candidate = Candidate.objects.get(user=request.user)
    except Candidate.DoesNotExist:
        return Response({'error': 'Candidate profile not initialized.'}, status=status.HTTP_404_NOT_FOUND)
        
    job_id = request.data.get('jobId')
    if not job_id:
        return Response({'error': 'jobId is required.'}, status=status.HTTP_400_BAD_REQUEST)
        
    try:
        job = Job.objects.get(id=job_id, soft_deleted=False)
    except Job.DoesNotExist:
        return Response({'error': 'Job not found.'}, status=status.HTTP_404_NOT_FOUND)
        
    match_data = generate_job_match_explanation(candidate, job)
    
    JobMatchAnalysis.objects.create(
        id=f"mtch-{int(time.time() * 1000)}",
        candidate=candidate,
        job=job,
        match_score=match_data['match_score'],
        analysis_data=match_data['analysis_data']
    )
    
    return Response(match_data, status=status.HTTP_200_OK)

@api_view(['POST'])
@authentication_classes([SimpleEmailAuthentication])
@permission_classes([IsAuthenticated])
def copilot_company_insight(request):
    try:
        candidate = Candidate.objects.get(user=request.user)
    except Candidate.DoesNotExist:
        return Response({'error': 'Candidate profile not initialized.'}, status=status.HTTP_404_NOT_FOUND)
        
    company_name = request.data.get('companyName')
    if not company_name:
        return Response({'error': 'companyName is required.'}, status=status.HTTP_400_BAD_REQUEST)
        
    insight = generate_company_insights(company_name)
    
    CompanyInsightModel.objects.create(
        id=f"ins-{int(time.time() * 1000)}",
        candidate=candidate,
        company_name=company_name,
        insight_data=insight['insight_data']
    )
    
    return Response(insight, status=status.HTTP_200_OK)

@api_view(['POST'])
@authentication_classes([SimpleEmailAuthentication])
@permission_classes([IsAuthenticated])
def copilot_application_strategy(request):
    try:
        candidate = Candidate.objects.get(user=request.user)
    except Candidate.DoesNotExist:
        return Response({'error': 'Candidate profile not initialized.'}, status=status.HTTP_404_NOT_FOUND)
        
    job_id = request.data.get('jobId')
    job = None
    if job_id:
        try:
            job = Job.objects.get(id=job_id)
        except Job.DoesNotExist:
            pass
            
    strategy = generate_application_strategy(candidate, job)
    return Response(strategy, status=status.HTTP_200_OK)

@api_view(['GET'])
@authentication_classes([SimpleEmailAuthentication])
@permission_classes([IsAuthenticated])
def copilot_analytics(request):
    try:
        candidate = Candidate.objects.get(user=request.user)
    except Candidate.DoesNotExist:
        return Response({'error': 'Candidate profile not initialized.'}, status=status.HTTP_404_NOT_FOUND)
        
    return Response({
        'applications': [2, 5, 8, 12, 14, 19],
        'interviews': [1, 2, 2, 4, 5, 6],
        'offers': [0, 0, 0, 1, 1, 2],
        'rejections': [1, 2, 4, 6, 7, 9],
        'acceptance_rate': 15,
        'resume_views': [10, 24, 38, 45, 59, 78],
        'recruiter_searches': [15, 32, 45, 60, 84, 110],
        'profile_views': [20, 48, 67, 85, 120, 150]
    }, status=status.HTTP_200_OK)

@api_view(['GET', 'POST'])
@authentication_classes([SimpleEmailAuthentication])
@permission_classes([IsAuthenticated])
def copilot_memory(request):
    try:
        candidate = Candidate.objects.get(user=request.user)
    except Candidate.DoesNotExist:
        return Response({'error': 'Candidate profile not initialized.'}, status=status.HTTP_404_NOT_FOUND)
        
    if request.method == 'GET':
        recs = AIRecommendation.objects.filter(candidate=candidate).order_by('-created_at')
        data = [{
            'id': r.id,
            'category': r.category,
            'recommendation_text': r.recommendation_text,
            'created_at': r.created_at.isoformat()
        } for r in recs]
        return Response(data, status=status.HTTP_200_OK)
        
    elif request.method == 'POST':
        category = request.data.get('category', 'general')
        text = request.data.get('text', '')
        r = AIRecommendation.objects.create(
            id=f"rec-{int(time.time() * 1000)}",
            candidate=candidate,
            category=category,
            recommendation_text=text
        )
        return Response({
            'id': r.id,
            'category': r.category,
            'recommendation_text': r.recommendation_text
        }, status=status.HTTP_201_CREATED)

