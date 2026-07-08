import random
import time
from django.db.models.signals import post_save
from django.dispatch import receiver
from api.models import Candidate, Resume, ResumeAnalysis, Application, JobMatchAnalysis, Job, InterviewSession, AIRecommendation

@receiver(post_save, sender=Candidate)
def candidate_profile_updated(sender, instance, created, **kwargs):
    """
    Profile updated signal -> recalculates candidate profile strength.
    Uses update() to avoid infinite recursion.
    """
    total_fields = 8
    filled = 0
    if instance.first_name: filled += 1
    if instance.skills: filled += 1
    if instance.experience_history: filled += 1
    if instance.education: filled += 1
    if instance.bio: filled += 1
    if instance.phone: filled += 1
    if instance.linkedin: filled += 1
    if instance.portfolio: filled += 1
    strength = int((filled / total_fields) * 100)
    
    if instance.profile_strength != strength:
        Candidate.objects.filter(pk=instance.pk).update(profile_strength=strength)

@receiver(post_save, sender=Resume)
def resume_uploaded(sender, instance, created, **kwargs):
    """
    Resume uploaded signal -> automatically parses resume and inserts/replaces latest ResumeAnalysis details.
    """
    if created:
        from api.copilot_utils import generate_resume_analysis
        analysis = generate_resume_analysis(instance.candidate, instance.name, instance.content_text)
        
        ra_id = f"anl-{int(time.time() * 1000)}"
        ResumeAnalysis.objects.create(
            id=ra_id,
            candidate=instance.candidate,
            resume=instance,
            ats_score=analysis['ats_score'],
            formatting_score=analysis['formatting_score'],
            grammar_score=analysis['grammar_score'],
            keyword_score=analysis['keyword_score'],
            analysis_data=analysis['analysis_data']
        )
        
        Candidate.objects.filter(pk=instance.candidate.pk).update(resume_score=analysis['ats_score'])

@receiver(post_save, sender=Application)
def job_applied(sender, instance, created, **kwargs):
    """
    Job applied signal -> computes a live JobMatchAnalysis index and increments employer counter metrics.
    """
    if created:
        from api.copilot_utils import generate_job_match_explanation
        match_data = generate_job_match_explanation(instance.candidate, instance.job)
        
        jm_id = f"match-{int(time.time() * 1000)}"
        JobMatchAnalysis.objects.get_or_create(
            id=jm_id,
            defaults={
                'candidate': instance.candidate,
                'job': instance.job,
                'match_score': match_data['match_score'],
                'analysis_data': match_data['analysis_data']
            }
        )
        
        # Safely increment job applicants count
        current_count = instance.job.applicants_count
        Job.objects.filter(pk=instance.job.pk).update(applicants_count=current_count + 1)

@receiver(post_save, sender=InterviewSession)
def mock_interview_completed(sender, instance, created, **kwargs):
    """
    Interview completed signal -> generates recommendation suggestions based on mock test ratings.
    """
    if instance.completed:
        rec_id = f"rec-{int(time.time() * 1000)}"
        AIRecommendation.objects.get_or_create(
            id=rec_id,
            defaults={
                'candidate': instance.candidate,
                'category': 'interview',
                'recommendation_text': f"You completed a mock interview round for {instance.role} with a score of {instance.evaluation.get('overall_score', 0)}%. Review comments to improve.",
                'metadata': {'session_id': instance.id}
            }
        )

@receiver(post_save, sender=Job)
def new_job_published(sender, instance, created, **kwargs):
    """
    New job published signal -> matches tags across all active candidates to prompt recommended jobs.
    """
    if created and instance.status == 'PUBLISHED':
        job_tags = [t.lower() for t in instance.tags] if isinstance(instance.tags, list) else []
        if job_tags:
            candidates = Candidate.objects.all()
            for index, cand in enumerate(candidates):
                cand_skills = [s.lower() for s in cand.skills] if isinstance(cand.skills, list) else []
                intersection = set(job_tags).intersection(set(cand_skills))
                if len(intersection) >= 2:
                    rec_id = f"rec-{int(time.time() * 1000)}-{index}"
                    AIRecommendation.objects.get_or_create(
                        id=rec_id,
                        defaults={
                            'candidate': cand,
                            'category': 'jobs',
                            'recommendation_text': f"New high-match job: {instance.title} at {instance.company.company_name}. Complete your application early.",
                            'metadata': {'job_id': instance.id}
                        }
                    )
