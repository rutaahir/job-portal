from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed
from api.models import User

class SimpleEmailAuthentication(BaseAuthentication):
    def authenticate(self, request):
        auth_header = request.headers.get('Authorization') or request.META.get('HTTP_AUTHORIZATION')
        if not auth_header:
            return None
        
        try:
            if auth_header.startswith('Bearer '):
                token = auth_header[7:].strip()
            else:
                token = auth_header.strip()
            
            if not token:
                return None
                
            user = User.objects.get(email__iexact=token)
            if user.status == 'BLOCKED':
                raise AuthenticationFailed('This user account has been administrative locked.')
            return (user, None)
        except User.DoesNotExist:
            raise AuthenticationFailed('Invalid or expired session token.')
