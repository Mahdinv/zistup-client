import PlaygroundFlowContainer from "@/app/layouts/playground-flow/playground-flow-container";
import Button from "@/shared/base-components/button";
import ScrollFade from "@/shared/base-components/scroll-fade";
import TablemateAccordion from "../components/tablemate-accordion";
import { PiUserPlus } from "react-icons/pi";

const TablematePage = () => {
  return (
    <PlaygroundFlowContainer>
      <div className="w-full h-full min-h-0 flex flex-col gap-3">
        <div className="flex-1 min-h-0">
          <ScrollFade>
            <div className="w-full min-h-full flex flex-col gap-3">
              <TablemateAccordion />
              <TablemateAccordion />

              <div className="w-full mt-auto border-2 border-dashed border-blue-900 rounded-2xl px-4 py-3 text-center">
                <Button
                  classes="compact:w-2/3! mobile-lg:w-1/2! laptop:w-2/5! btn btn-outline-blue border! text-xs! font-bold! rounded-xs! py-1.5!"
                  icon={<PiUserPlus className="text-5xl" strokeWidth={1} />}
                  title="افزودن همسفره"
                  iconFirst
                  itemsGap={4}
                />
              </div>
            </div>
          </ScrollFade>
        </div>

        <Button classes="btn btn-primary-green shrink-0" title="تایید" />
      </div>
    </PlaygroundFlowContainer>
  );
};

export default TablematePage;
