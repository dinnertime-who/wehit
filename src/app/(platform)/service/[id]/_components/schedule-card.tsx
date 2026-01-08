import { Calendar, MapPin } from "lucide-react";

type Props = {
  scheduleType: "flexible" | "fixed";
  scheduleDescription?: string;
  location: string;
  locationDetail?: string;
  isSelected?: boolean;
  onClick?: () => void;
};

export function ScheduleCard(props: Props) {
  return (
    <div
      className={`w-[45%] min-w-[45%] rounded-md border-[1.5px] px-4 py-3 md:min-w-full md:p-4 cursor-pointer hover:bg-taling-gray-50 ${
        props.isSelected
          ? "border-taling-pink"
          : "border-taling-gray-200"
      }`}
      onClick={props.onClick}
    >
      <div className="relative flex w-full gap-3">
        <div
          className={`absolute left-0 top-0 mt-0 flex h-4 w-4 shrink-0 items-center justify-center rounded-full sm:mt-1 md:relative ${
            props.isSelected
              ? "bg-taling-pink"
              : "bg-taling-gray-200"
          }`}
        >
          {props.isSelected && (
            <div className="h-2 w-2 rounded-full bg-white" />
          )}
        </div>
        <div className="flex h-full w-full flex-col items-center gap-3 md:flex-row">
          <div className="mt-6 flex w-full flex-col gap-4 md:mt-0">
            <div className="flex items-start gap-1">
              <Calendar className="text-taling-gray-700 mt-[0.1rem] h-4 w-4 shrink-0 text-sm" />
              <div>
                <p className="text-black text-sm font-semibold">
                  {props.scheduleType === "flexible"
                    ? "협의 가능"
                    : "고정 일정"}
                </p>
                <p className="text-taling-gray-600 text-xs">
                  {props.scheduleDescription ||
                    (props.scheduleType === "flexible"
                      ? "메세지로 조율해요"
                      : "")}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-1">
              <MapPin className="text-taling-gray-700 mt-[0.1rem] h-4 w-4 shrink-0" />
              <div>
                <p className="text-black text-sm font-medium">
                  {props.location}
                </p>
                {props.locationDetail && (
                  <p className="text-taling-gray-600 text-xs">
                    {props.locationDetail}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
