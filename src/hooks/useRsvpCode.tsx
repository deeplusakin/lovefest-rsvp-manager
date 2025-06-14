
import { useSecureInvitation } from "./useSecureInvitation";

export function useRsvpCode() {
  const { validateInvitationCode } = useSecureInvitation();

  return { 
    validateCode: validateInvitationCode, 
    isLoading: false // The loading state is now handled in the secure hook
  };
}
