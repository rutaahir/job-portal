from django.core.management.base import BaseCommand
from api.models import User, Candidate, Employer, Job, Application, SystemLog, SubscriptionPlan, Coupon
from django.utils import timezone
from django.contrib.auth.hashers import make_password
import datetime

class Command(BaseCommand):
    help = 'Seeds the database with initial job portal data'

    def handle(self, *args, **kwargs):
        self.stdout.write('Seeding database...')

        # 1. Clear existing data
        SubscriptionPlan.objects.all().delete()
        Coupon.objects.all().delete()
        SystemLog.objects.all().delete()
        Application.objects.all().delete()
        Job.objects.all().delete()
        Candidate.objects.all().delete()
        Employer.objects.all().delete()
        User.objects.all().delete()

        # 2. Seed Users
        users_data = [
            {
                'email': 'admin@technoadviser.com',
                'phone': '+919999999999',
                'password': 'Admin@12345',
                'role': 'ADMINISTRATOR',
                'status': 'ACTIVE',
                'name': 'Super Admin',
                'otp_verified': True
            },
            {
                'email': 'sneha@email.com',
                'phone': '+919876543210',
                'password': 'Password@123',
                'role': 'JOB_SEEKER',
                'status': 'ACTIVE',
                'name': 'Sneha Kapoor',
                'otp_verified': True
            },
            {
                'email': 'employer@meta.com',
                'phone': '+919811122233',
                'password': 'Employer@123',
                'role': 'RECRUITER',
                'status': 'ACTIVE',
                'name': 'Aditya Roy',
                'otp_verified': True
            },
            {
                'email': 'hr@acme.com',
                'phone': '+919876543212',
                'password': 'Password@123',
                'role': 'RECRUITER',
                'status': 'ACTIVE',
                'name': 'Rahul Malhotra',
                'otp_verified': True
            },
            {
                'email': 'recruiter@tata.com',
                'phone': '+919822233344',
                'password': 'TataRec@123',
                'role': 'RECRUITER',
                'status': 'PENDING',
                'name': 'Rajesh Mehta',
                'otp_verified': False
            }
        ]

        users = {}
        for u_data in users_data:
            user = User.objects.create(
                email=u_data['email'],
                phone=u_data['phone'],
                role=u_data['role'],
                status=u_data['status'],
                name=u_data['name'],
                otp_verified=u_data['otp_verified']
            )
            user.set_password(u_data['password'])
            if u_data['role'] == 'ADMINISTRATOR':
                user.is_staff = True
                user.is_superuser = True
            user.save()
            users[user.email] = user

        self.stdout.write(self.style.SUCCESS(f'Seeded {len(users)} users.'))

        # 3. Seed Employers
        employers_data = [
            {
                'user_email': 'employer@meta.com',
                'company_name': 'Meta Platforms Inc',
                'industry': 'Internet & Technology',
                'location': 'Bengaluru, India',
                'employees': '5000-10000',
                'rating': 4.8,
                'response_rate': '92%',
                'about': 'Meta builds technologies that help people connect, find communities, and grow businesses.',
                'website': 'https://meta.com',
                'status': 'APPROVED',
                'logo': 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&q=80&w=150',
                'verified_by': 'admin@technoadviser.com',
                'verified_at': timezone.now()
            },
            {
                'user_email': 'hr@acme.com',
                'company_name': 'Acme Technologies',
                'industry': 'Information Technology',
                'location': 'Bengaluru, India',
                'employees': '51-200',
                'rating': 4.5,
                'response_rate': '95%',
                'about': 'A leading global consulting and software engineering firm.',
                'website': 'https://acme.com',
                'status': 'APPROVED',
                'logo': 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=150',
                'verified_by': None,
                'verified_at': None
            },
            {
                'user_email': 'recruiter@tata.com',
                'company_name': 'Tata Consultancy Services',
                'industry': 'IT Consulting & Services',
                'location': 'Mumbai, India',
                'employees': '10000+',
                'rating': 4.1,
                'response_rate': '75%',
                'about': 'Tata Consultancy Services is an IT services, consulting and business solutions organization.',
                'website': 'https://tcs.com',
                'status': 'PENDING',
                'logo': 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=150',
                'verified_by': None,
                'verified_at': None
            }
        ]

        employers = {}
        for emp_data in employers_data:
            verified_by_user = users.get(emp_data['verified_by']) if emp_data['verified_by'] else None
            emp = Employer.objects.create(
                user=users[emp_data['user_email']],
                company_name=emp_data['company_name'],
                industry=emp_data['industry'],
                location=emp_data['location'],
                employees=emp_data['employees'],
                rating=emp_data['rating'],
                response_rate=emp_data['response_rate'],
                about=emp_data['about'],
                website=emp_data['website'],
                status=emp_data['status'],
                logo=emp_data['logo'],
                verified_by=verified_by_user,
                verified_at=emp_data['verified_at']
            )
            employers[emp.user.email] = emp

        self.stdout.write(self.style.SUCCESS(f'Seeded {len(employers)} employers.'))

        # 4. Seed Candidates
        candidate = Candidate.objects.create(
            user=users['sneha@email.com'],
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
            preferred_roles=['React Developer', 'Frontend Engineer'],
            preferred_industries='Information Technology',
            employment_type='Full-time',
            work_mode='Hybrid',
            notice_period='Immediate',
            open_to_work=True,
            profile_strength=85,
            resume_score=88,
            education='B.Tech in Computer Science, NIT Karnataka (Graduation: 2021)',
            experience_history='React Developer at TCS (2021 - Present), frontend developer intern at Razorpay',
            skills=['React', 'TypeScript', 'TailwindCSS', 'Redux', 'JavaScript', 'Node.js'],
            projects='E-commerce UI Dashboard, Realtime Collaborative Whiteboard',
            certifications='AWS Certified Cloud Practitioner, Meta Front-End Developer Certificate',
            languages='English, Hindi',
            bio='Enthusiastic React & TypeScript engineer passionate about constructing high-fidelity user experiences and slick micro-interactions.',
            recent_searches=['React Developer', 'Frontend remote', 'AI Engineer']
        )

        self.stdout.write(self.style.SUCCESS('Seeded 1 candidate.'))

        # 5. Seed Jobs
        jobs_data = [
            {
                'id': 'job-1',
                'company_email': 'hr@acme.com',
                'title': 'Senior Frontend Architect',
                'location': 'Bengaluru, India',
                'work_mode': 'hybrid',
                'experience_range': '5-8 Yrs',
                'salary_range': '24 - 36 LPA',
                'tags': ['React', 'Vite', 'TailwindCSS', 'TypeScript'],
                'description': 'We are seeking a Senior Frontend Architect to spearhead design and implementation of highly scalable, accessible user interfaces for our ads engine product suite. Work closely with product managers and backend engineering teams to deploy micro-frontends.',
                'status': 'PUBLISHED',
                'deadline': timezone.now().date() + datetime.timedelta(days=40),
                'applicants_count': 15,
                'featured': True,
                'created_by': 'hr@acme.com'
            },
            {
                'id': 'job-2',
                'company_email': 'hr@acme.com',
                'title': 'AI Fullstack Developer',
                'location': 'Remote',
                'work_mode': 'remote',
                'experience_range': '3-6 Yrs',
                'salary_range': '18 - 30 LPA',
                'tags': ['NextJS', 'Python', 'FastAPI', 'Gemini API'],
                'description': 'Join our special projects task force to build groundbreaking AI assistant pipelines. You will leverage the latest Gemini SDK models to craft features such as auto-summarization, vector-grounded document search, and real-time audio chat engines.',
                'status': 'PUBLISHED',
                'deadline': timezone.now().date() + datetime.timedelta(days=55),
                'applicants_count': 24,
                'featured': True,
                'created_by': 'hr@acme.com'
            },
            {
                'id': 'job-3',
                'company_email': 'hr@acme.com',
                'title': 'UI Developer (Product Design)',
                'location': 'Hyderabad, India',
                'work_mode': 'onsite',
                'experience_range': '1-3 Yrs',
                'salary_range': '8 - 14 LPA',
                'tags': ['React', 'CSS Grid', 'Framer Motion'],
                'description': 'Craft beautiful UI designs from Figma prototypes, and animate user workflows with Framer Motion. Ensure flawless responsive rendering across diverse devices.',
                'status': 'DRAFT',
                'deadline': timezone.now().date() + datetime.timedelta(days=60),
                'applicants_count': 0,
                'featured': False,
                'created_by': 'hr@acme.com'
            }
        ]

        jobs = {}
        for j_data in jobs_data:
            job = Job.objects.create(
                id=j_data['id'],
                company=employers[j_data['company_email']],
                title=j_data['title'],
                location=j_data['location'],
                work_mode=j_data['work_mode'],
                experience_range=j_data['experience_range'],
                salary_range=j_data['salary_range'],
                tags=j_data['tags'],
                description=j_data['description'],
                status=j_data['status'],
                deadline=j_data['deadline'],
                applicants_count=j_data['applicants_count'],
                featured=j_data['featured'],
                created_by=users[j_data['created_by']]
            )
            jobs[job.id] = job

        self.stdout.write(self.style.SUCCESS(f'Seeded {len(jobs)} jobs.'))

        # 6. Seed Application
        app = Application.objects.create(
            id='app-1',
            job=jobs['job-1'],
            candidate=candidate,
            status='Shortlisted',
            resume_score=88,
            timeline=[
                { 'status': 'Applied', 'timestamp': '2026-07-02T10:00:00Z', 'note': 'Application dispatched successfully.' },
                { 'status': 'Screening', 'timestamp': '2026-07-03T14:30:00Z', 'note': 'Parsed attributes match core skillset constraints.' },
                { 'status': 'Shortlisted', 'timestamp': '2026-07-05T09:00:00Z', 'note': 'Recommended for Round 1 technical interview.' }
            ],
            notes='Strong understanding of React Hooks and client rendering performance.',
            ranking_score=92,
            created_by=users['sneha@email.com']
        )

        self.stdout.write(self.style.SUCCESS('Seeded 1 application.'))

        # 7. Seed System Logs
        SystemLog.objects.create(
            id='log-1',
            type='AUDIT',
            message='System databases successfully booted and seeded.'
        )

        self.stdout.write(self.style.SUCCESS('Seeded 1 system log.'))

        # 8. Seed Subscription Plans & Coupons
        SubscriptionPlan.objects.create(id='plan-1', name='Basic Sourcing Plan', price='₹ 0', period='Monthly', users_count=5245, status='Active')
        SubscriptionPlan.objects.create(id='plan-2', name='Pro Recruiter Plan', price='₹ 999', period='Monthly', users_count=8765, status='Active')
        SubscriptionPlan.objects.create(id='plan-3', name='Pro Plus Sourcing', price='₹ 2499', period='Monthly', users_count=3245, status='Active')
        SubscriptionPlan.objects.create(id='plan-4', name='Enterprise Corporate Suite', price='₹ 9999', period='Monthly', users_count=1510, status='Active')

        Coupon.objects.create(code='WELCOME50', discount='50% OFF', type='Percentage', usage=1240, status='Active')
        Coupon.objects.create(code='MONSOONFREE', discount='₹ 2000 Flat', type='Flat Amount', usage=450, status='Active')
        Coupon.objects.create(code='RECRUIT30', discount='30% OFF', type='Percentage', usage=890, status='Expired')

        self.stdout.write(self.style.SUCCESS('Seeded 4 subscription plans and 3 coupons.'))
        self.stdout.write(self.style.SUCCESS('Database seeding completed.'))
