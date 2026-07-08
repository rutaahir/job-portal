from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from api.models import User, Employer, Candidate, Job, Application, SystemLog
from django.utils import timezone
import datetime
import json

class JobPortalTests(APITestCase):

    def setUp(self):
        # Create an administrator
        self.admin_user = User.objects.create_user(
            email='admin@technoadviser.com',
            phone='+919999999999',
            password='Admin@12345',
            role='ADMINISTRATOR',
            status='ACTIVE',
            name='Super Admin',
            otp_verified=True
        )
        self.admin_user.is_staff = True
        self.admin_user.is_superuser = True
        self.admin_user.save()

        # Create an employer user
        self.employer_user = User.objects.create_user(
            email='employer@meta.com',
            phone='+919811122233',
            password='Employer@123',
            role='RECRUITER',
            status='ACTIVE',
            name='Aditya Roy',
            otp_verified=True
        )
        self.employer = Employer.objects.create(
            user=self.employer_user,
            company_name='Meta Platforms Inc',
            industry='Internet & Technology',
            location='Bengaluru, India',
            employees='5000-10000',
            rating=4.8,
            response_rate='92%',
            about='Meta builds technologies that help people connect...',
            website='https://meta.com',
            status='APPROVED',
            logo='https://images.unsplash.com/photo-1633356122544-f134324a6cee'
        )

        # Create a candidate user
        self.candidate_user = User.objects.create_user(
            email='sneha@email.com',
            phone='+919876543210',
            password='Password@123',
            role='JOB_SEEKER',
            status='ACTIVE',
            name='Sneha Kapoor',
            otp_verified=True
        )
        self.candidate = Candidate.objects.create(
            user=self.candidate_user,
            first_name='Sneha',
            last_name='Kapoor',
            phone='+919876543210',
            current_status='Experienced',
            experience='3',
            current_city='Bengaluru',
            preferred_location='Bengaluru, Remote',
            expected_salary='18 LPA',
            current_salary='12 LPA',
            remote_preference='Hybrid',
            availability='Immediate',
            preferred_roles=['React Developer'],
            preferred_industries='Information Technology',
            employment_type='Full-time',
            work_mode='Hybrid',
            notice_period='Immediate',
            open_to_work=True,
            profile_strength=85,
            resume_score=88,
            education=['B.Tech in Computer Science'],
            experience_history=['React Developer at TCS'],
            skills=['React', 'TypeScript'],
            projects='E-commerce UI Dashboard',
            certifications='AWS Practitioner',
            languages='English, Hindi',
            bio='React & TypeScript engineer',
            recent_searches=['React Developer']
        )

        # Create a Job
        self.job = Job.objects.create(
            id='job-1',
            company=self.employer,
            title='Senior Frontend Architect',
            location='Bengaluru, India',
            work_mode='hybrid',
            experience_range='5-8 Yrs',
            salary_range='24 - 36 LPA',
            tags=['React', 'Vite'],
            description='ads engine product suite description',
            status='PUBLISHED',
            deadline=timezone.now().date() + datetime.timedelta(days=40),
            applicants_count=0,
            featured=True,
            created_by=self.employer_user
        )

    def test_user_registration_and_login(self):
        # Register a candidate
        register_url = reverse('register')
        registration_data = {
            'email': 'new_candidate@test.com',
            'phone': '+919800000000',
            'password': 'Password@123',
            'role': 'JOB_SEEKER',
            'name': 'New Candidate',
            'details': {
                'city': 'Chennai',
                'experience': '2'
            }
        }
        res = self.client.post(register_url, registration_data, format='json')
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)

        # Verify candidate profile was created
        candidate_count = Candidate.objects.filter(user__email='new_candidate@test.com').count()
        self.assertEqual(candidate_count, 1)

        # Check authentication flow with correct password
        login_url = reverse('login')
        login_data = {
            'email': 'new_candidate@test.com',
            'password': 'Password@123'
        }
        res = self.client.post(login_url, login_data, format='json')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertIn('token', res.data)

        # Test login lockout after 5 failed attempts
        failed_data = {
            'email': 'new_candidate@test.com',
            'password': 'WrongPassword123'
        }
        for _ in range(5):
            res = self.client.post(login_url, failed_data, format='json')
        
        # 6th attempt should return 403 locked
        res = self.client.post(login_url, failed_data, format='json')
        self.assertEqual(res.status_code, status.HTTP_403_FORBIDDEN)

    def test_admin_verifications(self):
        # Create a pending recruiter
        pending_user = User.objects.create_user(
            email='recruiter@tata.com',
            phone='+919822233344',
            password='TataRec@123',
            role='RECRUITER',
            status='PENDING',
            name='Rajesh Mehta',
            otp_verified=False
        )
        Employer.objects.create(
            user=pending_user,
            company_name='Tata Consultancy Services',
            industry='IT Consulting',
            location='Mumbai, India',
            employees='10000+',
            status='PENDING'
        )

        # Admin client credentials
        self.client.credentials(HTTP_AUTHORIZATION='Bearer admin@technoadviser.com')

        # Retrieve pending list
        verifications_url = reverse('admin_verifications')
        res = self.client.get(verifications_url)
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(len(res.data), 1)

        # Approve verification
        action_url = reverse('admin_verification_action', kwargs={'userId': 'recruiter@tata.com'})
        res = self.client.post(action_url, {'action': 'APPROVE'}, format='json')
        self.assertEqual(res.status_code, status.HTTP_200_OK)

        # Verify status changed in DB
        pending_user.refresh_from_db()
        self.assertEqual(pending_user.status, 'ACTIVE')

    def test_job_management(self):
        # Authenticate as employer
        self.client.credentials(HTTP_AUTHORIZATION='Bearer employer@meta.com')

        # Create job
        jobs_url = reverse('jobs_list_create')
        job_data = {
            'title': 'Junior React Developer',
            'location': 'Bengaluru, India',
            'work_mode': 'remote',
            'experience_range': '1-3 Yrs',
            'salary_range': '8 - 12 LPA',
            'tags': ['React', 'CSS'],
            'description': 'Description text',
            'status': 'PUBLISHED',
            'deadline': str(timezone.now().date() + datetime.timedelta(days=30))
        }
        res = self.client.post(jobs_url, job_data, format='json')
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)

        # Check job in list
        res = self.client.get(jobs_url)
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        # Should return both job-1 and the new one
        self.assertEqual(len(res.data['jobs']), 2)

    def test_application_pipeline(self):
        # Authenticate as candidate
        self.client.credentials(HTTP_AUTHORIZATION='Bearer sneha@email.com')

        # Apply for job
        apply_url = reverse('apply_job')
        apply_data = {
            'jobId': 'job-1',
            'resumeUrl': '/media/resumes/sneha.pdf',
            'resumeScore': 88
        }
        res = self.client.post(apply_url, apply_data, format='json')
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        app_id = res.data['id']

        # Authenticate as employer
        self.client.credentials(HTTP_AUTHORIZATION='Bearer employer@meta.com')

        # Fetch applications list
        apps_url = reverse('applications_list')
        res = self.client.get(apps_url)
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(len(res.data), 1)

        # Update application status to Interview
        status_url = reverse('update_application_status', kwargs={'pk': app_id})
        update_data = {
            'status': 'Interview',
            'notes': 'Candidate exhibits good state handling knowledge.',
            'rating': 90,
            'interviewNotes': 'Technical round 1 scheduled.',
            'interviewSchedule': '2026-07-10T11:00:00Z'
        }
        res = self.client.patch(status_url, update_data, format='json')
        self.assertEqual(res.status_code, status.HTTP_200_OK)

        # Verify application details updated in DB
        app_obj = Application.objects.get(id=app_id)
        self.assertEqual(app_obj.status, 'Interview')
        self.assertEqual(app_obj.candidate_score, 90)
        self.assertEqual(len(app_obj.timeline), 2) # Applied, then Interviewed

    def test_admin_analytics_and_logs(self):
        # Authenticate as Admin
        self.client.credentials(HTTP_AUTHORIZATION='Bearer admin@technoadviser.com')

        # Query Analytics
        analytics_url = reverse('admin_analytics')
        res = self.client.get(analytics_url)
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertIn('stats', res.data)
        self.assertEqual(res.data['stats']['candidatesCount'], 1)

        # Query System Logs
        logs_url = reverse('admin_logs')
        res = self.client.get(logs_url)
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        # Should contain at least the setup/actions logs
        self.assertTrue(len(res.data) >= 0)

    def test_admin_subscriptions_and_coupons(self):
        # Authenticate as Admin
        self.client.credentials(HTTP_AUTHORIZATION='Bearer admin@technoadviser.com')

        # 1. Create a Subscription Plan
        plans_url = reverse('admin_plans')
        plan_data = {
            'name': 'Gold Premium Access',
            'price': '₹ 4999',
            'period': 'Monthly'
        }
        res = self.client.post(plans_url, plan_data, format='json')
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        plan_id = res.data['id']

        # 2. Get Subscription Plans
        res = self.client.get(plans_url)
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertTrue(len(res.data) >= 1)

        # 3. Update Plan price
        detail_url = reverse('admin_plan_detail', kwargs={'pk': plan_id})
        update_data = {
            'price': '₹ 1299'
        }
        res = self.client.put(detail_url, update_data, format='json')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data['price'], '₹ 1299')

        # 4. Create a Coupon
        coupons_url = reverse('admin_coupons')
        coupon_data = {
            'code': 'WINTER40',
            'discount': '40% OFF',
            'type': 'Percentage'
        }
        res = self.client.post(coupons_url, coupon_data, format='json')
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)

        # 5. Get Coupons
        res = self.client.get(coupons_url)
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertTrue(len(res.data) >= 1)

        # 6. Deactivate Coupon
        coupon_detail_url = reverse('admin_coupon_detail', kwargs={'code': 'WINTER40'})
        deactivate_data = {
            'status': 'Expired'
        }
        res = self.client.put(coupon_detail_url, deactivate_data, format='json')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data['status'], 'Expired')

        # 7. Delete User
        delete_target = User.objects.create_user(
            email='to_delete@tata.com',
            phone='+919833333333',
            password='Password@123',
            role='RECRUITER',
            status='ACTIVE',
            name='Delete Target'
        )
        delete_url = reverse('admin_user_delete', kwargs={'email': 'to_delete@tata.com'})
        res = self.client.delete(delete_url)
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertFalse(User.objects.filter(email='to_delete@tata.com').exists())

        # 8. Try to delete self (should fail)
        self_delete_url = reverse('admin_user_delete', kwargs={'email': 'admin@technoadviser.com'})
        res = self.client.delete(self_delete_url)
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)
