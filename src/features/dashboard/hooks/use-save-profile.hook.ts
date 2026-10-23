import { useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { normalizeApiError } from "@/shared/api";
import { useUserProfileStore } from "@/shared/stores/user-profile.store";
import { userProfileQueryKey } from "@/shared/hooks/use-user-profile-query.hook";
import { addBasicInformation } from "@/features/onboarding/api/onboarding.api";
import type {
  ProfileBasicInformation,
  ProfileGoalInformation,
} from "@/features/onboarding/schemas/basic-information.schema";
export default function useSaveProfile(
  onSaved: () => void,
  onBusyChange: (busy: boolean) => void,
) {
  const queryClient = useQueryClient();
  const submitting = useRef(false);
  const { mutate, isPending } = useMutation({
    mutationFn: addBasicInformation,
    onSuccess: (_, values) => {
      // Cancel stale reads before publishing the saved fields to both consumers.
      void queryClient.cancelQueries({ queryKey: userProfileQueryKey });
      const current = useUserProfileStore.getState().user;
      if (current) {
        const saved = {
          ...current,
          ...values,
          sex: "sex" in values ? values.sex! : current.sex,
        };
        queryClient.setQueryData(userProfileQueryKey, saved);
        useUserProfileStore.getState().setUser(saved);
      }
      toast.success("اطلاعات با موفقیت ثبت شد");
      onSaved();
      void queryClient.invalidateQueries({ queryKey: userProfileQueryKey });
    },
    onError: (error) => {
      toast.error(normalizeApiError(error).message);
    },
    onSettled: () => {
      submitting.current = false;
      onBusyChange(false);
    },
  });
  const submit = (values: ProfileBasicInformation | ProfileGoalInformation) => {
    // A synchronous guard also covers submissions before React re-renders.
    if (submitting.current) return;
    submitting.current = true;
    onBusyChange(true);
    mutate(values);
  };

  return { submit, isPending };
}
