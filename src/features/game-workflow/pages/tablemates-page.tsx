import PlaygroundFlowContainer from "@/app/layouts/playground-flow/playground-flow-container";
import Button from "@/shared/base-components/button";
import ScrollFade from "@/shared/base-components/scroll-fade";
import TablemateAccordion from "../components/tablemate-accordion";
import { PiUserPlus } from "react-icons/pi";
import {
  FormProvider,
  useFieldArray,
  useForm,
  useWatch,
  type SubmitHandler,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  tablematesFormSchema,
  type TablematesForm,
} from "../schemas/tablemates.schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { normalizeApiError } from "@/shared/api";
import { addTablemates } from "../api/tablemates.api";
import GameCompletedModal from "../components/game-completed-modal";
import { useState } from "react";

const TablematesPage = () => {
  const [modal, setModal] = useState(false);
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: addTablemates,
    onSuccess: async () => {
      setModal(true);
      queryClient.invalidateQueries({
        queryKey: ["roadMapList"],
      });
    },
    onError: (error) => {
      const apiError = normalizeApiError(error);
      toast.error(apiError.message);
    },
  });

  const methods = useForm<TablematesForm>({
    defaultValues: {
      tablemates: [
        {
          name: "",
          sharedMealsCount: 0,
          relationshipLevel: "",
          influenceLevel: "",
        },
      ],
    },
    resolver: zodResolver(tablematesFormSchema),
  });

  const { control, handleSubmit } = methods;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "tablemates",
  });

  const onAddAccordionHandler = () => {
    if (items.length >= 10) {
      toast.error("شما می‌توانید حداکثر ۱۰ همسفر به لیست خود اضافه کنید");
      return;
    }
    append({
      name: "",
      sharedMealsCount: 0,
      relationshipLevel: "",
      influenceLevel: "",
    });
  };

  const items = useWatch({ control, name: "tablemates" });

  const onAddTablematesHandler: SubmitHandler<TablematesForm> = (data) =>
    mutate(data);
  return (
    <PlaygroundFlowContainer>
      {modal && (
        <GameCompletedModal
          open={modal}
          step={2}
          nextGameLink="/game-workflow/past-week-intake"
        />
      )}
      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit(onAddTablematesHandler)}
          className="w-full h-full min-h-0 flex flex-col gap-3"
        >
          <div className="flex-1 min-h-0">
            <ScrollFade>
              <div className="w-full min-h-full flex flex-col gap-3">
                {fields.map((field, index) => (
                  <TablemateAccordion
                    key={field.id}
                    index={index}
                    isOpen={fields.length === index + 1}
                    tablematesNumber={index + 1}
                    onRemoveClick={() => {
                      if (fields.length === 1) return;
                      remove(index);
                    }}
                  />
                ))}

                <div className="w-full mt-auto border-2 border-dashed border-blue-900 rounded-2xl px-4 py-3 text-center">
                  <Button
                    type="button"
                    classes="compact:w-2/3! mobile-lg:w-1/2! laptop:w-2/5! btn btn-outline-blue border! compact:text-xs! fold:text-sm! laptop:text-base! font-bold! rounded-xs! py-1.5!"
                    icon={
                      <PiUserPlus
                        className="compact:text-5xl fold:text-6xl laptop:text-7xl"
                        strokeWidth={1}
                      />
                    }
                    title="افزودن همسفره"
                    iconFirst
                    itemsGap={4}
                    onClick={onAddAccordionHandler}
                    disable={isPending}
                  />
                </div>
              </div>
            </ScrollFade>
          </div>

          <Button classes="btn btn-primary-green shrink-0" title="تایید" />
        </form>
      </FormProvider>
    </PlaygroundFlowContainer>
  );
};

export default TablematesPage;
